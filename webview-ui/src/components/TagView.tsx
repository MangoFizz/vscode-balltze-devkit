import React from "react";
import tagDefinitions, { TagDataType, TagStructField } from "../definitions"
import { camelCaseToSnakeCase, normalToCamelCase } from "../utilities/naming";
import EnumField from "./EnumField";
import FlagsField from "./FlagsField";
import StringField from "./StringField";
import Rectangle2dField from "./Rectangle2dField";
import IntegerField from "./IntegerField";
import TagDependencyField from "./TagDependencyField";
import FloatField from "./FloatField";
import ColorField from "./ColorField";
import TagBlock from "./TagBlock";
import VectorField from "./VectorField";
import AngleField from "./AngleField";
import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import IntegerBoundsField from "./IntegerBoundsField";
import FloatBoundsField from "./FloatBoundsField";
import AngleBoundsField from "./AngleBoundsField";
import { vscode } from "../utilities/vscode";
import ColorFieldInt from "./ColorFieldInt";

type TagEntry = {
	path: string;
	handle: number;
	class: string;
};

interface TagViewProps {
	tagData: { [key: string]: any },
	tagEntry: TagEntry
};

const updateValue = (key: string, value: any, fieldType: string) => {
	vscode.postMessage({ type: "tagDataChange", change: { key, value, fieldType } });
}

const renderTagDataStruct = (definition: TagDataType, data: { [key: string]: any }, parentKey: string = ""): JSX.Element => {
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
					const fieldKey = `${parentKey}${field.name}`;

					const setValue = (val: any) => { updateValue(fieldKey, val, field.type) };

					switch(field.type) {
						case "TagString": {
							return (
								<StringField 
									label={field.name} 
									value={data[dataFieldName]}
									setValue={setValue} />
							);
						}

						case "Rectangle2D": {
							return (
								<Rectangle2dField
									label={field.name}
									value={data[dataFieldName]}
									setValue={setValue} />
							);
						}

						case "ColorRGB":
						case "ColorARGB": {
							return (
								<ColorField 
									label={field.name}
									value={data[dataFieldName]}
									setValue={setValue} />
							);
						}

						case "ColorRGBInt":
						case "ColorARGBInt": {
							return (
								<ColorFieldInt
									label={field.name}
									value={data[dataFieldName]}
									setValue={setValue} />
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
									setValue={setValue} />
							);
						}

						case "TagDependency": {
							return (
								<TagDependencyField 
									label={field.name} 
									validClasses={field.classes as string[]}
									value={data[dataFieldName]}
									setValue={setValue}
									nullable={!(field.non_null || false)} />
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
										setValue={setValue}
										type={field.type}
										units={field.unit} />
								);
							}
							else {
								return (
									<IntegerField
										label={field.name}
										value={data[dataFieldName]}
										setValue={setValue}
										type={field.type}
										units={field.unit} />
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
									setValue={setValue}
									type={"uint16"} />
							);
						}

						case "TickCount32": {
							return (
								<IntegerField
									label={field.name}
									value={data[dataFieldName]}
									setValue={setValue}
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
										setValue={setValue}
										units={field.unit} />
								);
							}
							else {
								return (
									<FloatField
										label={field.name}
										value={data[dataFieldName]}
										setValue={setValue}
										units={field.unit} />
								);
							}
						}

						case "Angle": {
							if(field.bounds) {
								return (
									<AngleBoundsField
										label={field.name}
										values={data[dataFieldName]}
										setValue={setValue} />
								);
							}
							else {
								return (
									<AngleField
										label={field.name}
										value={data[dataFieldName]}
										setValue={setValue} />
								);
							}
						}

						case "TagReflexive": {
							return (
								<TagBlock 
									label={field.name}
									elems={data[dataFieldName].elements}
									render={(elem: any) => {
										const elemsType = tagDefinitions.find((definition: any) => definition.name === field.struct);
										if(!elemsType) {
											return <></>;
										}
										return renderTagDataStruct(elemsType as TagDataType, elem, `${fieldKey}[${data[dataFieldName].elements.indexOf(elem)}].`);
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
											setValue={(val: any) => { updateValue(fieldKey, val, "enum") }} />
									);
								}
		
								case "bitfield": {
									return (
										<FlagsField 
											label={field.name}
											values={data[dataFieldName]}
											setValue={(flag, val) => { updateValue(`${fieldKey}.${flag}`, val, "boolean") }} />
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
	const className = camelCaseToSnakeCase(tagClass);
	let classDefinition = tagDefinitions.find((definition) => definition.class === className);
	
	if (!classDefinition) {
		console.error(`Class definition for ${className} not found`);
		return <></>;
	}

	const getParentFields = (struct: TagDataType): TagStructField[] => {
		let parentFields: TagStructField[] = [];
		if(struct.inherits) {
			const parentClass = tagDefinitions.find((definition) => definition.name == struct.inherits);
			if(parentClass && parentClass.fields) {
				parentFields = [getParentFields(parentClass), parentClass.fields].flat() as TagStructField[];
			}
		}
		return parentFields;
	};
	classDefinition.fields = [getParentFields(classDefinition), classDefinition.fields].flat() as TagStructField[];

	return renderTagDataStruct(classDefinition as TagDataType, tagData);
}

const TagView: React.FC<TagViewProps> = ({tagData, tagEntry}) => {
	return (
		<div>
			<VSCodeDivider role="presentation"></VSCodeDivider>
			{renderTagClass(tagEntry.class, tagData)}
		</div>
	);
}

export default TagView;
