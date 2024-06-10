import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import client from "./devkitClient"

const balltzeOutput: vscode.OutputChannel =
	vscode.window.createOutputChannel("Balltze Devkit")

type TagEntry = {
	path: string
	handle: number
	class: string
}

export class DepNodeProvider implements vscode.TreeDataProvider<TagTreeItem> {
	_onDidChangeTreeData: vscode.EventEmitter<TagTreeItem | undefined | void> =
		new vscode.EventEmitter<TagTreeItem | undefined | void>()
	readonly onDidChangeTreeData: vscode.Event<TagTreeItem | undefined | void> =
		this._onDidChangeTreeData.event

	private tags: TagEntry[] = [];
	private tagTree: TagTreeItem[] = [];

	constructor(private workspaceRoot: string | undefined) {
		client.conn.devkit.getTagList().then((tagList: TagEntry[]) => {
			this.tags = tagList;
			this.tagTree = this.getFileSystemItems(this.tags);
			this._onDidChangeTreeData.fire();
		});
	}

	refresh(): void {
		this._onDidChangeTreeData.fire()
	}

	getTreeItem(element: TagTreeItem): vscode.TreeItem {
		return element
	}

	getChildren(element?: TagTreeItem): Thenable<TagTreeItem[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage("No dependency in empty workspace")
			return Promise.resolve([])
		}

		return Promise.resolve(element ? element.children || [] : this.tagTree);
	}

	private getFileSystemItems(items: TagEntry[]): TagTreeItem[] {
        let root: any = {};

        items.forEach(item => {
            const fullPath = item.path + "." + item.class
            const parts = fullPath.split('\\');
            let current = root;

            parts.forEach((part, index) => {
                if (!current[part]) {
                    current[part] = {
						tagName: part,
                        isFile: index === parts.length - 1,
                        children: {},
                        handle: item.handle,
						tagClass: item.class
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
                    fullPath,
					node[key].tagClass,
                    node[key].isFile,
                    node[key].handle
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

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p)
		} catch (err) {
			return false
		}

		return true
	}
}

export class TagTreeItem extends vscode.TreeItem {
    children: TagTreeItem[] | undefined;

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly path: string,
		public readonly tagClass: string,
        public readonly isFile: boolean,
        public readonly handle: number
    ) {
        super(label, collapsibleState);
        this.description = this.isFile ? this.tagClass : undefined;
		this.iconPath = new vscode.ThemeIcon(this.isFile ? "file" : "folder");
    }
}
