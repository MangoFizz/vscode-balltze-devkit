import { VSCodeDivider, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";
import { degToRad, radToDeg, round } from "../utilities/math";

export interface AngleFieldProps extends IFieldProps {
	value: number, 
	setValue: (value: number) => void
};

const AngleField: React.FC<AngleFieldProps> = ({ label, value, setValue }) => {
	let [inputValue, setInputValue] = React.useState(round(radToDeg(value)));

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
		let degs = Number.parseFloat((e.target as HTMLInputElement).value);
		let rads = degToRad(degs);
		setValue(rads);
		setInputValue(degs);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeTextField className="numeric-field" value={inputValue.toString()} onchange={handleChange} onKeyDown={onKeyPress} />
						<span style={{ marginLeft: "0.5rem" }}>degrees</span>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default AngleField;
