import { VSCodeDivider, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import "../css/field-container.css"
import { IFieldProps } from "../utilities/IFieldProps";

export interface IEnumFieldProps extends IFieldProps {
    enumValues: string[], 
	value: string, 
	setValue: (value: string) => void
};

export function EnumField(props: IEnumFieldProps) {
	let handleChange = function(e: Event): void {
		props.setValue((e.target as HTMLSelectElement).value);
	};

	let getSelectedIndex = function(): number {
		return props.enumValues.indexOf(props.value) || 0;
	}

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{props.label}</p>
				<div className="field-content">
					<VSCodeDropdown position="below" selectedIndex={getSelectedIndex()} onchange={handleChange}>
						{
							props.enumValues.map((value, index) => (
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
