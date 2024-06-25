import * as vscode from "vscode"
import client from "../utilities/devkitClient"
import MetaEnginePlayer from "../types/MetaEnginePlayer"
import { TagEntry } from "../types/EngineTag";

const balltzeOutput: vscode.OutputChannel = vscode.window.createOutputChannel("Balltze Devkit");

export class TagTreeDataProvider implements vscode.TreeDataProvider<TagTreeItem> {
	_onDidChangeTreeData: vscode.EventEmitter<TagTreeItem | undefined | void> = new vscode.EventEmitter<TagTreeItem | undefined | void>()
	readonly onDidChangeTreeData: vscode.Event<TagTreeItem | undefined | void> = this._onDidChangeTreeData.event

	private tags: TagEntry[] = [];
	private tagTree: TagTreeItem[] = [];

	constructor(private workspaceRoot: string | undefined) {
		client.conn.devkit.getTagList().then((tagList?: TagEntry[]) => {
			if (!tagList) {
				vscode.window.showErrorMessage("Failed to get tag list from devkit server");
				return;
			}
			this.tags = tagList;
			this.tagTree = this.getFileSystemItems(this.tags);
			this._onDidChangeTreeData.fire();
		});
	}

	refresh(): void {
		client.conn.devkit.getTagList().then((tagList?: TagEntry[]) => {
			if (!tagList) {
				vscode.window.showErrorMessage("Failed to get tag list from devkit server");
				return;
			}
			this.tags = tagList;
			this.tagTree = this.getFileSystemItems(this.tags);
			this._onDidChangeTreeData.fire();
		});
	}

	getTreeItem(item: TagTreeItem): vscode.TreeItem {
		return item;
	}

	getChildren(item?: TagTreeItem): Thenable<TagTreeItem[]> {
		return Promise.resolve(item ? item.children || [] : this.tagTree);
	}

	private getFileSystemItems(items: TagEntry[]): TagTreeItem[] {
        let root: any = {};

		items.sort((a, b) => {
			if (a.path < b.path) {
				return -1;
			}
			if (a.path > b.path) {
				return 1;
			}
			return 0;
		});

        items.forEach(item => {
            const fullPath = item.path + "." + item.class;
            const parts = fullPath.split('\\');
            let current = root;

            parts.forEach((part, index) => {
                if (!current[part]) {
					let isFile = index === parts.length - 1;
                    current[part] = {
						name: part,
                        isFile: isFile,
                        entry: item,
                        children: {}
                    };
                }
                current = current[part].children;
            });
        });

		const removeExtensionFromPath = (path: string): string => {
			const parts = path.split('.');
			if (parts.length > 1) {
				parts.pop();
			}
			return parts.join('.');
		}

        const createTreeItems = (node: any, parentPath: string = ''): TagTreeItem[] => {
            return Object.keys(node).map(key => {
                const fullPath = `${parentPath}/${key}`;

                const treeItem = new TagTreeItem(
                    removeExtensionFromPath(key),
                    node[key].isFile ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed,
                    node[key].isFile,
					fullPath,
					node[key].entry
                );

                if (!node[key].isFile) {
                    treeItem.children = createTreeItems(node[key].children, fullPath);
                }

				// sort items alphabetically and put folders first
				if (treeItem.children) {
					treeItem.children.sort((a, b) => {
						if (a.isFile && !b.isFile) {
							return 1;
						}
						if (!a.isFile && b.isFile) {
							return -1;
						}
						if (a.label < b.label) {
							return -1;
						}
						if (a.label > b.label) {
							return 1;
						}
						return 0;
					});
				}

                return treeItem;
            });
        };

        return createTreeItems(root);
    }

	async spawnObject(item: TagTreeItem): Promise<void> {
		vscode.window.showInformationMessage(`Spawning object: ${item.label}`);
		const position = { x: 0, y: 0, z: 0 };
		const player = await client.conn.engine.gameState.getPlayer() as MetaEnginePlayer | undefined;
		if (player) {
			position.x = player.position.x;
			position.y = player.position.y;
			position.z = player.position.z + 1;
		}
		if(item.tagEntry == null) {
			balltzeOutput.appendLine(`Tag entry is null`);
			return;
		}
		const handle = item.tagEntry.handle;
		const result = await client.conn.engine.gameState.createObject(handle, 0xFFFFFFFF, position);
		if (result) {
			balltzeOutput.appendLine(`Spawned object: ${item.label}`);
		} else {
			balltzeOutput.appendLine(`Failed to spawn object`);
		}
	}
}

export class TagTreeItem extends vscode.TreeItem {
    children: TagTreeItem[] | undefined;

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly isFile: boolean,
		public readonly path: string,
		public readonly tagEntry?: TagEntry,
    ) {
        super(label, collapsibleState);
		this.resourceUri = vscode.Uri.file(path);
		this.tooltip = path;
        if(isFile && tagEntry) {
			this.description = this.isFile ? tagEntry.class : undefined;
			this.tooltip = `${path}.${tagEntry.class}`
			this.command = {
				command: "tagsExplorer.openPanel",
				title: "Open tag editor",
				arguments: [this]
			};
		}
    }

	contextValue = this.isFile ? 'tag' : 'folder';
}
