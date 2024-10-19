import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { camelCaseToNormal } from "../utilities/naming";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";

export type FlagsState = { [flagName: string]: boolean };

export interface FlagsFieldProps extends BaseFieldProps {
	values: FlagsState,
	submitValue: (flag: string, val: boolean) => void
};

const FlagsField: React.FC<FlagsFieldProps> = ({ label, values, submitValue }) => {
	let handleChange = function(e: Event, flagName: string): void {
		const val = (e.target as HTMLInputElement).checked;
		values[flagName] = val;
		submitValue(flagName, val);
	};

  	return (
		<FieldContainer label={label}>
			<div className="d-flex-column">
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
		</FieldContainer>
  	);
}

export default FlagsField;
