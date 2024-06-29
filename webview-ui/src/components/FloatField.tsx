import { VSCodeDivider, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";
import { round } from "../utilities/math";

export interface NumericFieldProps extends IFieldProps {
	value: number;
	setValue: (value: number) => void;
	units?: string;
};

const FloatField: React.FC<NumericFieldProps> = ({ label, value, setValue, units }) => {
	let [inputValue, setInputValue] = React.useState(round(value));

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

	let handleChange = function(e: Event): void {
		let val = Number.parseFloat((e.target as HTMLInputElement).value);
		setValue(val);
		setInputValue(val);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeTextField className="numeric-field" value={inputValue.toString()} onChange={(e) => handleChange(e as Event)} onKeyDown={onKeyPress} />
						<span style={{ marginLeft: "0.5rem" }}>{units || ""}</span>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default FloatField;
