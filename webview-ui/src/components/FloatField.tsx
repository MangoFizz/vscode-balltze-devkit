import { VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"

export interface NumericFieldProps extends IFieldProps {
	value: number, 
	setValue: (value: number) => void
};

const FloatField: React.FC<NumericFieldProps> = ({ label, value, setValue }) => {
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
	  
		if (!/[0-9.]/.test(key)) {
			e.preventDefault();
		}
	};

	let handleChange = function(e: Event): void {
		setValue(Number.parseFloat((e.target as HTMLInputElement).value));
	};

  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<VSCodeTextField className="numeric-field" value={value.toString()} onchange={handleChange} onKeyDown={onKeyPress} />
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}

export default FloatField;
