import { VSCodeButton, VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { IFieldProps } from "../utilities/IFieldProps";
import "../css/field-container.css"

export interface IStringFieldProps extends IFieldProps {
	validClasses: string[],
	value: { [key: string]: string },
	setValue: (value: { [key: string]: string }) => void
};

export function TagDependencyField(props: IStringFieldProps) {
	let handleClassChange = function(e: Event): void {
		let val = props.value;
		val.tagClass = (e.target as HTMLSelectElement).value;
		props.setValue(val);
	};
	
  	return (
		<div>
			<section className="field-container">
				<p className="field-label">{props.label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeDropdown 
							position="below" 
							style={{ width: "30%", marginRight: "5px" }} 
							selectedIndex={props.validClasses.indexOf(props.value.tagClass)} 
							onchange={handleClassChange}
						>
							{
								props.validClasses.map((value, index) => (
									<VSCodeOption key={index} value={value}>{value}</VSCodeOption>
								))
							}	
						</VSCodeDropdown>
						<VSCodeTextField style={{ marginRight: "5px" }}  readOnly={true} value={props.value.tagPath} />
						<div className="d-flex">
							<VSCodeButton style={{ marginRight: "5px" }} onClick={() => {}} >Find</VSCodeButton>
							<VSCodeButton onClick={() => {}} >Open</VSCodeButton>
						</div>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
  	);
}
