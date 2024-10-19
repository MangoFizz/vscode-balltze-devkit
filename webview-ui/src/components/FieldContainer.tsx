import React from "react";
import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import "../css/field-container.css"

export interface BaseFieldProps {
	label: string
};

const FieldContainer: React.FC<BaseFieldProps> = ({ label, children }) => {
	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						{children}
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
		</div>
	);
};

export default FieldContainer;
