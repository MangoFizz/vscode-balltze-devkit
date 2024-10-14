import * as vscode from "vscode"
import client from "../utilities/devkitClient"
import MetaEnginePlayer from "../types/MetaEnginePlayer"
import { TagEntry } from "../types/EngineTag";
import { camelCaseToSnakeCase } from "../utilities/naming";

const balltzeOutput: vscode.OutputChannel = vscode.window.createOutputChannel("Balltze Devkit");

export class TagsTreeDataProvider implements vscode.TreeDataProvider<TagTreeItem> {
	_onDidChangeTreeData: vscode.EventEmitter<TagTreeItem | undefined | void> = new vscode.EventEmitter<TagTreeItem | undefined | void>()
	readonly onDidChangeTreeData: vscode.Event<TagTreeItem | undefined | void> = this._onDidChangeTreeData.event

	private tagsData: TagEntry[] = [];
	private tagTree: TagTreeItem[] = [];
	private tagTreeItemsList: TagTreeItem[] = [];

	constructor(private workspaceRoot: string | undefined) {
		this.refresh();
	}

	refresh(): void {
		client.conn.devkit.getTagList().then((tagList?: TagEntry[]) => {
			if (!tagList) {
				vscode.window.showErrorMessage("Failed to get tag list from devkit server");
				return;
			}
			this.tagsData = tagList.map(tag => { 
				tag.class = camelCaseToSnakeCase(tag.class); 
				return tag; 
			});
			this.buildTagsTree(this.tagsData);
			this._onDidChangeTreeData.fire();
		});
	}

	getTreeItem(item: TagTreeItem): vscode.TreeItem {
		return item;
	}

	getTagEntry(tagHandle: number): TagEntry | undefined {
		return this.tagsData.find(tag => tag.handle === tagHandle);
	}

	getTreeItemByTagHandle(tagHandle: number): TagTreeItem | undefined {
		return this.tagTreeItemsList.find(item => item.tagEntry?.handle === tagHandle);
	}

	getChildren(item?: TagTreeItem): Thenable<TagTreeItem[]> {
		return Promise.resolve(item ? item.children || [] : this.tagTree);
	}

	getParent(element: TagTreeItem): TagTreeItem | undefined {
		return element.parent;
	}

	private buildTagsTree(items: TagEntry[]): void {
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

				// Set parent for children
				if (treeItem.children) {
					treeItem.children.forEach(child => {
						child.parent = treeItem;
					});
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

				this.tagTreeItemsList.push(treeItem);

                return treeItem;
            });
        };

        this.tagTree = createTreeItems(root);
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

	async showTagQuickPick(validClasses: string[]): Promise<TagEntry | undefined> {
		let currentLevelItems: TagTreeItem[] = this.tagTree;
		let parent: TagTreeItem | undefined;
		while (true) {
			let quickPickItems: vscode.QuickPickItem[] = [];
			if(parent) {
				quickPickItems.push({ label: "..", iconPath: new vscode.ThemeIcon("folder") } as vscode.QuickPickItem);
			}
			quickPickItems = quickPickItems.concat(
				currentLevelItems
					.filter(item => !item.isFile || item.tagEntry && validClasses.includes(item.tagEntry.class))
					.map(item => new TagQuickPickItem(item))
			);
			
			const item = await vscode.window.showQuickPick<vscode.QuickPickItem>(quickPickItems, {
				placeHolder: "Select a tag",
				canPickMany: false,
				title: `Choose a tag from ${parent?.path || "/"}`
			});

			if(!item) {
				return;
			}

			if(item.label === "..") {
				if(parent && parent.parent) {
					parent = parent.parent;
					currentLevelItems = parent?.children || [];
				}
				else {
					parent = undefined;
					currentLevelItems = this.tagTree;
				}
			}
			
			if(item instanceof TagQuickPickItem) {
				if(item.tagTreeItem.isFile) {
					return item.tagTreeItem.tagEntry;
				}
				parent = item.tagTreeItem;
				currentLevelItems = item.tagTreeItem.children || [];
			}
		}
	}
}

export class TagTreeItem extends vscode.TreeItem {
    public children: TagTreeItem[] | undefined;
	public parent: TagTreeItem | undefined;

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly isFile: boolean,
		public readonly path: string,
		public readonly tagEntry?: TagEntry
    ) {
        super(label, collapsibleState);
		this.resourceUri = vscode.Uri.file(path);
		this.tooltip = path;
        if(isFile && tagEntry) {
			this.description = this.isFile ? tagEntry.class : undefined;
			this.command = {
				command: "tagsExplorer.openEditor",
				title: "Open tag editor",
				arguments: [this]
			};
		}
    }

	contextValue = this.isFile
		? this.tagEntry?.class === "vehicle" ||
		  this.tagEntry?.class === "unit" ||
		  this.tagEntry?.class === "weapon" ||
		  this.tagEntry?.class === "device" ||
		  this.tagEntry?.class === "scenery" ||
		  this.tagEntry?.class === "biped" ||
		  this.tagEntry?.class === "equipment" ||
		  this.tagEntry?.class === "garbage" ||
		  this.tagEntry?.class === "projectile" ||
		  this.tagEntry?.class === "device_machine" ||
		  this.tagEntry?.class === "device_light_fixture" ||
		  this.tagEntry?.class === "placeholder"
			? "object"
			: "tag"
		: "folder"
}

class TagQuickPickItem implements vscode.QuickPickItem {
	label: string;
	kind?: vscode.QuickPickItemKind | undefined;
	description?: string | undefined;
	detail?: string | undefined;
	picked?: boolean | undefined;
	alwaysShow?: boolean | undefined;
	buttons?: readonly vscode.QuickInputButton[] | undefined;
	iconPath?: string | vscode.Uri | { light: string | vscode.Uri; dark: string | vscode.Uri } | vscode.ThemeIcon | undefined;

	constructor(public readonly tagTreeItem: TagTreeItem, itemLabel?: string) {
		const { tagEntry } = tagTreeItem;
		this.label = itemLabel ? itemLabel : tagTreeItem.label;
		this.kind = vscode.QuickPickItemKind.Default;
		this.description = tagTreeItem.isFile ? tagEntry?.class : "";
		this.picked = false;
		this.alwaysShow = true;
		this.iconPath = tagTreeItem.isFile ? new vscode.ThemeIcon("file") : new vscode.ThemeIcon("folder");
	}
};
