"use strict"

import * as vscode from "vscode"

import { initialize as initializeDevkitClient } from "./devkitClient"
import { TagListProvider, TagTreeItem } from "./tagListTree"
import { ObjectListProvider, ObjectTreeItem } from "./objectListExplorer"

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

	const objectListProvider = new ObjectListProvider(rootPath)
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
}
