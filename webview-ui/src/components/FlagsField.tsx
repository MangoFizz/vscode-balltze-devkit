import { VSCodeCheckbox, VSCodeDivider, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import "../css/field-container.css"
import { IFieldProps } from "../utilities/IFieldProps";
import { camelCaseToNormal } from "../utilities/naming";

export type FlagsState = { [flagName: string]: boolean };

export interface IFlagsFieldProps extends IFieldProps {
	values: FlagsState,
	setValue: (flag: string, val: boolean) => void
};

export function FlagsField(props: IFlagsFieldProps) {
	let handleChange = function(e: Event, flagName: string): void {
		const val = (e.target as HTMLInputElement).checked;
		props.values[flagName] = val;
		props.setValue(flagName, val);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{props.label}</p>
				<div className="field-content">
					{
						Object.keys(props.values).map((flagName: string) => {
							if(flagName === "flags") {
								return null;
							}
							let flag = props.values[flagName];
							console.log(flag);
							return (
								<VSCodeCheckbox checked={flag} onChange={(e) => handleChange(e as Event, flagName)} key={flagName}>
									{camelCaseToNormal(flagName)}
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
