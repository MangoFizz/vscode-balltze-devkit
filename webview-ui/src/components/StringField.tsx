import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"

export interface StringFieldProps extends IFieldProps {
	value: string;
	setValue: (value: string) => void;
};

const StringField: React.FC<StringFieldProps> = ({ label, value, setValue }) => {
	let handleChange = function(e: Event): void {
		const val = (e.target as HTMLInputElement).value;
		setValue(val);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<VSCodeTextField value={value} onchange={handleChange} />
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default StringField;
