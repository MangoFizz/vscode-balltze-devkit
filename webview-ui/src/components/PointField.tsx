import React from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";
import { round } from "../utilities/math";
import { isFloat, isInt, toFloat, toInt } from "validator";

export interface PointFieldValue {
	x: number;
	y: number;
	z?: number;
}

export interface PointFieldProps extends BaseFieldProps {
	value: PointFieldValue;
	submitValue: (value: PointFieldValue) => void;
	type: "integer" | "real";
};

const PointField: React.FC<PointFieldProps> = ({ label, value, submitValue, type }) => {
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
			currentValue: currentValue.x,
			inputValue: iInputValue,
			setInputValue: setIInputValue,
			isInputValid: isIInputValid,
			setIsInputValid: setIsIInputValid,
			savedFeedback: iSavedFeedback,
			setSavedFeedback: setISavedFeedback
		},
		j: {
			currentValue: currentValue.y,
			inputValue: jInputValue,
			setInputValue: setJInputValue,
			isInputValid: isJInputValid,
			setIsInputValid: setIsJInputValid,
			savedFeedback: jSavedFeedback,
			setSavedFeedback: setJSavedFeedback
		},
		k: {
			currentValue: currentValue.z,
			inputValue: kInputValue,
			setInputValue: setKInputValue,
			isInputValid: isKInputValid,
			setIsInputValid: setIsKInputValid,
			savedFeedback: kSavedFeedback,
			setSavedFeedback: setKSavedFeedback
		}
	};

	React.useEffect(() => {
		setIInputValue(value.x.toString());
		setIsIInputValid(true);
		
		setJInputValue(value.y.toString());
		setIsJInputValid(true);

		setKInputValue(value.z !== undefined ? round(value.z).toString() : "");
		setIsKInputValid(true);
	}, [value]);

	let handleChange = function(e: Event, axis: string): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		let axisInput = axisInputs[axis as keyof typeof axisInputs];

		if ((isFloat(textFieldValue) && type == "real") || (isInt(textFieldValue) && type == "integer")) {
			let val;
			if (type == "real") {
				val = toFloat(textFieldValue);
			}
			else {
				val = toInt(textFieldValue);
			}
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
				<label style={{ marginRight: "5px" }}>x</label>
				<VSCodeTextField 
					type="text"
					placeholder="NULL"
					className={`numeric-field ${!isIInputValid ? "invalid" : ""} ${iSavedFeedback ? "saved-feedback" : ""}`}
					value={iInputValue} 
					onChange={(e) => handleChange(e as Event, "i")} 
					onKeyDown={e => handleKeyPress(e, "i")} 
				/>
			</div>
			<div className="d-flex">
				<label style={{ marginRight: "5px" }}>y</label>
				<VSCodeTextField 
					type="text"
					placeholder="NULL"
					className={`numeric-field ${!isJInputValid ? "invalid" : ""} ${jSavedFeedback ? "saved-feedback" : ""}`}
					value={jInputValue} 
					onChange={(e) => handleChange(e as Event, "j")} 
					onKeyDown={e => handleKeyPress(e, "j")} 
				/>
			</div>
			{
				currentValue.z !== undefined &&
				<div className="d-flex">
					<label style={{ marginRight: "5px" }}>z</label>
					<VSCodeTextField 
						type="text"
						placeholder="NULL"
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

export default PointField;
