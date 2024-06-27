import { commands, Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext } from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import client from "../utilities/devkitClient"
import { TagEntry } from "../types/EngineTag";

export class TagEditorPanel {
    public static panels: { [name: string]: TagEditorPanel|undefined } = {};
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    private constructor(context: ExtensionContext, panel: WebviewPanel, tagHandle: number) {
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, context.extensionUri);
        this._panel.webview.onDidReceiveMessage(
            async (msg) => {
                switch (msg.type) {
                    case "ready": {
                        let tagData = await client.conn.engine.tag.getTag(tagHandle);
                        panel.webview.postMessage({ type: "tagData", value: tagData });
                        break;
                    }

                    case "getTagPath": {
                        if(msg.value) {
                            let data = JSON.parse(msg.value);
                            client.conn.devkit.pathForTag(data.handle).then((path: string) => {
                                panel.webview.postMessage({ type: "tagPath", value: JSON.stringify({ nonce: data.nonce, path: path }) });
                            });
                        }
                        break;
                    }

                    case "openTagInEditor": {
                        if(msg.value) {
                            let data = JSON.parse(msg.value);
                            commands.executeCommand("tagsExplorer.openEditorByHandle", data.handle);                         
                        }
                        break;                     
                    }
                }
            },
            undefined,
            context.subscriptions
        );

        this._panel.onDidChangeViewState(
            e => {
                if(e.webviewPanel.active) {
                    commands.executeCommand("tagsExplorer.revealTagByHandle", tagHandle);
                }
            },
            null,
            context.subscriptions
        );

        commands.executeCommand("tagsExplorer.revealTagByHandle", tagHandle);
    }

    public static render(context: ExtensionContext, tag: TagEntry) {
        const panelName = `${tag.path}.${tag.class}`;
        let currentPanel = TagEditorPanel.panels[panelName];
        if (currentPanel) {
            currentPanel._panel.reveal(ViewColumn.One);
        } 
        else {
            let tagName = tag.path.split("\\").pop() || "Unknown";
            const panel = window.createWebviewPanel(
                panelName,
                `${tagName}.${tag.class}`,
                ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        Uri.joinPath(context.extensionUri, "out"),
                        Uri.joinPath(context.extensionUri, "webview-ui/build"),
                    ],
                    retainContextWhenHidden: true
                },
            );
            TagEditorPanel.panels[panelName] = new TagEditorPanel(context, panel, tag.handle);
        }
    }

    public dispose() {
        TagEditorPanel.panels[this._panel.viewType] = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
        
        const codiconFontUri = getUri(webview, extensionUri, [
            "webview-ui",
            "build",
            "assets",
            "codicon.ttf",
        ]);
        
        const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

        const nonce = getNonce();

        return /*html*/ `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                    <link rel="stylesheet" type="text/css" href="${stylesUri}">
                    <title>Tag view</title>
                    <style nonce="${nonce}">
                        @font-face {
                            font-family: "codicon";
                            font-display: block;
                            src: url("${codiconFontUri}") format("truetype");
                        }
                    </style>
                </head>
                <body>
                    <div id="root"></div>
                    <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
                </body>
            </html>
        `;
    }
}
