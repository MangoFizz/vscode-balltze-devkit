import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";

export interface StringFieldProps extends BaseFieldProps {
	value: string;
	submitValue: (value: string) => void;
};

const StringField: React.FC<StringFieldProps> = ({ label, value, submitValue }) => {
	let handleChange = function(e: Event): void {
		const val = (e.target as HTMLInputElement).value;
		submitValue(val);
	};

  	return (
		<FieldContainer label={label}>
			<VSCodeTextField value={value} onChange={(e) => handleChange(e as Event)} />
		</FieldContainer>
  	);
}

export default StringField;
