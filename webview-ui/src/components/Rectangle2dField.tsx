import React from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import FieldContainer, { BaseFieldProps } from "./FieldContainer";
import { isInt, toInt } from "validator";

export interface Rectangle2dFieldValue {
	top: number;
	left: number;
	bottom: number;
	right: number;
}

export interface Rectangle2dFieldProps extends BaseFieldProps {
	value: Rectangle2dFieldValue;
	submitValue: (value: Rectangle2dFieldValue) => void;
};

const Rectangle2dField: React.FC<Rectangle2dFieldProps> = ({ label, value, submitValue }) => {
	let [currentValue, setCurrentValue] = React.useState(value);

	let [topInputValue, setTopInputValue] = React.useState("");
	let [isTopInputValid, setIsTopInputValid] = React.useState(false);
	let [topSavedFeedback, setTopSavedFeedback] = React.useState(false);

	let [leftInputValue, setLeftInputValue] = React.useState("");
	let [isLeftInputValid, setIsLeftInputValid] = React.useState(false);
	let [leftSavedFeedback, setLeftSavedFeedback] = React.useState(false);

	let [bottomInputValue, setBottomInputValue] = React.useState("");
	let [isBottomInputValid, setIsBottomInputValid] = React.useState(false);
	let [bottomSavedFeedback, setBottomSavedFeedback] = React.useState(false);

	let [rightInputValue, setRightInputValue] = React.useState("");
	let [isRightInputValid, setIsRightInputValid] = React.useState(false);
	let [rightSavedFeedback, setRightSavedFeedback] = React.useState(false);

	let boundsInputs = {
		top: {
			currentValue: currentValue.top,
			inputValue: topInputValue,
			setInputValue: setTopInputValue,
			isInputValid: isTopInputValid,
			setIsInputValid: setIsTopInputValid,
			savedFeedback: topSavedFeedback,
			setSavedFeedback: setTopSavedFeedback
		},
		left: {
			currentValue: currentValue.left,
			inputValue: leftInputValue,
			setInputValue: setLeftInputValue,
			isInputValid: isLeftInputValid,
			setIsInputValid: setIsLeftInputValid,
			savedFeedback: leftSavedFeedback,
			setSavedFeedback: setLeftSavedFeedback
		},
		bottom: {
			currentValue: currentValue.bottom,
			inputValue: bottomInputValue,
			setInputValue: setBottomInputValue,
			isInputValid: isBottomInputValid,
			setIsInputValid: setIsBottomInputValid,
			savedFeedback: bottomSavedFeedback,
			setSavedFeedback: setBottomSavedFeedback
		},
		right: {
			currentValue: currentValue.right,
			inputValue: rightInputValue,
			setInputValue: setRightInputValue,
			isInputValid: isRightInputValid,
			setIsInputValid: setIsRightInputValid,
			savedFeedback: rightSavedFeedback,
			setSavedFeedback: setRightSavedFeedback
		}
	};

	React.useEffect(() => {
		setTopInputValue(value.top.toString());
		setIsTopInputValid(true);

		setLeftInputValue(value.left.toString());
		setIsLeftInputValid(true);
		
		setBottomInputValue(value.bottom.toString());
		setIsBottomInputValid(true);
		
		setRightInputValue(value.right.toString());
		setIsRightInputValid(true);
	}, [value]);

	let handleChange = function(e: Event, channel: string): void {
		let textField = e.target as HTMLInputElement;
		let textFieldValue = textField.value;
		let boundInput = boundsInputs[channel as keyof typeof boundsInputs];

		if (isInt(textFieldValue)) {
			let val = toInt(textFieldValue);
			let curr = currentValue;
			curr[channel as keyof typeof curr] = val;
			setCurrentValue(curr);
			submitValue(curr);
			boundInput.setIsInputValid(true);

			boundInput.setSavedFeedback(true);
			setTimeout(() => {
				boundInput.setSavedFeedback(false);
			}, 1000);
		}
		else {
			boundInput.setIsInputValid(false);
		}
		boundInput.setInputValue(textFieldValue);
	};

	let handleKeyPress = function(e: React.KeyboardEvent<HTMLElement>, channel: string): void {
		if (e.key === "Escape") {
			let boundInput = boundsInputs[channel as keyof typeof boundsInputs];
			boundInput.setInputValue(boundInput.currentValue.toString());
			boundInput.setIsInputValid(true);
		}
	}

  	return (
		<FieldContainer label={label}>
			{
				currentValue.top !== undefined &&
				<div className="d-flex">
					<label style={{ marginRight: "5px" }}>t</label>
					<VSCodeTextField 
						type="text"
						className={`numeric-field ${!isTopInputValid ? "invalid" : ""} ${topSavedFeedback ? "saved-feedback" : ""}`} 
						value={topInputValue} 
						onChange={(e) => handleChange(e as Event, "top")} 
						onKeyDown={e => handleKeyPress(e, "top")} 
					/>
				</div>
			}
			<div className="d-flex">
				<label style={{ marginRight: "5px" }}>l</label>
				<VSCodeTextField 
					type="text"
					className={`numeric-field ${!isLeftInputValid ? "invalid" : ""} ${leftSavedFeedback ? "saved-feedback" : ""}`}
					value={leftInputValue} 
					onChange={(e) => handleChange(e as Event, "left")} 
					onKeyDown={e => handleKeyPress(e, "left")} 
				/>
			</div>
			<div className="d-flex">
				<label style={{ marginRight: "5px" }}>b</label>
				<VSCodeTextField 
					type="text"
					className={`numeric-field ${!isBottomInputValid ? "invalid" : ""} ${bottomSavedFeedback ? "saved-feedback" : ""}`}
					value={bottomInputValue} 
					onChange={(e) => handleChange(e as Event, "bottom")} 
					onKeyDown={e => handleKeyPress(e, "bottom")} 
				/>
			</div>
			<div className="d-flex">
				<label style={{ marginRight: "5px" }}>r</label>
				<VSCodeTextField 
					type="text"
					className={`numeric-field ${!isRightInputValid ? "invalid" : ""} ${rightSavedFeedback ? "saved-feedback" : ""}`}
					value={rightInputValue} 
					onChange={(e) => handleChange(e as Event, "right")} 
					onKeyDown={e => handleKeyPress(e, "right")} 
				/>
			</div>
		</FieldContainer>
  	);
}

export default Rectangle2dField;
