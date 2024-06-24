"use strict"

import * as vscode from "vscode"

import { initialize as initializeDevkitClient } from "./utilities/devkitClient"
import { TagTreeDataProvider, TagTreeItem } from "./panels/TagExplorer"
import { ObjectTreeDataProvider, ObjectTreeItem } from "./panels/ObjectExplorer"
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

	const tagListProvider = new TagTreeDataProvider(rootPath)
	vscode.window.registerTreeDataProvider("tagsExplorer", tagListProvider)

	const objectListProvider = new ObjectTreeDataProvider(rootPath)
	vscode.window.registerTreeDataProvider("objectsExplorer", objectListProvider)

	const commands = [
		{
			command: "tagsExplorer.refresh",
			action: () => tagListProvider.refresh()
		},
		{
			command: "objectsExplorer.refresh",
			action: () => objectListProvider.refresh()
		},
		{
			command: "tagsExplorer.spawn",
			action: async (item: TagTreeItem) => {
				await tagListProvider.spawnObject(item)
			}
		},
		{
			command: "objectsExplorer.delete",
			action: (item: ObjectTreeItem) => {
				vscode.window.showInformationMessage(`Deleting ${item.label}`)
				objectListProvider.deleteItem(item)
			}
		}
	]

	commands.forEach(({ command, action }) => {
		vscode.commands.registerCommand(command, action)
	})

	const showGalleryCommand = vscode.commands.registerCommand("component-gallery-react.showGallery", () => {
		ComponentGalleryPanel.render(context.extensionUri);
	});
	
	// Add command to the extension context
	context.subscriptions.push(showGalleryCommand);
}
