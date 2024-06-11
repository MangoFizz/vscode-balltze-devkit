import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"

export interface IStringFieldProps extends IFieldProps {
	value: string, 
	setValue: (value: string) => void
};

export function StringField(props: IStringFieldProps) {
	let handleChange = function(e: Event): void {
		props.setValue((e.target as HTMLInputElement).value);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{props.label}</p>
				<div className="field-content">
					<VSCodeTextField value={props.value} onchange={handleChange} />
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}
