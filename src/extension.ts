"use strict"

import * as vscode from "vscode"

import { initialize as initializeDevkitClient } from "./utilities/devkitClient"
import { TagsTreeDataProvider, TagTreeItem } from "./panels/TagsExplorer"
import { ObjectTreeDataProvider, ObjectTreeItem } from "./panels/ObjectExplorer"
import { TagEditorPanel } from "./panels/TagEditorPanel"

export function activate(context: vscode.ExtensionContext) {
	const rootPath =
		vscode.workspace.workspaceFolders &&
		vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: undefined

	// Connect to devkit server
	initializeDevkitClient(
		vscode.workspace.getConfiguration("balltzeDevkit").get("host") || "localhost",
		vscode.workspace.getConfiguration("balltzeDevkit").get("port") || 19190
	)

	const tagTreeProvider = new TagsTreeDataProvider(rootPath)
	const tagsExplorer = vscode.window.createTreeView("tagsExplorer", {
		treeDataProvider: tagTreeProvider
	});

	const objectTreeProvider = new ObjectTreeDataProvider(rootPath)
	vscode.window.registerTreeDataProvider("objectsExplorer", objectTreeProvider)

	const commands = [
		{
			command: "tagsExplorer.refresh",
			action: () => tagTreeProvider.refresh()
		},
		{
			command: "objectsExplorer.refresh",
			action: () => objectTreeProvider.refresh()
		},
		{
			command: "tagsExplorer.spawn",
			action: async (item: TagTreeItem) => {
				await tagTreeProvider.spawnObject(item)
			}
		},
		{
			command: "objectsExplorer.delete",
			action: (item: ObjectTreeItem) => {
				vscode.window.showInformationMessage(`Deleting ${item.label}`)
				objectTreeProvider.deleteItem(item)
			}
		},
		{
			command: "tagsExplorer.openEditor",
			action: (node: TagTreeItem) => {
				if(node.isFile && node.tagEntry) {
					TagEditorPanel.render(context, node.tagEntry);
				}
				else {
					vscode.window.showErrorMessage(`Failed to open tag editor panel: ${node.path} is not a file`);
				}
			}
		},
		{
			command: "tagsExplorer.openEditorByHandle",
			action: (handle: number) => {
				let node = tagTreeProvider.getTreeItemByTagHandle(handle);
				if(node) {
					if(node.isFile && node.tagEntry) {
						TagEditorPanel.render(context, node.tagEntry);
					}
					else {
						vscode.window.showErrorMessage(`Failed to open tag editor panel: ${node.path} is not a file`);
					}
				}
				else {
					vscode.window.showErrorMessage(`Failed to open tag editor panel for handle ${handle}`);
				}
			}
		},
		{
			command: "tagsExplorer.revealTagByHandle",
			action: (handle: number) => {
				let node = tagTreeProvider.getTreeItemByTagHandle(handle);
				if(node) {
					tagsExplorer.reveal(node);
				}
				else {
					vscode.window.showErrorMessage(`Failed to open tag editor panel for handle ${handle}`);
				}
			}
		}
	]

	commands.forEach(({ command, action }) => {
		vscode.commands.registerCommand(command, action)
	});
}
