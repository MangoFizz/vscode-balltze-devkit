import React from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { isFloat, toFloat } from "validator";
import { round } from "../utilities/math";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";

export interface NumericFieldProps extends BaseFieldProps {
	value: number;
	submitValue: (value: number) => void;
	units?: string;
};

const FloatField: React.FC<NumericFieldProps> = ({ label, value, submitValue, units }) => {
	let [currentValue, setCurrentValue] = React.useState(value);
	let [inputValue, setInputValue] = React.useState("");
	let [isInputValid, setIsInputValid] = React.useState(false);
	let [savedFeedback, setSavedFeedback] = React.useState(false);

	React.useEffect(() => {
		setInputValue(round(value).toString());
		setIsInputValid(true);
	}, [value]);

	let handleChange = function(e: Event): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		if(isFloat(textFieldValue)) {
			let val = toFloat(textFieldValue);
			setCurrentValue(val);
			submitValue(val);
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
			setInputValue(round(currentValue).toString());
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
			<span style={{ marginLeft: "0.5rem" }}>{units || ""}</span>
		</FieldContainer>
  	);
}

export default FloatField;
