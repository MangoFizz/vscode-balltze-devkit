"use strict"

import * as vscode from "vscode"

import { TagListProvider } from "./tagListTree"
import { initialize as initializeDevkitClient } from "./devkitClient"
import { ObjectListProvider } from "./objectListExplorer"
import { ComponentGalleryPanel } from "./panels/ComponentGalleryPanel"

export function activate(context: vscode.ExtensionContext) {
	const rootPath =
		vscode.workspace.workspaceFolders &&
		vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: undefined

	// Connect to devkit server
	initializeDevkitClient(
		vscode.workspace.getConfiguration("balltzeDevkit").get("host") ||
			"localhost",
		vscode.workspace.getConfiguration("balltzeDevkit").get("port") || 19190
	)

	const tagListProvider = new TagListProvider(rootPath)
	vscode.window.registerTreeDataProvider("tagsExplorer", tagListProvider)

	vscode.commands.registerCommand("tagsExplorer.refreshEntry", () =>
		tagListProvider.refresh()
	)

	const objectListProvider = new ObjectListProvider(rootPath);
	vscode.window.registerTreeDataProvider("objectsExplorer", objectListProvider)
	
	vscode.commands.registerCommand("objectsExplorer.refreshEntry", () =>
		objectListProvider.refresh()
	)
	vscode.commands.registerCommand("objectsExplorer.delete", (item: any) => {
		vscode.window.showInformationMessage(`Deleting ${item.label}`)
		objectListProvider.deleteItem(item)
	})

	const showGalleryCommand = vscode.commands.registerCommand("component-gallery-react.showGallery", () => {
		ComponentGalleryPanel.render(context.extensionUri);
	});
	
	// Add command to the extension context
	context.subscriptions.push(showGalleryCommand);
}
