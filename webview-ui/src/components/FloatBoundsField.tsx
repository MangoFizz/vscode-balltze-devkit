import React from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { isFloat, toFloat } from "validator";
import { round } from "../utilities/math";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";

export interface AngleBoundsFieldProps extends BaseFieldProps {
	values: number[];
	submitValues: (value: number[]) => void;
	units?: string;
};

const FloatBoundsField: React.FC<AngleBoundsFieldProps> = ({ label, values, submitValues, units }) => {
	let [currentValues, setCurrentValues] = React.useState(values);
	let [lowerBoundInputValue, setLowerBoundInputValue] = React.useState("");
	let [isLowerBoundInputValid, setIsLowerBoundInputValid] = React.useState(false);
	let [lowerBoundSavedFeedback, setLowerBoundSavedFeedback] = React.useState(false);
	let [upperBoundInputValue, setUpperBoundInputValue] = React.useState("");
	let [isUpperBoundInputValid, setIsUpperBoundInputValid] = React.useState(false);
	let [upperBoundSavedFeedback, setUpperBoundSavedFeedback] = React.useState(false);

	React.useEffect(() => {
		setLowerBoundInputValue(round(values[0]).toString());
		setUpperBoundInputValue(round(values[1]).toString());
		setIsLowerBoundInputValid(true);
		setIsUpperBoundInputValid(true);
	}, [values]);

	let handleLowerBoundChange = function(e: Event): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		if(isFloat(textFieldValue)) {
			let val = toFloat(textFieldValue);
			let curr = [val, currentValues[1]];
			setCurrentValues(curr);
			submitValues(curr);
			setIsLowerBoundInputValid(true);

			setLowerBoundSavedFeedback(true);
			setTimeout(() => {
				setLowerBoundSavedFeedback(false);
			}, 1000);
		}
		else {
			setIsLowerBoundInputValid(false);
		}
		setLowerBoundInputValue(textFieldValue);
	}

	let handleLowerBoundKeyPress = function(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Escape") {
			setLowerBoundInputValue(round(values[0]).toString());
			setIsLowerBoundInputValid(true);
		}
	};

	let handleUpperBoundChange = function(e: Event): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		if(isFloat(textFieldValue)) {
			let val = toFloat(textFieldValue);
			let curr = [currentValues[0], val];
			setCurrentValues(curr);
			submitValues(curr);
			setIsUpperBoundInputValid(true);

			setUpperBoundSavedFeedback(true);
			setTimeout(() => {
				setUpperBoundSavedFeedback(false);
			}, 1000);
		}
		else {
			setIsUpperBoundInputValid(false);
		}
		setUpperBoundInputValue(textFieldValue);
	}

	let handleUpperBoundKeyPress = function(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Escape") {
			setUpperBoundInputValue(round(values[1]).toString());
			setIsUpperBoundInputValid(true);
		}
	}

  	return (
		<FieldContainer label={label}>
			<VSCodeTextField 
				type="text" 
				className={`numeric-field ${!isLowerBoundInputValid ? "invalid" : ""} ${lowerBoundSavedFeedback ? "saved-feedback" : ""}`} 
				value={lowerBoundInputValue} 
				onChange={ev => handleLowerBoundChange(ev as Event)}
				onKeyDown={handleLowerBoundKeyPress} 
			/>
			<span style={{ margin: "0 0.5rem" }}>-</span>
			<VSCodeTextField 
				type="text" 
				className={`numeric-field ${!isUpperBoundInputValid ? "invalid" : "" } ${upperBoundSavedFeedback ? "saved-feedback" : ""}`} 
				value={upperBoundInputValue} 
				onChange={ev => handleUpperBoundChange(ev as Event)}
				onKeyDown={handleUpperBoundKeyPress}
			/>
			<span style={{ marginLeft: "0.5rem" }}>{units || ""}</span>
		</FieldContainer>
  	);
}

export default FloatBoundsField;
