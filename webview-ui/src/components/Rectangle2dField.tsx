import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"

export interface IRectangle2dFieldProps extends IFieldProps {
	value: { [property: string]: number}
	setValue: (value: { [property: string]: number}) => void
};

export function Rectangle2dField(props: IRectangle2dFieldProps) {
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
	  
		  if (!/[0-9]/.test(key)) {
			e.preventDefault();
		  }
	};

	let handleChange = function(e: Event, property: string): void {
		let color = props.value;
		color[property] = Number.parseInt((e.target as HTMLInputElement).value);
		props.setValue(color);
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{props.label}</p>
				<div className="field-content">
					<div className="d-flex">
						<div className="d-flex">
							<label style={{ marginRight: "5px" }}>t: </label>
							<VSCodeTextField className="numeric-field" value={props.value["t"].toString()} onchange={(e) => handleChange(e as Event, "t")} onKeyDown={onKeyPress} />
						</div>
						<div className="d-flex">
							<label style={{ marginRight: "5px" }}>r: </label>
							<VSCodeTextField className="numeric-field" value={props.value["r"].toString()} onchange={(e) => handleChange(e as Event, "r")} onKeyDown={onKeyPress} />
						</div>
						<div className="d-flex">
							<label style={{ marginRight: "5px" }}>b: </label>
							<VSCodeTextField className="numeric-field" value={props.value["b"].toString()} onchange={(e) => handleChange(e as Event, "b")} onKeyDown={onKeyPress} />
						</div>
						<div className="d-flex">
							<label style={{ marginRight: "5px" }}>l: </label>
							<VSCodeTextField className="numeric-field" value={props.value["l"].toString()} onchange={(e) => handleChange(e as Event, "l")} onKeyDown={onKeyPress} />
						</div>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}
