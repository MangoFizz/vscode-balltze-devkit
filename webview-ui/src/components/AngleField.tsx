import React from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { isFloat, toFloat } from "validator";
import { degToRad, radToDeg, round } from "../utilities/math";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";

export interface AngleFieldProps extends BaseFieldProps {
	value: number;
	submitValue: (value: number) => void;
};

const AngleField: React.FC<AngleFieldProps> = ({ label, value, submitValue }) => {
	let [currentValue, setCurrentValue] = React.useState(value);
	let [inputValue, setInputValue] = React.useState("");
	let [isInputValid, setIsInputValid] = React.useState(false);
	let [savedFeedback, setSavedFeedback] = React.useState(false);

	React.useEffect(() => {
		setInputValue(round(radToDeg(value)).toString());
		setIsInputValid(true);
	}, [value]);

	let handleChange = function(e: Event): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		if(isFloat(textFieldValue)) {
			let degs = toFloat(textFieldValue);
			let rads = degToRad(degs);
			setCurrentValue(rads);
			submitValue(rads);
			setIsInputValid(true);

			// Saved feedback
			setSavedFeedback(true);
			setTimeout(() => {
				setSavedFeedback(false);
			}, 1000);
		}
		else {
			setIsInputValid(false);
		}
		setInputValue(textFieldValue);
	};

	let handleKeyPress = function(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Escape") {
			setInputValue(round(radToDeg(currentValue)).toString());
			setIsInputValid(true);
		}
	};

  	return (
		<FieldContainer label={label}>
			<VSCodeTextField 
				type="text" 
				className={`numeric-field ${!isInputValid ? "invalid" : ""} ${savedFeedback ? "saved-feedback" : ""}`} 
				value={inputValue} 
				onChange={ev => handleChange(ev as Event)} 
				onKeyDown={handleKeyPress}
			/>
			<span style={{ marginLeft: "0.5rem" }}>degrees</span>
		</FieldContainer>
  	);
}

export default AngleField;
