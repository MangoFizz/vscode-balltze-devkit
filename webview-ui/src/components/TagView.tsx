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
import AngleField from "./AngleField";
import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import IntegerBoundsField from "./IntegerBoundsField";
import FloatBoundsField from "./FloatBoundsField";
import AngleBoundsField from "./AngleBoundsField";

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
							if(field?.bounds) {
								return (
									<IntegerBoundsField
										label={field.name}
										values={data[dataFieldName]}
										setValue={(bound: number, val: number) => { data[dataFieldName][bound] = val; }}
										type={field.type}
										units={field.units} />
								);
							}
							else {
								return (
									<IntegerField
										label={field.name}
										value={data[dataFieldName]}
										setValue={(val: number) => { data[dataFieldName] = val; }}
										type={field.type}
										units={field.units} />
								);
							}
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
						case "Fraction": {
							if(field.bounds) {
								return (
									<FloatBoundsField
										label={field.name}
										values={data[dataFieldName]}
										setValue={(bound: number, val: number) => { data[dataFieldName][bound] = val; }}
										units={field.units} />
								);
							}
							else {
								return (
									<FloatField
										label={field.name}
										value={data[dataFieldName]}
										setValue={(val: number) => { data[dataFieldName] = val; }}
										units={field.units} />
								);
							}
						}

						case "Angle": {
							if(field.bounds) {
								return (
									<AngleBoundsField
										label={field.name}
										values={data[dataFieldName]}
										setValue={(bound: number, val: number) => { data[dataFieldName][bound] = val; }} />
								);
							}
							else {
								return (
									<AngleField
										label={field.name}
										value={data[dataFieldName]}
										setValue={(val: number) => { data[dataFieldName] = val; }} />
								);
							}
						}

						case "TagReflexive": {
							if(!(data[dataFieldName]?.elements)) {
								console.log("DATA: ", data);
								console.log("FIELD: ", field);
							}
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
									}}
									getElemName={(elem: any): string => {
										const elemType = tagDefinitions.find((definition) => definition.name === field.struct);
										const elemIndex = data[dataFieldName].elements.indexOf(elem);
										if(elemType && elemType.title && elemType.fields) {
											const fields = elemType.fields as TagStructField[];
											const titleField = fields.find((field) => field.name === elemType.title);
											const fieldName = normalToCamelCase(elemType.title);
											switch(titleField?.type) {
												case "TagString": {
													return `${elemIndex}: ${elem[fieldName]}`;
												}
												case "TagDependency": {
													const tagDependency = elem[fieldName];
													if(tagDependency.tagHandle.value != 0xFFFFFFFF) {
														return `${elemIndex}: ${tagDependency.path}`;
													}
												}
											}
										}
										return `${elemIndex}`;
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

	let data = React.useRef(new TagDataProxy(tagData, changelog.current));

	return (
		<div>
			<VSCodeDivider role="presentation"></VSCodeDivider>
			{renderTagClass(tagEntry.class, data.current)}
		</div>
	);
}

export default TagView;
