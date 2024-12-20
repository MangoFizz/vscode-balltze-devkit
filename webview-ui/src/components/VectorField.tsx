import React from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";
import { round } from "../utilities/math";
import { isFloat, toFloat } from "validator";

export interface VectorFieldValue {
	i: number;
	j: number;
	k?: number;
}

export interface VectorFieldProps extends BaseFieldProps {
	value: VectorFieldValue;
	submitValue: (value: VectorFieldValue) => void;
};

const VectorField: React.FC<VectorFieldProps> = ({ label, value, submitValue }) => {
	let [currentValue, setCurrentValue] = React.useState(value);

	let [iInputValue, setIInputValue] = React.useState("");
	let [isIInputValid, setIsIInputValid] = React.useState(false);
	let [iSavedFeedback, setISavedFeedback] = React.useState(false);

	let [jInputValue, setJInputValue] = React.useState("");
	let [isJInputValid, setIsJInputValid] = React.useState(false);
	let [jSavedFeedback, setJSavedFeedback] = React.useState(false);

	let [kInputValue, setKInputValue] = React.useState("");
	let [isKInputValid, setIsKInputValid] = React.useState(false);
	let [kSavedFeedback, setKSavedFeedback] = React.useState(false);

	let axisInputs = {
		i: {
			currentValue: currentValue.i,
			inputValue: iInputValue,
			setInputValue: setIInputValue,
			isInputValid: isIInputValid,
			setIsInputValid: setIsIInputValid,
			savedFeedback: iSavedFeedback,
			setSavedFeedback: setISavedFeedback
		},
		j: {
			currentValue: currentValue.j,
			inputValue: jInputValue,
			setInputValue: setJInputValue,
			isInputValid: isJInputValid,
			setIsInputValid: setIsJInputValid,
			savedFeedback: jSavedFeedback,
			setSavedFeedback: setJSavedFeedback
		},
		k: {
			currentValue: currentValue.k,
			inputValue: kInputValue,
			setInputValue: setKInputValue,
			isInputValid: isKInputValid,
			setIsInputValid: setIsKInputValid,
			savedFeedback: kSavedFeedback,
			setSavedFeedback: setKSavedFeedback
		}
	};

	React.useEffect(() => {
		setIInputValue(round(value.i).toString());
		setIsIInputValid(true);
		
		setJInputValue(round(value.j).toString());
		setIsJInputValid(true);

		setKInputValue(value.k !== undefined ? round(value.k).toString() : "");
		setIsKInputValid(true);
	}, [value]);

	let handleChange = function(e: Event, axis: string): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		let axisInput = axisInputs[axis as keyof typeof axisInputs];

		if (isFloat(textFieldValue)) {
			let val = toFloat(textFieldValue);
			let curr = currentValue;
			curr[axis as keyof typeof curr] = val;
			setCurrentValue(curr);
			submitValue(curr);
			axisInput.setIsInputValid(true);

			axisInput.setSavedFeedback(true);
			setTimeout(() => {
				axisInput.setSavedFeedback(false);
			}, 1000);
		}
		else {
			axisInput.setIsInputValid(false);
		}
		axisInput.setInputValue(textFieldValue);
	};

	let handleKeyPress = function(e: React.KeyboardEvent<HTMLElement>, channel: string): void {
		if (e.key === "Escape") {
			let axisInput = axisInputs[channel as keyof typeof axisInputs];
			axisInput.setInputValue(axisInput.currentValue !== undefined ? round(axisInput.currentValue).toString() : "");
			axisInput.setIsInputValid(true);
		}
	}

  	return (
		<FieldContainer label={label}>
			<div className="d-flex">
				<label style={{ marginRight: "5px" }}>i</label>
				<VSCodeTextField 
					type="text"
					className={`numeric-field ${!isIInputValid ? "invalid" : ""} ${iSavedFeedback ? "saved-feedback" : ""}`}
					value={iInputValue} 
					onChange={(e) => handleChange(e as Event, "i")} 
					onKeyDown={e => handleKeyPress(e, "i")} 
				/>
			</div>
			<div className="d-flex">
				<label style={{ marginRight: "5px" }}>j</label>
				<VSCodeTextField 
					type="text"
					className={`numeric-field ${!isJInputValid ? "invalid" : ""} ${jSavedFeedback ? "saved-feedback" : ""}`}
					value={jInputValue} 
					onChange={(e) => handleChange(e as Event, "j")} 
					onKeyDown={e => handleKeyPress(e, "j")} 
				/>
			</div>
			{
				currentValue.k !== undefined &&
				<div className="d-flex">
					<label style={{ marginRight: "5px" }}>k</label>
					<VSCodeTextField 
						type="text"
						className={`numeric-field ${!isKInputValid ? "invalid" : ""} ${kSavedFeedback ? "saved-feedback" : ""}`} 
						value={kInputValue} 
						onChange={(e) => handleChange(e as Event, "k")} 
						onKeyDown={e => handleKeyPress(e, "k")} 
					/>
				</div>
			}
		</FieldContainer>
  	);
}

export default VectorField;
