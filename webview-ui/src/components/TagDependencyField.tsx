import { VSCodeButton, VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import { vscode } from "../utilities/vscode";
import "../css/field-container.css"
import React from "react";
import { getNonce } from "../utilities/getNonce";
import { tagClasses } from "../definitions";

export interface TagDependencyFieldProps extends IFieldProps {
	validClasses: string[];
	value: { [key: string]: any };
	setValue: (tagClass: string, tagHandle: number) => void;
};

const TagDependencyField: React.FC<TagDependencyFieldProps> = ({ label, validClasses, value, setValue }) => {
	let [validClassesList, setValidClassesList] = React.useState(validClasses);
	let [selectedClass, setSelectedClass] = React.useState(value.tagClass.toLowerCase());
	let [selectedTagHandle, setSelectedTagHandle] = React.useState(value.tagHandle.value);
	let [selectedTagPath, setSelectedTagPath] = React.useState(`${selectedClass}\\${selectedTagHandle}`);
	let [nonce] = React.useState(getNonce());

	React.useEffect(() => {
        window.addEventListener("message", (e: MessageEvent) => {
            const msg: MessageEvent = e;
            switch (msg.data.type) {
                case "tagPath": {
                    let data = JSON.parse(msg.data.value);
					if(data.nonce === nonce) {
						setSelectedTagPath(data.path);
					}
                    break;
                }

				case "pickedTag": {
					let data = JSON.parse(msg.data.value);
					if(data.nonce == nonce) {
						if(data.tagEntry) {
							setSelectedTagHandle(data.tagEntry.handle);
							setSelectedTagPath(data.tagEntry.path);
							setSelectedClass(data.tagEntry.class);
						}
					}
					break;
				}
            }
        });

        if(selectedTagHandle != 0xFFFFFFFF) {
			vscode.postMessage({ type: "getTagPath", value: JSON.stringify({ nonce: nonce, handle: selectedTagHandle }) });
		}
		else {
			setSelectedTagPath("");
		}

		// Populate shader classes
		if(validClasses.find((value) => value === "shader")) {
			setValidClassesList(validClassesList.concat(tagClasses.filter((value) => value.startsWith("shader"))));
		}
    }, []);

	const openTagInEditor = () => {
		vscode.postMessage({ type: "openTagInEditor", value: JSON.stringify({ handle: selectedTagHandle }) });
	}

	const pickTag = () => {
		vscode.postMessage({ type: "pickTag", value: JSON.stringify({ nonce: nonce, validClasses: validClassesList }) });
	}
	
  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeDropdown 
							position="below" 
							style={{ width: "40%", marginRight: "5px" }} 
							value={selectedClass}
							disabled={true}
						>
							{
								validClassesList.map((value, index) => (
									<VSCodeOption key={index} value={value}>{value}</VSCodeOption>
								))
							}	
						</VSCodeDropdown>
						<VSCodeTextField style={{ marginRight: "5px" }} readOnly={true} value={selectedTagPath} placeholder="NULL" />
						<div className="d-flex">
							<VSCodeButton style={{ marginRight: "5px" }} onClick={pickTag} >Find</VSCodeButton>
							<VSCodeButton onClick={openTagInEditor} >Open</VSCodeButton>
						</div>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default TagDependencyField;
