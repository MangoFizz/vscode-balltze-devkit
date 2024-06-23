import React from "react";
import tagDefinitions, { TagDataType, TagStructField } from "../definitions"
import TagDataProxy from "../utilities/TagDataProxy";
import ITagChangelog from "../utilities/ITagChangeLog";
import { camelCaseToSnakeCase, normalToCamelCase, normalToSnakeCase } from "../utilities/naming";
import { EnumField } from "./EnumField";
import { FlagsField } from "./FlagsField";

type TagEntry = {
	path: string;
	handle: number;
	class: string;
};

export interface ITagView {
	tagData: { [key: string]: any },
	tagEntry: TagEntry
};

const renderTagDataType = (definition: TagDataType, data: { [key: string]: any }): JSX.Element => {
	switch(definition.type) {
		case "struct": {
			const fields = definition.fields as TagStructField[];
			return (
				<div>
					{
						fields.map((field): JSX.Element => {
							const fieldType = tagDefinitions.find((definition) => definition.name === field.type);
							if(!fieldType) {
								return <></>;
							}

							const dataFieldName = normalToCamelCase(field.name);

							switch(fieldType.type) {
								case "enum": {
									return (
										<EnumField 
											key={field.name}
											enumValues={fieldType.options as string[]} 
											label={field.name}
											value={data[dataFieldName]}
											setValue={(val) => { data[dataFieldName] = val; }} />
									);
								}

								case "bitfield": {
									return (
										<FlagsField 
											key={field.name}
											label={field.name}
											values={data[dataFieldName]}
											setValue={(flag, val) => { data[dataFieldName][flag] = val; }} />
									);
								}

								default: {
									return <></>;
								}
							}
						})
					}
				</div>
			);
		}
			
		default:
			return <></>;
	}
}

const renderTagClass = (tagClass: string, tagData: { [key: string]: any }): JSX.Element => {
	const className = tagClass.toLowerCase();
	const classDefinition = tagDefinitions.find((definition) => definition.class === className);
	console.log("Definition: ", className);
	return renderTagDataType(classDefinition as TagDataType, tagData);
}

const TagView: React.FC<ITagView> = ({tagData, tagEntry}) => {
	let changelog = React.useRef<ITagChangelog>({ 
		path: tagEntry.path, 
		class: tagEntry.class, 
		handle: tagEntry.handle, 
		changes: [] 
	});

	let data = React.useRef(new TagDataProxy(tagData, changelog.current))

	return (
		<div>
			{renderTagClass(tagEntry.class, data.current)}
		</div>
	);
}

export default TagView;
