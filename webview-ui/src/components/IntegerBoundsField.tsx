import React from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { isInt, toInt } from "validator";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";
import { text } from "stream/consumers";

export interface AngleBoundsFieldProps extends BaseFieldProps {
	values: number[];
	submitValues: (value: number[]) => void;
	type: string;
	units?: string;
};

const IntegerBoundsField: React.FC<AngleBoundsFieldProps> = ({ label, values, submitValues, type, units }) => {
	let [currentValues, setCurrentValues] = React.useState(values);
	let [lowerBoundInputValue, setLowerBoundInputValue] = React.useState("");
	let [isLowerBoundInputValid, setIsLowerBoundInputValid] = React.useState(false);
	let [lowerBoundSavedFeedback, setLowerBoundSavedFeedback] = React.useState(false);
	let [upperBoundInputValue, setUpperBoundInputValue] = React.useState("");
	let [isUpperBoundInputValid, setIsUpperBoundInputValid] = React.useState(false);
	let [upperBoundSavedFeedback, setUpperBoundSavedFeedback] = React.useState(false);

	React.useEffect(() => {
		setLowerBoundInputValue(values[0].toString());
		setUpperBoundInputValue(values[1].toString());
		setIsLowerBoundInputValid(true);
		setIsUpperBoundInputValid(true);
	}, [values]);

	let handleLowerBoundChange = function(e: Event): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		if(isInt(textFieldValue)) {
			let val = toInt(textFieldValue);

			if(!isNaN(val)) {
				switch(type) {
					case "int8": {
						if (val < -128) {
							val = -128;	
						}
						else if(val >= 128) {
							val = 128;
						}
						break;
					}
		
					case "uint8": {
						if (val < 0) {
							val = 0;	
						}
						else if(val >= 255) {
							val = 255;
						}
						break;
					}
		
					case "int16": {
						if (val < -32768) {
							val = -32768;	
						}
						else if(val >= 32767) {
							val = 32767;
						}
						break;
					}
		
					case "uint16": {
						if (val < 0) {
							val = 0;	
						}
						else if(val >= 65535) {
							val = 65535;
						}
						break;
					}
		
					case "int32": {
						if (val < -2147483648) {
							val = -2147483648;	
						}
						else if(val >= 2147483647) {
							val = 2147483647;
						}
						break;
					}
		
					case "uint32": {
						if (val < 0) {
							val = 0;	
						}
						else if(val >= 4294967295) {
							val = 4294967295;
						}
						break;
					}
				}
	
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
		}
		else {
			if(textFieldValue === "") {
				let val = 0;
				switch(type) {
					case "uint8": {
						val = 255;
						break;
					}

					case "uint16": {
						val = 65535;
						break;
					}

					case "uint32": {
						val = 4294967295;
						break;
					}

					case "int8": 
					case "int16": 
					case "int32": 
					default: {
						val = -1;
					}
				}
				let curr = [val, currentValues[1]];
				setCurrentValues(curr);
				submitValues(curr);
				setIsLowerBoundInputValid(true);
				textFieldValue = "NULL";
			}
			else {
				setIsLowerBoundInputValid(false);
			}
		}
		setLowerBoundInputValue(textFieldValue);
	}

	let handleLowerBoundKeyPress = function(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Escape") {
			setLowerBoundInputValue(values[0].toString());
			setIsLowerBoundInputValid(true);
		}
	};

	let handleUpperBoundChange = function(e: Event): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		if(isInt(textFieldValue)) {
			let val = toInt(textFieldValue);

			if(!isNaN(val)) {
				switch(type) {
					case "int8": {
						if (val < -128) {
							val = -128;	
						}
						else if(val >= 128) {
							val = 128;
						}
						break;
					}
		
					case "uint8": {
						if (val < 0) {
							val = 0;	
						}
						else if(val >= 255) {
							val = 255;
						}
						break;
					}
		
					case "int16": {
						if (val < -32768) {
							val = -32768;	
						}
						else if(val >= 32767) {
							val = 32767;
						}
						break;
					}
		
					case "uint16": {
						if (val < 0) {
							val = 0;	
						}
						else if(val >= 65535) {
							val = 65535;
						}
						break;
					}
		
					case "int32": {
						if (val < -2147483648) {
							val = -2147483648;	
						}
						else if(val >= 2147483647) {
							val = 2147483647;
						}
						break;
					}
		
					case "uint32": {
						if (val < 0) {
							val = 0;	
						}
						else if(val >= 4294967295) {
							val = 4294967295;
						}
						break;
					}
				}

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
		}
		else {
			if(textFieldValue === "") {
				let val = 0;
				switch(type) {
					case "uint8": {
						val = 255;
						break;
					}

					case "uint16": {
						val = 65535;
						break;
					}

					case "uint32": {
						val = 4294967295;
						break;
					}

					case "int8": 
					case "int16": 
					case "int32": 
					default: {
						val = -1;
					}
				}
				let curr = [currentValues[0], val];
				setCurrentValues(curr);
				submitValues(curr);
				setIsUpperBoundInputValid(true);
				textFieldValue = "NULL";
			}
			else {
				setIsUpperBoundInputValid(false);
			}
		}
		setUpperBoundInputValue(textFieldValue);
	}

	let handleUpperBoundKeyPress = function(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Escape") {
			setUpperBoundInputValue(values[1].toString());
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

export default IntegerBoundsField;
