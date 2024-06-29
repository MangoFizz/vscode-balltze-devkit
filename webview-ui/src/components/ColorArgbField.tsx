import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import React from "react";

export interface ColorArgbFieldProps extends IFieldProps {
	value: { [property: string]: number};
	setValue: (value: { [key: string]: number }) => void;
};

const ColorArgbField: React.FC<ColorArgbFieldProps> = ({ label, value, setValue }) => {
	let [colors, setColors] = React.useState(value);

	let onKeyPress = function(e: React.KeyboardEvent<HTMLInputElement>): void {
		const { key } = e;
    	const { value } = e.target as HTMLInputElement;

		if (
			key === 'Backspace' ||
			key === 'Tab' ||
			key === 'Enter' ||
			key === 'ArrowLeft' ||
			key === 'ArrowRight' ||
			key === 'ArrowUp' ||
			key === 'ArrowDown' ||
			key === 'Delete'
		) {
			return;
		}
	  
		try {
			Number.parseFloat(value + key);
		}
		catch (error) {
			e.preventDefault();
		}
	};

	let handleChange = function(e: Event, property: string): void {
		let val = Number.parseInt((e.target as HTMLInputElement).value);
		let currentColors = colors;
		currentColors[property] = val;
		setColors(currentColors);
		setValue(currentColors);
	};

	let handleColorPicker = (e: any) => {
		let getChannel = (i: number): number => {
			return parseFloat((parseInt(e.target.value.substr(i, 2), 16) / 255).toFixed(3));
		};

		let pickedColor = {
			alpha: value.alpha,
			red: getChannel(1),
			green: getChannel(3),
			blue: getChannel(5)
		};

		setColors(pickedColor);
		setValue(pickedColor);
	};

	let getColorHexValue = () => {
		let colorHex = "#";
		let getColorHex = (channel: number): string => Math.round(channel * 255).toString(16).padStart(2, '0');
		colorHex += getColorHex(colors["red"]);
		colorHex += getColorHex(colors["green"]);
		colorHex += getColorHex(colors["blue"]);
		return colorHex;
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						{
							Object.keys(colors).map((key, index) => (
								<div className="d-flex" key={index}>
									<label style={{ marginRight: "5px" }}>{key[0]}: </label>
									<VSCodeTextField className="numeric-field" value={`${colors[key]}`} onChange={(e) => handleChange(e as Event, key)} onKeyDown={onKeyPress} />
								</div>
							))
						}
						<input type="color" value={ getColorHexValue() } onChange={handleColorPicker} />
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default ColorArgbField;
