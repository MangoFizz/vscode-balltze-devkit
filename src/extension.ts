"use strict"

import * as vscode from "vscode"

import client, { initialize as initializeDevkitClient, disconnect as disconnectDevkitClient } from "./utilities/devkitClient"
import { TagsTreeDataProvider, TagTreeItem } from "./panels/TagsExplorer"
import { ObjectsTreeDataProvider, ObjectsTreeItem } from "./panels/ObjectsExplorer"
import { TagEditorPanel } from "./panels/TagEditorPanel"
import { TagEntry } from "./types/EngineTag"

let connected = false;

export function activate(context: vscode.ExtensionContext) {
	const rootPath =
		vscode.workspace.workspaceFolders &&
		vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: undefined

	const connectDevkitServer = () => {
		initializeDevkitClient(
			vscode.workspace.getConfiguration("balltzeDevkit").get("host") || "localhost",
			vscode.workspace.getConfiguration("balltzeDevkit").get("port") || 19190,
			() => {
				vscode.window.showInformationMessage("Connected to devkit server");
				connected = true;
			},
			() => {
				vscode.window.showErrorMessage("Failed to connect to devkit server");
				connected = false;
			}
		)
	}

	connectDevkitServer();

	const tagTreeProvider = new TagsTreeDataProvider(rootPath)
	const tagsExplorer = vscode.window.createTreeView("tagsExplorer", {
		treeDataProvider: tagTreeProvider
	});

	const objectTreeProvider = new ObjectsTreeDataProvider(rootPath)
	vscode.window.registerTreeDataProvider("objectsExplorer", objectTreeProvider)

	const commands = [
		{
			command: "balltzeDevkit.reconnect",
			action: () => {
				connectDevkitServer();
				tagTreeProvider.refresh();
				objectTreeProvider.refresh();
			}
		},
		{
			command: "balltzeDevkit.reloadPlugins",
			action: () => {
				if(connected) {
					client.conn.devkit.reloadPlugins();
				}
				else {
					vscode.window.showErrorMessage("Not connected to devkit server");
				}
			}
		},
		{
			command: "tagsExplorer.refresh",
			action: () => {
				if(connected) {
					tagTreeProvider.refresh();
				}
				else {
					vscode.window.showErrorMessage("Not connected to devkit server");
				}
			}
		},
		{
			command: "objectsExplorer.refresh",
			action: () => {
				if(connected) {
					objectTreeProvider.refresh();
				}
				else {
					vscode.window.showErrorMessage("Not connected to devkit server");
				}
			}
		},
		{
			command: "tagsExplorer.copyPath",
			action: (item: TagTreeItem) => {
				vscode.env.clipboard.writeText(item.path.slice(1));
			}
		},
		{
			command: "tagsExplorer.copyTagHandle",
			action: (item: TagTreeItem) => {
				vscode.env.clipboard.writeText(item.tagEntry?.handle.toString() || "");
			}
		},
		{
			command: "tagsExplorer.spawn",
			action: async (item: TagTreeItem) => {
				if(connected) {
					if(item.tagEntry) {
						await tagTreeProvider.spawnObject(item);
						vscode.window.showInformationMessage(`Spawned ${item.label}`);
					}
					else {
						vscode.window.showErrorMessage("Failed to spawn tag: tag entry not found");
					}
				}
				else {
					vscode.window.showErrorMessage("Not connected to devkit server");
				}
			}
		},
		{
			command: "objectsExplorer.delete",
			action: (item: ObjectsTreeItem) => {
				if(connected) {
					objectTreeProvider.deleteItem(item);
					vscode.window.showInformationMessage(`Deleted ${item.label}`);
				}
				else {
					vscode.window.showErrorMessage("Not connected to devkit server");
				}
			}
		},
		{
			command: "tagsExplorer.openEditor",
			action: (node: TagTreeItem) => {
				if(connected) {
					if(node.isFile && node.tagEntry) {
						TagEditorPanel.render(context, node.tagEntry);
					}
					else {
						vscode.window.showErrorMessage(`Failed to open tag editor panel: ${node.path} is not a file`);
					}
				}
				else {
					vscode.window.showErrorMessage("Not connected to devkit server");
				}
			}
		},
		{
			command: "tagsExplorer.openEditorByHandle",
			action: (handle: number) => {
				if(connected) {
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
				else {
					vscode.window.showErrorMessage("Not connected to devkit server");
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
		},
		{
			command: "tagsExplorer.showTagPicker",
			action: (validClasses: string[]): Promise<TagEntry | undefined> => {
				return tagTreeProvider.showTagQuickPick(validClasses);
			}
		},
		{
			command: "tagsExplorer.getTagEntry",
			action: (tagHandle: number): TagEntry | undefined => {
				return tagTreeProvider.getTagEntry(tagHandle);
			}
		}
	]

	commands.forEach(({ command, action }) => {
		vscode.commands.registerCommand(command, action);
	});
}
