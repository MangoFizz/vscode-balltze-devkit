import { VSCodeButton, VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import { vscode } from "../utilities/vscode";
import "../css/field-container.css"
import React from "react";
import { getNonce } from "../utilities/getNonce";
import { tagClasses } from "../definitions";
import { snakeCaseToCamelCase } from "../utilities/naming";

export interface TagDependencyFieldProps extends IFieldProps {
	validClasses: string[];
	value: { [key: string]: any };
	setValue: (value: { [key: string]: any }) => void;
	nullable: boolean;
};

const TagDependencyField: React.FC<TagDependencyFieldProps> = ({ label, validClasses, value, setValue, nullable }) => {
	let [validClassesList, setValidClassesList] = React.useState(validClasses);
	let [selectedClass, setSelectedClass] = React.useState("null");
	let [selectedTagHandle, setSelectedTagHandle] = React.useState(0xFFFFFFFF);
	let [selectedTagPath, setSelectedTagPath] = React.useState(`${selectedClass}\\${selectedTagHandle}` as string|null);
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
						let entry = data.tagEntry;
						if(entry) {
							setSelectedTagHandle(entry.handle);
							setSelectedTagPath(entry.path);
							setSelectedClass(entry.class);
							setValue({ tagClass: { name: entry.class, fourCC: (tagClasses as any)[entry.class] }, tagHandle: entry.handle, path: entry.path });
						}
					}
					break;
				}
            }
        });

		let tagHandle = value.tagHandle.value;
		let tagClass = value.tagClass;
		
        if(tagHandle != 0xFFFFFFFF && tagClass != tagClasses.null) {
			setSelectedClass(tagClass);
			setSelectedTagHandle(tagHandle);
			vscode.postMessage({ type: "getTagPath", value: JSON.stringify({ nonce: nonce, handle: tagHandle }) });
		}
		else {
			setSelectedTagPath(null);
		}

		// Populate shader classes
		if(validClasses.indexOf("shader") !== -1) {
			setValidClassesList(validClassesList.concat(Object.keys(tagClasses).filter((value) => value.startsWith("shader"))));
		}

		// Add gbxmodel when model is a valid class
		if(validClasses.indexOf("model") !== -1) {
			setValidClassesList(validClasses.concat(["gbxmodel"]));
		}

		if(validClasses.indexOf("*") !== -1) {
			setValidClassesList(Object.keys(tagClasses));
		}
    }, []);

	const openTagInEditor = () => {
		vscode.postMessage({ type: "openTagInEditor", value: JSON.stringify({ handle: selectedTagHandle }) });
	}

	const pickTag = () => {
		vscode.postMessage({ type: "pickTag", value: JSON.stringify({ nonce: nonce, validClasses: validClassesList }) });
	}

	const clearDependency = () => {
		setSelectedClass("null");
		setSelectedTagHandle(0xFFFFFFFF);
		setSelectedTagPath(null);
		setValue({ tagClass: tagClasses.null, tagHandle: 0xFFFFFFFF, path: null });
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
							value={selectedClass} >
							{
								validClassesList.map((value: string, index) => (
									<VSCodeOption key={index} value={snakeCaseToCamelCase(value)}>{value}</VSCodeOption>
								))
							}	
						</VSCodeDropdown>
						<VSCodeTextField style={{ marginRight: "5px" }} readOnly={true} value={selectedTagPath || ""} placeholder="NULL" />
						<div className="d-flex">
							<VSCodeButton style={{ marginRight: "5px" }} onClick={pickTag} >Find</VSCodeButton>
							<VSCodeButton onClick={openTagInEditor} >Open</VSCodeButton>
							{ nullable ? <VSCodeButton style={{ marginLeft: "5px" }} onClick={clearDependency} >Clear</VSCodeButton> : null }
						</div>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default TagDependencyField;
