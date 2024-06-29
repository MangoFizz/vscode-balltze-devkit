import { VSCodeDivider, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";
import { round } from "../utilities/math";

export interface NumericFieldProps extends IFieldProps {
	values: number[];
	setValue: (bound: number, value: number) => void;
	units?: string;
};

const FloatBoundsField: React.FC<NumericFieldProps> = ({ label, values, setValue, units }) => {
	let [inputValues, setInputValues] = React.useState(values.map(val => round(val)));

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
		let val = Number.parseFloat((e.target as HTMLInputElement).value);
		setValue(bound, val);
		let values = inputValues;
		values[bound] = val;
		setInputValues(values);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeTextField className="numeric-field" value={inputValues[0].toString()} onChange={(e) => handleChange(e as Event, 0)} onKeyDown={onKeyPress} />
						<span style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>-</span>
						<VSCodeTextField className="numeric-field" value={inputValues[1].toString()} onChange={(e) => handleChange(e as Event, 1)} onKeyDown={onKeyPress} />
						<span style={{ marginLeft: "0.5rem" }}>{units || ""}</span>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default FloatBoundsField;
