import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";
import { round } from "../utilities/math";

export interface PointFieldProps extends IFieldProps {
	value: { [property: string]: number};
	setValue: (value: { [key: string]: number }) => void;
};

const VectorField: React.FC<PointFieldProps> = ({ label, value, setValue }) => {
	let [axis, setAxis] = React.useState(value);

	let onKeyPress = function(e: React.KeyboardEvent<HTMLInputElement>): void {
		const { key } = e;
    	const { value } = e.target as HTMLInputElement;

		if (
			key === 'Backspace' ||
			key === 'Tab' ||
			key === 'Enter' ||
			key === 'ArrowLeft' ||
			key === 'ArrowRight' ||
			key === 'ArrowUp' ||
			key === 'ArrowDown' ||
			key === 'Delete'
		) {
			return;
		}
	  
		try {
			Number.parseFloat(value + key);
		}
		catch (error) {
			e.preventDefault();
		}
	};

	let handleChange = function(e: Event, property: string): void {
		let inputValue = parseInt((e.target as HTMLInputElement).value);
		let currentPosition = axis;
		currentPosition[property] = inputValue;
		setAxis(currentPosition);
		setValue(currentPosition);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						{
							Object.keys(value).map((key) => {
								return (
									<div className="d-flex">
										<label style={{ marginRight: "5px" }}>{key[0]}: </label>
										<VSCodeTextField type="tel" className="numeric-field" value={round(axis[key]).toString()} onKeyPress={onKeyPress} onChange={(e) => handleChange(e as Event, key)} />
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

export default VectorField;
