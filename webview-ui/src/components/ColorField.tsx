import React from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";
import { round } from "../utilities/math";
import { isFloat, isInt, toFloat, toInt } from "validator";

export interface ColorFieldValue {
	alpha?: number;
	red: number;
	green: number;
	blue: number;
}

export interface ColorFieldProps extends BaseFieldProps {
	value: ColorFieldValue;
	submitValue: (value: ColorFieldValue) => void;
	type: "pixel" | "real";
};

const ColorField: React.FC<ColorFieldProps> = ({ label, value, submitValue, type }) => {
	let [currentValue, setCurrentValue] = React.useState(value);

	let [alphaInputValue, setAlphaInputValue] = React.useState("");
	let [isAlphaInputValid, setIsAlphaInputValid] = React.useState(false);
	let [alphaSavedFeedback, setAlphaSavedFeedback] = React.useState(false);

	let [redInputValue, setRedInputValue] = React.useState("");
	let [isRedInputValid, setIsRedInputValid] = React.useState(false);
	let [redSavedFeedback, setRedSavedFeedback] = React.useState(false);

	let [greenInputValue, setGreenInputValue] = React.useState("");
	let [isGreenInputValid, setIsGreenInputValid] = React.useState(false);
	let [greenSavedFeedback, setGreenSavedFeedback] = React.useState(false);

	let [blueInputValue, setBlueInputValue] = React.useState("");
	let [isBlueInputValid, setIsBlueInputValid] = React.useState(false);
	let [blueSavedFeedback, setBlueSavedFeedback] = React.useState(false);

	let colorsInputs = {
		alpha: {
			currentValue: currentValue.alpha,
			inputValue: alphaInputValue,
			setInputValue: setAlphaInputValue,
			isInputValid: isAlphaInputValid,
			setIsInputValid: setIsAlphaInputValid,
			savedFeedback: alphaSavedFeedback,
			setSavedFeedback: setAlphaSavedFeedback
		},
		red: {
			currentValue: currentValue.red,
			inputValue: redInputValue,
			setInputValue: setRedInputValue,
			isInputValid: isRedInputValid,
			setIsInputValid: setIsRedInputValid,
			savedFeedback: redSavedFeedback,
			setSavedFeedback: setRedSavedFeedback
		},
		green: {
			currentValue: currentValue.green,
			inputValue: greenInputValue,
			setInputValue: setGreenInputValue,
			isInputValid: isGreenInputValid,
			setIsInputValid: setIsGreenInputValid,
			savedFeedback: greenSavedFeedback,
			setSavedFeedback: setGreenSavedFeedback
		},
		blue: {
			currentValue: currentValue.blue,
			inputValue: blueInputValue,
			setInputValue: setBlueInputValue,
			isInputValid: isBlueInputValid,
			setIsInputValid: setIsBlueInputValid,
			savedFeedback: blueSavedFeedback,
			setSavedFeedback: setBlueSavedFeedback
		}
	};

	React.useEffect(() => {
		setAlphaInputValue(value.alpha !== undefined ? round(value.alpha).toString() : "");
		setIsAlphaInputValid(true);

		setRedInputValue(round(value.red).toString());
		setIsRedInputValid(true);
		
		setGreenInputValue(round(value.green).toString());
		setIsGreenInputValid(true);
		
		setBlueInputValue(round(value.blue).toString());
		setIsBlueInputValid(true);
	}, [value]);

	let handleChange = function(e: Event, channel: string): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		let colorInput = colorsInputs[channel as keyof typeof colorsInputs];

		if ((isFloat(textFieldValue) && type == "real") || (isInt(textFieldValue) && type == "pixel")) {
			let val;
			if (type == "real") {
				val = toFloat(textFieldValue);
			}
			else {
				val = toInt(textFieldValue);
			}
			let curr = currentValue;
			curr[channel as keyof typeof curr] = val;
			setCurrentValue(curr);
			submitValue(curr);
			colorInput.setIsInputValid(true);

			colorInput.setSavedFeedback(true);
			setTimeout(() => {
				colorInput.setSavedFeedback(false);
			}, 1000);
		}
		else {
			colorInput.setIsInputValid(false);
		}
		colorInput.setInputValue(textFieldValue);
	};

	let handleKeyPress = function(e: React.KeyboardEvent<HTMLElement>, channel: string): void {
		if (e.key === "Escape") {
			let colorInput = colorsInputs[channel as keyof typeof colorsInputs];
			colorInput.setInputValue(colorInput.currentValue !== undefined ? round(colorInput.currentValue).toString() : "");
			colorInput.setIsInputValid(true);
		}
	}

	let handleColorPicker = (e: any) => {
		let getChannel = (i: number): number => {
			let val =  parseInt(e.target.value.substr(i, 2), 16);
			if(type == "real") {
				return val / 255;
			}
			return val;
		};

		let curr = currentValue;
		curr.red = getChannel(1);
		curr.green = getChannel(3);
		curr.blue = getChannel(5);
		setCurrentValue(curr);
		submitValue(curr);

		// Update inputs
		setAlphaInputValue(curr.alpha !== undefined ? round(curr.alpha).toString() : "");
		setIsAlphaInputValid(true);
		setRedInputValue(round(curr.red).toString());
		setIsRedInputValid(true);
		setGreenInputValue(round(curr.green).toString());
		setIsGreenInputValid(true);
		setBlueInputValue(round(curr.blue).toString());
		setIsBlueInputValid(true);

		// Saved feedback
		setRedSavedFeedback(true);
		setGreenSavedFeedback(true);
		setBlueSavedFeedback(true);
		setTimeout(() => {
			setRedSavedFeedback(false);
			setGreenSavedFeedback(false);
			setBlueSavedFeedback(false);
		}, 1000);
	};

	let getColorHexValue = () => {
		let colorHex = "#";
		let getColorHex = (channel: number): string => {
			let val = type == "real" ? round(channel * 255) : channel;
			return val.toString(16).padStart(2, '0');
		};
		colorHex += getColorHex(currentValue.red);
		colorHex += getColorHex(currentValue.green);
		colorHex += getColorHex(currentValue.blue);
		return colorHex;
	};

  	return (
		<FieldContainer label={label}>
			{
				currentValue.alpha !== undefined &&
				<div className="d-flex">
					<label style={{ marginRight: "5px" }}>a</label>
					<VSCodeTextField 
						type="text"
						className={`numeric-field ${!isAlphaInputValid ? "invalid" : ""} ${alphaSavedFeedback ? "saved-feedback" : ""}`} 
						value={alphaInputValue} 
						onChange={(e) => handleChange(e as Event, "alpha")} 
						onKeyDown={e => handleKeyPress(e, "alpha")} 
					/>
				</div>
			}
			<div className="d-flex">
				<label style={{ marginRight: "5px" }}>r</label>
				<VSCodeTextField 
					type="text"
					className={`numeric-field ${!isRedInputValid ? "invalid" : ""} ${redSavedFeedback ? "saved-feedback" : ""}`}
					value={redInputValue} 
					onChange={(e) => handleChange(e as Event, "red")} 
					onKeyDown={e => handleKeyPress(e, "red")} 
				/>
			</div>
			<div className="d-flex">
				<label style={{ marginRight: "5px" }}>g</label>
				<VSCodeTextField 
					type="text"
					className={`numeric-field ${!isGreenInputValid ? "invalid" : ""} ${greenSavedFeedback ? "saved-feedback" : ""}`}
					value={greenInputValue} 
					onChange={(e) => handleChange(e as Event, "green")} 
					onKeyDown={e => handleKeyPress(e, "green")} 
				/>
			</div>
			<div className="d-flex">
				<label style={{ marginRight: "5px" }}>b</label>
				<VSCodeTextField 
					type="text"
					className={`numeric-field ${!isBlueInputValid ? "invalid" : ""} ${blueSavedFeedback ? "saved-feedback" : ""}`}
					value={blueInputValue} 
					onChange={(e) => handleChange(e as Event, "blue")} 
					onKeyDown={e => handleKeyPress(e, "blue")} 
				/>
			</div>
			<input type="color" value={ getColorHexValue() } onChange={handleColorPicker} />
		</FieldContainer>
  	);
}

export default ColorField;
