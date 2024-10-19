import React from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { isInt, toInt } from "validator";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";

export interface NumericFieldProps extends BaseFieldProps {
	value: number;
	submitValue: (value: number) => void;
	type: string;
	units?: string;
};

const IntegerField: React.FC<NumericFieldProps> = ({ label, value, submitValue, type, units }) => {
	let [currentValue, setCurrentValue] = React.useState(value);
	let [inputValue, setInputValue] = React.useState("");
	let [isInputValid, setIsInputValid] = React.useState(false);
	let [savedFeedback, setSavedFeedback] = React.useState(false);

	React.useEffect(() => {
		let strval = value.toString();
		if (currentValue == 0xFFFF || currentValue == 0xFFFFFFFF) {
			strval = "";
		}
		setInputValue(strval);
		setIsInputValid(true);
	}, [value]);

	let handleChange = function(e: Event): void {
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
				setCurrentValue(val);
				submitValue(val);
				setIsInputValid(true);
				textFieldValue = "NULL";
			}
			else {
				setIsInputValid(false);
			}
		}
		setInputValue(textFieldValue);
	};

	let handleKeyPress = function(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Escape") {
			setInputValue(currentValue.toString());
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

export default IntegerField;
