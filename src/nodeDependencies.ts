import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"
import * as net from "net"

const client = new net.Socket()

const balltzeOutput: vscode.OutputChannel =
	vscode.window.createOutputChannel("Balltze Devkit")

type TagEntry = {
	path: string
	handle: number
	class: string
}

let tags: TagEntry[] = []
//let buffer = new Map<string, any>();
let buffer = ""

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {
	_onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> =
		new vscode.EventEmitter<Dependency | undefined | void>()
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> =
		this._onDidChangeTreeData.event

	onDataReceived(data: any): void {
		let chunk = data.toString()
		if (chunk.at(chunk.length - 1) != "\n") {
			buffer += chunk
		} else {
			buffer += chunk
			balltzeOutput.appendLine(buffer)
			vscode.window.showInformationMessage("Data received")
			tags = JSON.parse(buffer).result
			this.refresh()
		}
	}

	getTags(): void {
		balltzeOutput.appendLine("Getting tags")
		buffer = ""
		let request = {
			jsonrpc: "2.0",
			method: "Devkit.getTagList",
			params: ["Hola mundo"],
			id: "1",
		}
		client.write(JSON.stringify(request) + "\n")
	}

	spawnTag(tag: TagEntry): void {
		balltzeOutput.appendLine("Spawning tag")
		buffer = ""
		let request = {
			jsonrpc: "2.0",
			method: "Engine.gameState.createObject",
			params: [tag.handle, 0xffffffff, { x: 0, y: 0, z: 0 }],
			id: "1",
		}
		client.write(JSON.stringify(request) + "\n")
	}

	constructor(private workspaceRoot: string | undefined) {
		client.connect(19190, "localhost", function () {
			vscode.window.showInformationMessage("Connected to server")
		})

		client.on("data", this.onDataReceived)

		client.on("close", function () {
			console.log("Connection closed")
		})
	}

	refresh(): void {
		this.getTags()
		this._onDidChangeTreeData.fire()
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage("No dependency in empty workspace")
			return Promise.resolve([])
		}

		return Promise.resolve(
			tags
				.filter(
					(tag) =>
						tag.class == "weapon" ||
						tag.class == "vehicle" ||
						tag.class == "biped"
				)
				.map(
					(tag) =>
						new Dependency(
							tag.path,
							tag.class,
							vscode.TreeItemCollapsibleState.None,
							{
								command: "nodeDependencies.spawnTag",
								title: "Spawn tag",
								arguments: [{ ...tag }],
							}
						)
				)
		)
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

export class Dependency extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		private readonly version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState)

		this.tooltip = `${this.label}-${this.version}`
		this.description = this.version
	}

	iconPath = {
		light: path.join(
			__filename,
			"..",
			"..",
			"resources",
			"light",
			"dependency.svg"
		),
		dark: path.join(
			__filename,
			"..",
			"..",
			"resources",
			"dark",
			"dependency.svg"
		),
	}

	contextValue = "dependency"
}
