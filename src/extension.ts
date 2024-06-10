"use strict"

import * as vscode from "vscode"

import { TagListProvider } from "./tagListTree"
import { initialize as initializeDevkitClient } from "./devkitClient"

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
}
