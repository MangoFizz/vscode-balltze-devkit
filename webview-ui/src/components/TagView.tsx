import React from "react";
import { useState } from "react";
import TagDefinitions from "../definitions"

type TagEntry = {
	path: string
	handle: number
	class: keyof (typeof TagDefinitions)
};

export interface ITagView {
	//tagData: { [key: string]: any },
	tagData: any
	tagEntry: TagEntry
};

const TagView: React.FC<ITagView> = ({tagData, tagEntry}) => {
	const definition = TagDefinitions[tagEntry.class];

	return (
		<div>
			<h2>{tagEntry.path}</h2>
			<p>Class: {tagEntry.class}</p>
			<p>Handle: {tagEntry.handle}</p>
			{
				definition.map((field, index) => {
					return (
						<div key={index}>
							<p>{JSON.stringify(field)}</p>
						</div>
					);
				})
			}
		</div>
  	);
}


export default TagView;