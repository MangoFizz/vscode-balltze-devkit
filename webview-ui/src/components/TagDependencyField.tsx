import { VSCodeButton, VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";

export interface TagDependencyFieldProps extends IFieldProps {
	validClasses: string[];
	value: { [key: string]: any };
	setValue: (tagClass: string, tagHandle: number) => void;
};

const TagDependencyField: React.FC<TagDependencyFieldProps> = ({ label, validClasses, value, setValue }) => {
	let [selectedClass, setSelectedClass] = React.useState(value.tagClass.toLowerCase());
	let [selectedTagHandle, setSelectedTagHandle] = React.useState(value.tagHandle.value);

	const getTagPath = () => {
		return `${selectedTagHandle}`;
	};
	
  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeDropdown 
							position="below" 
							style={{ width: "40%", marginRight: "5px" }} 
							selectedIndex={validClasses.indexOf(selectedClass)} 
							disabled={true}
						>
							{
								validClasses.map((value, index) => (
									<VSCodeOption key={index} value={value}>{value}</VSCodeOption>
								))
							}	
						</VSCodeDropdown>
						<VSCodeTextField style={{ marginRight: "5px" }} readOnly={true} value={getTagPath()} />
						<div className="d-flex">
							<VSCodeButton style={{ marginRight: "5px" }} onClick={() => {}} >Find</VSCodeButton>
							<VSCodeButton onClick={() => {}} >Open</VSCodeButton>
						</div>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default TagDependencyField;
