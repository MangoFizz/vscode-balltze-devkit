import { VSCodeCheckbox, VSCodeDivider, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import "../css/field-container.css"
import { IFieldProps } from "../utilities/IFieldProps";

export type FlagsState = { [flagName: string]: boolean };

export interface IFlagsFieldProps extends IFieldProps {
	values: FlagsState,
	setValues: (values: FlagsState) => void
};

export function FlagsField(props: IFlagsFieldProps) {
	let handleChange = function(e: Event, flagName: string): void {
		props.values[flagName] = (e.target as HTMLInputElement).checked;
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{props.label}</p>
				<div className="field-content">
					{
						Object.keys(props.values).map((flagName: string) => {
							let flag = props.values[flagName];
							return (
								<VSCodeCheckbox checked={flag} onChange={(e) => handleChange(e as Event, flagName)} key={flagName}>
									{flagName}
								</VSCodeCheckbox>
							);
						})
					}
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}
