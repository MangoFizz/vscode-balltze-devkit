import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";

export interface Rectangle2dFieldProps extends IFieldProps {
	value: { [property: string]: number}
	setValue: (bound: string, value: number) => void
};

const Rectangle2dField: React.FC<Rectangle2dFieldProps> = ({ label, value, setValue }) => {
	let [bounds, setBounds] = React.useState(value);

	let handleChange = function(e: Event, property: string): void {
		let inputValue = parseInt((e.target as HTMLInputElement).value);
		if (inputValue < -32768) {
			inputValue = -32768;	
		}
		else if(inputValue >= 32767) {
			inputValue = 32767;
		}

		let currentBounds = bounds;
		currentBounds[property] = inputValue;
		setValue(property, currentBounds[property]);
		setBounds(currentBounds);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						{
							["top", "left", "bottom", "right"].map((key) => {
								return (
									<div className="d-flex">
										<label style={{ marginRight: "5px" }}>{key[0]}: </label>
										<VSCodeTextField type="tel" className="numeric-field" value={bounds[key].toString()} onChange={(e) => handleChange(e as Event, key)} />
									</div>
								);
							})
						}
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default Rectangle2dField;
