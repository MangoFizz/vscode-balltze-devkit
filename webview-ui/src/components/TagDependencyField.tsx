import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { vscode } from "../utilities/vscode";
import React from "react";
import { getNonce } from "../utilities/getNonce";
import { tagClasses } from "../definitions";
import { camelCaseToSnakeCase, snakeCaseToCamelCase } from "../utilities/naming";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";

export interface TagDependencyFieldProps extends BaseFieldProps {
	validClasses: string[];
	value: { [key: string]: any };
	setValue: (value: { [key: string]: any }) => void;
	nullable: boolean;
};

const defaultClass = Object.keys(tagClasses)[0];

const TagDependencyField: React.FC<TagDependencyFieldProps> = ({ label, validClasses, value, setValue, nullable }) => {
	let [validClassesList, setValidClassesList] = React.useState(validClasses);
	let [selectedClass, setSelectedClass] = React.useState(defaultClass);
	let [selectedTagHandle, setSelectedTagHandle] = React.useState(0xFFFFFFFF);
	let [selectedTagPath, setSelectedTagPath] = React.useState<string|null>("Loading...");
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
		
        if(tagHandle != 0xFFFFFFFF && tagClass != "null") {
			setSelectedClass(tagClass);
			setSelectedTagHandle(tagHandle);
			vscode.postMessage({ type: "getTagPath", value: JSON.stringify({ nonce: nonce, handle: tagHandle }) });
		}
		else {
			setSelectedTagPath(null);
		}

		let classes = [] as string[];

		// Populate shader classes
		if(validClasses.indexOf("shader") !== -1) {
			classes = validClassesList.concat(Object.keys(tagClasses).filter((value) => value.startsWith("shader")));
		}

		// Add gbxmodel when model is a valid class
		if(validClasses.indexOf("model") !== -1) {
			classes = validClasses.concat(["gbxmodel"]);
		}

		// Populate all classes
		if(validClasses.indexOf("*") !== -1) {
			classes = Object.keys(tagClasses);;
		}

		// Remove null class
		classes = classes.filter((value) => value !== "null");

		setValidClassesList(classes);
    }, []);

	const openTagInEditor = () => {
		vscode.postMessage({ type: "openTagInEditor", value: JSON.stringify({ handle: selectedTagHandle }) });
	}

	const pickTag = () => {
		vscode.postMessage({ type: "pickTag", value: JSON.stringify({ nonce: nonce, validClasses: validClassesList }) });
	}

	const clearDependency = () => {
		setSelectedClass(defaultClass);
		setSelectedTagHandle(0xFFFFFFFF);
		setSelectedTagPath(null);
		setValue({ tagClass: tagClasses.null, tagHandle: 0xFFFFFFFF, path: null });
	}
	
  	return (
		<FieldContainer label={label}>
			<VSCodeDropdown 
				position="below" 
				style={{ width: "40%", marginRight: "5px" }} 
				value={selectedClass} 
			>
				{
					validClassesList
						.map((value: string, index: number) => (
							<VSCodeOption key={index} value={value}>{camelCaseToSnakeCase(value)}</VSCodeOption>
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
