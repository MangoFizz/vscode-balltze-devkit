import { VSCodeDivider, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";
import { degToRad, radToDeg, round } from "../utilities/math";

export interface AngleFieldProps extends IFieldProps {
	values: number[];
	setValue: (bound: number, value: number) => void;
};

const AngleBoundsField: React.FC<AngleFieldProps> = ({ label, values, setValue }) => {
	let [inputValues, setInputValues] = React.useState(values.map(val => round(radToDeg(val))));

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

	let handleChange = function(e: Event, bound: number): void {
		let degs = Number.parseFloat((e.target as HTMLInputElement).value);
		let rads = degToRad(degs);
		setValue(bound, rads);
		let values = inputValues;
		values[bound] = degs;
		setInputValues(values);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeTextField className="numeric-field" value={inputValues[0].toString()} onchange={(e) => handleChange(e, 0)} onKeyDown={onKeyPress} />
						<span style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>-</span>
						<VSCodeTextField className="numeric-field" value={inputValues[1].toString()} onchange={(e) => handleChange(e, 1)} onKeyDown={onKeyPress} />
						<span style={{ marginLeft: "0.5rem" }}>degrees</span>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default AngleBoundsField;
