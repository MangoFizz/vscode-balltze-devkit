import { VSCodeDivider, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import "../css/field-container.css"
import { IFieldProps } from "../utilities/IFieldProps";
import { camelCaseToNormal } from "../utilities/naming";
import React from "react";

export interface EnumFieldProps extends IFieldProps {
    enumValues: string[];
	value: string;
	setValue: (value: any) => void;
};

const EnumField: React.FC<EnumFieldProps> = ({ label, enumValues, value, setValue }) => {
	let [selectedValue, setSelectedValue] = React.useState(camelCaseToNormal(value));
	
	let handleChange = function(target: HTMLSelectElement): void {
		setSelectedValue(target.value);
		setValue({ name: target.value, index: enumValues.indexOf(target.value) });
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<VSCodeDropdown position="below" value={selectedValue} onChange={(e) => handleChange(e.target as HTMLSelectElement)}>
						{
							enumValues.map((value, index) => (
								<VSCodeOption key={index} value={value}>{value}</VSCodeOption>
							))
						}	
					</VSCodeDropdown>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default EnumField;
