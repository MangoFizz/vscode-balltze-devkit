import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"
import { ChangeEventHandler } from "react";

export interface IColorArgbFieldProps extends IFieldProps {
	value: { [property: string]: number}
	setValue: (value: { [property: string]: number}) => void
};

export function ColorArgbField(props: IColorArgbFieldProps) {
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
	  
		  if (key === '.' && value.includes('.')) {
			e.preventDefault();
		  } 
		  else if (!/[0-9.]/.test(key)) {
			e.preventDefault();
		  }
	};

	let handleChange = function(e: Event, property: string): void {
		let color = props.value;
		color[property] = Number.parseInt((e.target as HTMLInputElement).value);
		props.setValue(color);
	};

	let handleColorPicker = (e: any) => {
		let getChannel = (i: number): number => {
			return parseFloat((parseInt(e.target.value.substr(i, 2), 16) / 255).toFixed(3));
		};

		props.setValue({
			"a": props.value.a,
			"r": getChannel(1),
			"g": getChannel(3),
			"b": getChannel(5)
		});
	};

	let getColorHexValue = () => {
		let colorHex = "";
		colorHex += props.value["r"].toString(16).padStart(2, '0');
		colorHex += props.value["g"].toString(16).padStart(2, '0');
		colorHex += props.value["b"].toString(16).padStart(2, '0');
		return colorHex;
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{props.label}</p>
				<div className="field-content">
					<div className="d-flex">
						{
							Object.keys(props.value).map((key, index) => (
								<div className="d-flex" key={index}>
									<label style={{ marginRight: "5px" }}>{key}: </label>
									<VSCodeTextField className="numeric-field" value={props.value[key].toString()} onchange={(e) => handleChange(e as Event, key)} onKeyDown={onKeyPress} />
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
