import * as vscode from "vscode"
import client from "../utilities/devkitClient"
import { camelCaseToNormal, camelCaseToSnakeCase } from "../utilities/naming";

type ObjectEntry = {
	index: number;
	tagHandle: number;
	tagPath: string;
	objectType: string;
	parentIndex: number;
	name?: string;
};

export class ObjectsTreeDataProvider implements vscode.TreeDataProvider<ObjectsTreeItem> {
	_onDidChangeTreeData: vscode.EventEmitter<ObjectsTreeItem | undefined | void> = new vscode.EventEmitter<ObjectsTreeItem | undefined | void>()
	readonly onDidChangeTreeData: vscode.Event<ObjectsTreeItem | undefined | void> = this._onDidChangeTreeData.event

	private objects: ObjectEntry[] = [];

	constructor(private workspaceRoot: string | undefined) {
		this.refresh();
	}

	refresh(): void {
		client.conn.devkit.getObjectList().then((objectList?: ObjectEntry[]) => {
			if (!objectList) {
				vscode.window.showErrorMessage("Failed to get tag list from devkit server")
				return
			}
			this.objects = objectList.map(obj => { 
				obj.objectType = camelCaseToNormal(obj.objectType); 
				return obj; 
			});
			this.objects = objectList;
			this._onDidChangeTreeData.fire();
		});
	}

	getTreeItem(element: ObjectsTreeItem): vscode.TreeItem {
		return element
	}

	getChildren(element?: ObjectsTreeItem): Thenable<ObjectsTreeItem[]> {
		if (!element) {
            return Promise.resolve(this.getChildrenItems());
        }
        return Promise.resolve(this.getChildrenItems(element.elem.index));
	}

	deleteItem(item: ObjectsTreeItem): void {
			client.conn.engine.gameState.deleteObject(item.elem.index).then(() => {
				this.refresh();
			}
		);
	}

    private getChildrenItems(parentIndex: number = -1): ObjectsTreeItem[] {
        return this.objects
            .filter(item => item.parentIndex === parentIndex)
            .map(item => new ObjectsTreeItem(
				item,
                `${item.index}: ${item.name || item.tagPath.split('\\').pop()}`,
				this.objects.find(object => object.parentIndex == item.index) ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
            ));
    }
}

export class ObjectsTreeItem extends vscode.TreeItem {
    children: ObjectsTreeItem[] | undefined;

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
