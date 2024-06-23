import { VSCodeDivider, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import React from "react";

interface ITagBlock {
	label: string;
	elems: { [key: string]: any };
	render: (elem: any) => JSX.Element;
	getElemName?: (elem: any) => string;
};

const TagBlock: React.FC<ITagBlock> = ({label, elems, render, getElemName}) => {
	let [elemIndex, setElemIndex] = React.useState(0);

	let nameForElem = getElemName || ((elem: any) => `Element ${elems.indexOf(elem)}`);

	return (
		<div>
			<section className="field-container">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeDropdown 
							position="below" 
							style={{ width: "50%", marginRight: "5px" }} 
							selectedIndex={elemIndex} 
							onChange={(e) => setElemIndex((e.target as HTMLSelectElement).selectedIndex)}>
							{
								elems.map((value: any, index: number) => (
									<VSCodeOption key={index} value={value}>{nameForElem(value)}</VSCodeOption>
								))
							}	
						</VSCodeDropdown>
					</div>
				</div>
			</section>
			<VSCodeDivider role="presentation"></VSCodeDivider>
			<div style={{ marginLeft: "1rem" }}>
				{render(elems[elemIndex])}
			</div>
		</div>
	);
}

export default TagBlock;
