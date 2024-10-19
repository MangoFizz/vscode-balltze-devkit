import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import React from "react";
import "../css/tag-block.css"

interface TagBlockProps {
	label: string;
	elems: any[];
	render: (elem: any) => JSX.Element;
	getElemName?: (elem: any) => string;
};

const TagBlock: React.FC<TagBlockProps> = ({label, elems, render, getElemName}) => {
	let [elemIndex, setElemIndex] = React.useState(0);

	let nameForElem = getElemName || ((elem: any) => `${elems.indexOf(elem)}`);

	return (
		<div>
			<section className="field-container tag-block-header">
				<p className="field-label">{label}</p>
				<div className="field-content">
					<div className="d-flex">
						<VSCodeDropdown 
							position="below" 
							style={{ width: "50%", marginRight: "5px" }} 
							selectedIndex={elemIndex} 
							onChange={(e) => setElemIndex((e.target as HTMLSelectElement).selectedIndex)}
							disabled={elems.length == 0}>
							{
								elems.map((value: any, index: number) => (
									<VSCodeOption key={index} value={value}>{nameForElem(value)}</VSCodeOption>
								))
							}	
						</VSCodeDropdown>
					</div>
				</div>
			</section>
			<div className="tag-block-content">
				<div className="tag-block-sidebar"></div>
				<div className="tag-block-items">
					{
						elems.map((elem: any, index: number) => {
							return <div key={index} style={{ display: index == elemIndex ? "block" : "none" }}>{render(elem)}</div>;
						})
					}
				</div>
			</div>
		</div>
	);
}

export default TagBlock;
