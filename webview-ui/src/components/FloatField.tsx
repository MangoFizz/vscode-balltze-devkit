import { VSCodeDivider, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";

export interface NumericFieldProps extends IFieldProps {
	value: number, 
	setValue: (value: number) => void
};

const FloatField: React.FC<NumericFieldProps> = ({ label, value, setValue }) => {
	let [inputValue, setInputValue] = React.useState(value);

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
	  
		if (!/[0-9.]/.test(key)) {
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
					<VSCodeTextField className="numeric-field" value={inputValue.toString()} onchange={handleChange} onKeyDown={onKeyPress} />
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default FloatField;
