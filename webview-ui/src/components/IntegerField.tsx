import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";

export interface NumericFieldProps extends IFieldProps {
	value: number;
	setValue: (value: number) => void;
	type: string;
	units?: string;
};

const IntegerField: React.FC<NumericFieldProps> = ({ label, value, setValue, type, units }) => {
	let [inputValue, setInputValue] = React.useState(value);

	let handleChange = function(e: Event): void {
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
		setValue(inputValue);
		setInputValue(inputValue);
	};

	const getStringValue = () => {
		if (inputValue == 0xFFFF || inputValue == 0xFFFFFFFF) {
			return "";
		}
		return inputValue.toString();
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeTextField type="tel" className="numeric-field" value={getStringValue()} placeholder="NULL" onChange={(e) => handleChange(e as Event)} />
						<span style={{ marginLeft: "0.5rem" }}>{units || ""}</span>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default IntegerField;
