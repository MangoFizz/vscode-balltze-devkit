import React from "react";
import tagDefinitions, { TagDataType, TagStructField } from "../definitions"
import TagDataProxy from "../utilities/TagDataProxy";
import ITagChangelog from "../utilities/ITagChangeLog";
import { normalToCamelCase } from "../utilities/naming";
import EnumField from "./EnumField";
import FlagsField from "./FlagsField";
import StringField from "./StringField";
import Rectangle2dField from "./Rectangle2dField";
import IntegerField from "./IntegerField";
import TagDependencyField from "./TagDependencyField";
import FloatField from "./FloatField";
import ColorArgbField from "./ColorArgbField";
import TagBlock from "./TagBlock";
import VectorField from "./VectorField";

type TagEntry = {
	path: string;
	handle: number;
	class: string;
};

interface TagViewProps {
	tagData: { [key: string]: any },
	tagEntry: TagEntry
};

const renderTagDataStruct = (definition: TagDataType, data: { [key: string]: any }): JSX.Element => {
	if(definition.type != "struct") {
		console.error("Data type is not a struct");
		return <></>;
	}

	const fields = definition.fields as TagStructField[];
	return (
		<div>
			{
				fields.map((field): JSX.Element => {
					if(field.type == "pad" || field.cache_only) {
						return <></>;
					}

					const dataFieldName = normalToCamelCase(field.name);

					switch(field.type) {
						case "TagString": {
							return (
								<StringField 
									label={field.name} 
									value={data[dataFieldName]}
									setValue={(val) => { data[dataFieldName] = val; }} />
							);
						}

						case "Rectangle2D": {
							return (
								<Rectangle2dField
									label={field.name}
									value={data[dataFieldName]}
									setValue={(bound, val) => { data[dataFieldName][bound] = val; }} />
							);
						}

						case "ColorARGB": {
							return (
								<ColorArgbField 
									label={field.name}
									value={data[dataFieldName]}
									setValue={(bound, val) => { data[dataFieldName][bound] = val; }} />
							);
						}

						case "Point2D":
						case "Point3D":
						case "Vector2D":
						case "Vector3D":
						case "Euler2D":
						case "Euler3D":
						case "Quaternion": {
							return (
								<VectorField 
									label={field.name}
									value={data[dataFieldName]}
									setValue={(axis, val) => { data[dataFieldName][axis] = val; }} />
							);
						}

						case "TagDependency": {
							return (
								<TagDependencyField 
									label={field.name} 
									validClasses={field.classes as string[]}
									value={data[dataFieldName]}
									setValue={(tagClass: string, tagHandle: number) => { 
										data[dataFieldName].tagClass = tagClass.toUpperCase();
										data[dataFieldName].tagHandle.value = tagHandle;
									}} />
							);
						}

						case "int8":
						case "uint8":
						case "int16":
						case "uint16":
						case "int32":
						case "uint32": {
							return (
								<IntegerField
									label={field.name}
									value={data[dataFieldName]}
									setValue={(val: number) => { data[dataFieldName] = val; }}
									type={field.type} />
							);
						}

						case "Index":
						case "TagEnum":
						case "TickCount16": {
							return (
								<IntegerField
									label={field.name}
									value={data[dataFieldName]}
									setValue={(val: number) => { data[dataFieldName] = val; }}
									type={"uint16"} />
							);
						}

						case "TickCount32": {
							return (
								<IntegerField
									label={field.name}
									value={data[dataFieldName]}
									setValue={(val: number) => { data[dataFieldName] = val; }}
									type={"uint32"} />
							);
						}

						case "float":
						case "double":
						case "Angle":
						case "Fraction": {
							return (
								<FloatField
									label={field.name}
									value={data[dataFieldName]}
									setValue={(val: number) => { data[dataFieldName] = val; }} />
							);
						}

						case "TagReflexive": {
							return (
								<TagBlock 
									label={field.name}
									elems={data[dataFieldName].elements}
									render={(elem: any) => {
										const elemsType = tagDefinitions.find((definition) => definition.name === field.struct);
										if(!elemsType) {
											return <></>;
										}
										return renderTagDataStruct(elemsType as TagDataType, elem);
									}} />
							);
						}

						default: {
							const fieldType = tagDefinitions.find((definition) => definition.name === field.type);
							if(!fieldType) {
								return <></>;
							}
							
							switch(fieldType.type) {
								case "enum": {
									return (
										<EnumField 
											enumValues={fieldType.options as string[]} 
											label={field.name}
											value={data[dataFieldName]}
											setValue={(val) => { data[dataFieldName] = val; }} />
									);
								}
		
								case "bitfield": {
									return (
										<FlagsField 
											label={field.name}
											values={data[dataFieldName]}
											setValue={(flag, val) => { data[dataFieldName][flag] = val; }} />
									);
								}
		
								default: {
									return <></>;
								}
							}
						}
					}

					
				})
			}
		</div>
	);
}

const renderTagClass = (tagClass: string, tagData: { [key: string]: any }): JSX.Element => {
	const className = tagClass.toLowerCase();
	const classDefinition = tagDefinitions.find((definition) => definition.class === className);
	return renderTagDataStruct(classDefinition as TagDataType, tagData);
}

const TagView: React.FC<TagViewProps> = ({tagData, tagEntry}) => {
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
