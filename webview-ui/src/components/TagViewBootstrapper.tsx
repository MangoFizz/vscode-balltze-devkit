import TagView from "./TagView";
import React from "react";
import { vscode } from "../utilities/vscode";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import LoadingOverlay from "./LoadingOverlay";

const TagViewBootstrapper: React.FC = () => {
    let [tagData, setTagData] = React.useState(null as any);

    React.useEffect(() => {
        window.addEventListener("message", (e: MessageEvent) => {
            const msg: MessageEvent = e;
            switch (msg.data.type) {
                case "tagData": {
                    setTagData(msg.data.value);
                    break;
                }
            }
        });

        vscode.postMessage({ type: "ready" });
    }, []);

	if(!tagData) {
		return <LoadingOverlay />
	}

    return (
		<TagView 
			tagEntry={{ class: tagData.primaryClass, path: tagData.path, handle: tagData.handle.value }} 
			tagData={tagData.data} />
    );
}

export default TagViewBootstrapper;
