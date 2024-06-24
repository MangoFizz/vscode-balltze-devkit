import { VSCodeCheckbox, VSCodeDivider, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import "../css/field-container.css"
import { IFieldProps } from "../utilities/IFieldProps";
import { camelCaseToNormal } from "../utilities/naming";

export type FlagsState = { [flagName: string]: boolean };

export interface FlagsFieldProps extends IFieldProps {
	values: FlagsState,
	setValue: (flag: string, val: boolean) => void
};

const FlagsField: React.FC<FlagsFieldProps> = ({ label, values, setValue }) => {
	let handleChange = function(e: Event, flagName: string): void {
		const val = (e.target as HTMLInputElement).checked;
		values[flagName] = val;
		setValue(flagName, val);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					{
						Object.keys(values).map((flagName: string) => {
							if(flagName === "flags") {
								return null;
							}
							let flag = values[flagName];
							return (
								<VSCodeCheckbox key={flagName} checked={flag} onChange={(e) => handleChange(e as Event, flagName)}>
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

export default FlagsField;
