import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";

export interface NumericFieldProps extends IFieldProps {
	values: number[];
	setValue: (values: number[]) => void;
	type: string;
	units?: string;
};

const IntegerBoundsField: React.FC<NumericFieldProps> = ({ label, values, setValue, type, units }) => {
	let [inputValues, setInputValues] = React.useState(values);

	let handleChange = function(e: Event, bound: number): void {
		let inputValue = parseInt((e.target as HTMLInputElement).value);
		switch(type) {
			case "int8": {
				if (inputValue < -128) {
					inputValue = -128;	
				}
				else if(inputValue >= 128) {
					inputValue = 128;
				}
				break;
			}

			case "uint8": {
				if (inputValue < 0) {
					inputValue = 0;	
				}
				else if(inputValue >= 255) {
					inputValue = 255;
				}
				break;
			}

			case "int16": {
				if (inputValue < -32768) {
					inputValue = -32768;	
				}
				else if(inputValue >= 32767) {
					inputValue = 32767;
				}
				break;
			}

			case "uint16": {
				if (inputValue < 0) {
					inputValue = 0;	
				}
				else if(inputValue >= 65535) {
					inputValue = 65535;
				}
				break;
			}

			case "int32": {
				if (inputValue < -2147483648) {
					inputValue = -2147483648;	
				}
				else if(inputValue >= 2147483647) {
					inputValue = 2147483647;
				}
				break;
			}

			case "uint32": {
				if (inputValue < 0) {
					inputValue = 0;	
				}
				else if(inputValue >= 4294967295) {
					inputValue = 4294967295;
				}
				break;
			}
		}
		let values = inputValues;
		inputValues[bound] = inputValue;
		setInputValues(inputValues);
		setValue(inputValues);
	};

	const getStringValue = (bound: number) => {
		if (inputValues[bound] == 0xFFFF || inputValues[bound] == 0xFFFFFFFF) {
			return "";
		}
		return inputValues[bound].toString();
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeTextField type="tel" className="numeric-field" value={getStringValue(0)} placeholder="NULL" onChange={(e) => handleChange(e as Event, 0)} />
						<span style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>-</span>
						<VSCodeTextField type="tel" className="numeric-field" value={getStringValue(1)} placeholder="NULL" onChange={(e) => handleChange(e as Event, 1)} />
						<span style={{ marginLeft: "0.5rem" }}>{units || ""}</span>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default IntegerBoundsField;
