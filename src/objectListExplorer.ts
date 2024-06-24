import * as vscode from "vscode"
import client from "./devkitClient"

type ObjectEntry = {
	index: number,
	tagHandle: number,
	tagPath: string
	objectType: string,
	parentIndex: number,
	name?: string
}

export class ObjectListProvider implements vscode.TreeDataProvider<ObjectTreeItem> {
	_onDidChangeTreeData: vscode.EventEmitter<ObjectTreeItem | undefined | void> = new vscode.EventEmitter<ObjectTreeItem | undefined | void>()
	readonly onDidChangeTreeData: vscode.Event<ObjectTreeItem | undefined | void> = this._onDidChangeTreeData.event

	private objects: ObjectEntry[] = [];

	constructor(private workspaceRoot: string | undefined) {
		client.conn.devkit.getObjectList().then((objectList?: ObjectEntry[]) => {
			if (!objectList) {
				vscode.window.showErrorMessage("Failed to get tag list from devkit server")
				return
			}
			this.objects = objectList;
			this._onDidChangeTreeData.fire();
		});
	}

	refresh(): void {
		client.conn.devkit.getObjectList().then((objectList?: ObjectEntry[]) => {
			if (!objectList) {
				vscode.window.showErrorMessage("Failed to get tag list from devkit server")
				return
			}
			this.objects = objectList;
			this._onDidChangeTreeData.fire();
		});
	}

	getTreeItem(element: ObjectTreeItem): vscode.TreeItem {
		return element
	}

	getChildren(element?: ObjectTreeItem): Thenable<ObjectTreeItem[]> {
		if (!element) {
            return Promise.resolve(this.getChildrenItems());
        }
        return Promise.resolve(this.getChildrenItems(element.elem.index));
	}

	deleteItem(item: ObjectTreeItem): void {
			client.conn.engine.gameState.deleteObject(item.elem.index).then(() => {
				this.refresh();
			}
		);
	}

    private getChildrenItems(parentIndex: number = -1): ObjectTreeItem[] {
        return this.objects
            .filter(item => item.parentIndex === parentIndex)
            .map(item => new ObjectTreeItem(
				item,
                `${item.index}: ${item.name || item.tagPath.split('\\').pop()}`,
				this.objects.find(object => object.parentIndex == item.index) ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
            ));
    }
}

export class ObjectTreeItem extends vscode.TreeItem {
    children: ObjectTreeItem[] | undefined;

    constructor(
        public readonly elem: ObjectEntry,
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(elem.name || elem.tagPath, collapsibleState);
        this.description = elem.objectType;
		this.tooltip = elem.tagPath;
		this.iconPath = new vscode.ThemeIcon("symbol-constructor");
		this.contextValue
    }
}
