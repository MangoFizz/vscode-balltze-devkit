import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { vscode } from "../utilities/vscode";
import React from "react";
import { getNonce } from "../utilities/getNonce";
import { tagClasses } from "../definitions";
import { camelCaseToSnakeCase } from "../utilities/naming";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";

export interface TagDependencyFieldProps extends BaseFieldProps {
	validClasses: string[];
	value: { [key: string]: any };
	setValue: (value: { [key: string]: any }) => void;
	nullable: boolean;
};

const TagDependencyField: React.FC<TagDependencyFieldProps> = ({ label, validClasses, value, setValue, nullable }) => {
	let [validClassesList, setValidClassesList] = React.useState(validClasses);
	let [selectedClass, setSelectedClass] = React.useState<string>();
	let [selectedTagHandle, setSelectedTagHandle] = React.useState(0xFFFFFFFF);
	let [selectedTagPath, setSelectedTagPath] = React.useState<string|null>("Loading...");
	let [dropdownOpen, setDropdownOpen] = React.useState(false);
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
		let classes = validClasses;
		let tagClassesList = Object.keys(tagClasses).map((value) => camelCaseToSnakeCase(value));

		// Populate shader classes
		if(validClasses.indexOf("shader") !== -1) {
			classes = classes
				.filter((value) => value !== "shader")
				.concat(Object.keys(tagClassesList).filter((value) => value.startsWith("shader")));
		}

		// Add gbxmodel when model is a valid class
		if(validClasses.indexOf("model") !== -1) {
			classes = classes.concat(["gbxmodel"]);
		}

		// Populate all classes
		if(validClasses.indexOf("*") !== -1) {
			classes = tagClassesList.filter((value) => value !== "null");
		}

		// Set selected tag
		if(tagHandle != 0xFFFFFFFF && tagClass != "null") {
			setSelectedClass(camelCaseToSnakeCase(tagClass));
			setSelectedTagHandle(tagHandle);
			vscode.postMessage({ type: "getTagPath", value: JSON.stringify({ nonce: nonce, handle: tagHandle }) });
		}
		else {
			setSelectedTagPath(null);
			setSelectedClass(classes[0])
		}

		setValidClassesList(classes);
    }, []);

	const openTagInEditor = () => {
		vscode.postMessage({ type: "openTagInEditor", value: JSON.stringify({ handle: selectedTagHandle }) });
	}

	const pickTag = () => {
		vscode.postMessage({ type: "pickTag", value: JSON.stringify({ nonce: nonce, validClasses: validClassesList }) });
	}

	const clearDependency = () => {
		setSelectedClass(validClassesList[0]);
		setSelectedTagHandle(0xFFFFFFFF);
		setSelectedTagPath(null);
		setValue({ tagClass: tagClasses.null, tagHandle: 0xFFFFFFFF, path: null });
	}
	
  	return (
		<FieldContainer label={label}>
			<VSCodeDropdown 
				position="below" 
				style={{ width: "40%", marginRight: "5px", opacity: 1 }} 
				value={selectedClass} 
				disabled
			>
				<span slot="indicator" className="codicon codicon-type-hierarchy"></span>
				{
					validClassesList
						.map((value: string, index: number) => (
							<VSCodeOption key={index} value={value}>{value}</VSCodeOption>
						))
				}	
			</VSCodeDropdown>
			<VSCodeTextField style={{ marginRight: "5px" }} readOnly={true} value={selectedTagPath || ""} placeholder="NULL" />
			<div className="d-flex">
				<VSCodeButton style={{ marginRight: "5px" }} onClick={pickTag} >Find</VSCodeButton>
				<VSCodeButton onClick={openTagInEditor} >Open</VSCodeButton>
				{ nullable ? <VSCodeButton style={{ marginLeft: "5px" }} onClick={clearDependency} >Clear</VSCodeButton> : null }
			</div>
		</FieldContainer>
  	);
}

export default TagDependencyField;
