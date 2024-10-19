import React from "react";
import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import { camelCaseToNormal } from "../utilities/naming";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";

export interface EnumFieldProps extends BaseFieldProps {
    enumValues: string[];
	value: string;
	submitValue: (value: any) => void;
};

const EnumField: React.FC<EnumFieldProps> = ({ label, enumValues, value, submitValue }) => {
	let [selectedValue, setSelectedValue] = React.useState(camelCaseToNormal(value));
	
	let handleChange = function(target: HTMLSelectElement): void {
		setSelectedValue(target.value);
		submitValue({ name: target.value, index: enumValues.indexOf(target.value) });
	};

  	return (
		<FieldContainer label={label}>
			<VSCodeDropdown position="below" value={selectedValue} onChange={(e) => handleChange(e.target as HTMLSelectElement)}>
				{
					enumValues.map((value, index) => (
						<VSCodeOption key={index} value={value}>{value}</VSCodeOption>
					))
				}	
			</VSCodeDropdown>
		</FieldContainer>
  	);
}

export default EnumField;
