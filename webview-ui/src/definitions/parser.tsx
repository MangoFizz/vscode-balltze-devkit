
const commonStructs = {
    tag_handle: {width: 0x4},
    tag_block: {width: 0xC, template: true},
    point2_d: {width: 0x8},
    point2_d_int: {width: 0x4},
    point3_d: {width: 0xC},
    rectangle2_d: {width: 0x8},
    color_a_r_g_b: {width: 0x10},
    color_a_r_g_b_int: {width: 0x4},
    color_r_g_b: {width: 0xC},
    tag_data_offset: {width: 0x14},
    tag_dependency: {width: 0x10},
    vector2_d: {width: 0x8},
    vector3_d: {width: 0xC},
    euler2_d: {width: 0x8},
    euler3_d: {width: 0xC},
    angle: {width: 0x4},
    fraction: {width: 0x4},
    index: {width: 0x2},
    tag_enum: {width: 0x2},
    tag_string: {width: 0x20},
    tag_four_c_c: {width: 0x4},
    quaternion: {width: 0x10},
    matrix: {width: 0x24},
    plane3_d: {width: 0x10},
    plane2_d: {width: 0xC},
    scenario_script_node_value: {width: 0x4}
}

const commonEnums = {
    framebuffer_blend_function: {width: 0x2},
    framebuffer_fade_mode: {width: 0x2},
    function_out: {width: 0x2},
    wave_function: {width: 0x2},
    material_type: {width: 0x2},
    function_type: {width: 0x2},
    function_bounds_mode: {width: 0x2},
    function_scale_by: {width: 0x2},
    function_name_nullable: {width: 0x2},
    grenade_type: {width: 0x2},
    vertex_type: {width: 0x2}
}

const commonBitfields = {
    is_unused_flag: {width: 0x4},
    is_unfiltered_flag: {width: 0x4},
    color_interpolation_flags: {width: 0x4}
}

const primitiveTypes = {
    byte: {width: 0x1},
    float: {width: 0x4},
    char: {width: 0x1},
    uint32: {width: 0x4},
    uint16: {width: 0x2},
    uint8: {width: 0x1},
    int32: {width: 0x4},
    int16: {width: 0x2},
    int8: {width: 0x1}
}

function camelCaseToSnakeCase(str: string): string {
	str = str[0].toLowerCase() + str.slice(1);
	let newStr = str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
	if (newStr.startsWith('_')) {
		newStr = newStr.slice(1);
	}
	return newStr;
}

function dashAndSentenceToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
              .replace(/-/g, "_")
              .replace(/ /g, "_")
              .replace(/'/g, "");
}

function normalToSnakeCase(str: string): string {
	return str.replace(/ /g, "_").replace(/[()']/g, "");
}

function snakeCaseToCamelCase(str: string): string {
	let newStr = str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
	newStr = newStr[0].toUpperCase() + newStr.slice(1);
	return newStr;
}

function snakeCaseToLowerCamelCase(str: string): string | null {
    let camelCaseStr = snakeCaseToCamelCase(str);
    if (camelCaseStr) {
        return camelCaseStr.charAt(0).toLowerCase() + camelCaseStr.slice(1);
    }
    return null;
}

interface FieldDefinition {
	name: string;
	type: string;
	size?: number;
	count?: number;
	bounds?: boolean;
	cache_only?: boolean;
	struct?: string;
}
  
  interface StructDefinition {
	class?: string;
	name: string;
	size: number;
	fields: FieldDefinition[];
	inherits?: string;
	width: number;
	type: string;
}
  
  interface StructField {
	name?: string;
	type: string;
	size?: number;
	pointer?: boolean;
	struct?: string;
	cacheOnly: boolean;
}
  
  interface Struct {
	name: string;
	width: number;
	fields: StructField[];
	inherits?: string;
}
  
function parseStruct(structDefinition: StructDefinition): Struct {
	const struct: Struct = {
		name: snakeCaseToCamelCase(structDefinition.class || structDefinition.name),
		width: structDefinition.size,
		fields: [],
	};
  
	if (structDefinition.inherits) {
	  	struct.inherits = structDefinition.inherits;
	}
  
	structDefinition.fields.forEach((field, fieldIndex) => {
	  	let fieldName = normalToSnakeCase(camelCaseToSnakeCase(field.name));
	  	const fieldType = field.type;
  
	  	if (fieldName && fieldName.startsWith('1')) {
			fieldName = "_" + fieldName;
	  	}
  
	  	let structField: StructField = { type: "unknown", cacheOnly: false }; // Default initialization
  
	  	switch (field.type) {
			case "pad":
				structField = { type: "pad", cacheOnly: false };
				break;
			case "TagID":
				fieldName = fieldName.replace("tag_id", "tag_handle");
				structField = { name: fieldName, type: "TagHandle", cacheOnly: false };
				break;
			case "Pointer":
				structField = { name: fieldName, type: "byte", pointer: true, cacheOnly: false };
				break;
			case "TagReflexive":
				structField = { name: fieldName, type: "TagBlock", struct: field.struct, cacheOnly: false };
				break;
			default:
				structField = { name: fieldName, type: fieldType, cacheOnly: false };
	  	}
  
	  	structField.size = field.size || field.count || undefined;
  
	  	if (field.bounds) {
			structField.size = 2;
	  	}
  
	  	structField.cacheOnly = field.cache_only || false;
  
	  	struct.fields[fieldIndex] = structField;
	});
  
	return struct;
}

interface DefinitionElement {
	name: string;
	options?: Record<number, string>;
}

interface Enum {
	name: string;
	values: Record<number, string>;
}

function parseEnum(enumDefinition: DefinitionElement): Enum {
	const enumResult: Enum = { name: enumDefinition.name, values: {} };
	if (enumDefinition.options) {
		for (const [index, value] of Object.entries(enumDefinition.options)) {
			enumResult.values[parseInt(index)] = camelCaseToSnakeCase(enumDefinition.name) + "_" + dashAndSentenceToSnakeCase(value);
		}
	}
	return enumResult;
}

interface BitfieldStruct {
	name: string;
	type: string;
	fields: Record<number, string>;
}

function parseBitfield(bitfieldDefinition: StructDefinition): BitfieldStruct {
	let bitfieldType: string;
	switch (bitfieldDefinition.width) {
		case 32:
			bitfieldType = "uint32";
			break;
		case 16:
			bitfieldType = "uint16";
			break;
		case 8:
			bitfieldType = "uint8";
			break;
		default:
			bitfieldType = "unknown";
	}

	const bitfield: BitfieldStruct = { name: bitfieldDefinition.name, type: bitfieldType, fields: {} };
	if (bitfieldDefinition.fields) {
		bitfieldDefinition.fields.forEach((field, index) => {
			let fieldName = dashAndSentenceToSnakeCase(field.name);
			if (fieldName && /^[0-9]/.test(fieldName)) {
				fieldName = "_" + fieldName;
			}
			bitfield.fields[index] = fieldName;
		});
	}
	return bitfield;
}

interface TagDefinition {
	enums: Enum[];
	bitfields: BitfieldStruct[];
	structs: Struct[];
}

function parseDefinition(definitionName: string, definition: StructDefinition[]): TagDefinition {
	const enums: Enum[] = [];
	const bitfields: BitfieldStruct[] = [];
	const structs: Struct[] = [];

	definition.forEach((element) => {
		switch (element.type) {
			case "enum":
				enums.push(parseEnum(element));
				break;
			case "bitfield":
				bitfields.push(parseBitfield(element));
				break;
			case "struct":
				structs.push(parseStruct(element));
				break;
		}
	});

	return { enums, bitfields, structs };
}

type Dependencies = Record<string, Record<string, Record<string, string>>>;

function getDependencies(definitions: Record<string, StructDefinition>): Dependencies {
	const dependencies: Dependencies = {};

	const findType = (typeName: string): [boolean, string | null, string | null] => {
		if (typeName === "pad") {
			return [true, null, "pad"];
		} else if (commonStructs[camelCaseToSnakeCase(typeName)]) {
			return [true, "common", "struct"];
		} else if (commonEnums[camelCaseToSnakeCase(typeName)]) {
			return [true, "common", "enum"];
		} else if (commonBitfields[camelCaseToSnakeCase(typeName)]) {
			return [true, "common", "bitfield"];
		} else if (primitiveTypes[camelCaseToSnakeCase(typeName)]) {
			return [true, null, "primitive"];
		}

		for (const [definitionName, definition] of Object.entries(definitions)) {
			for (const enumElement of definition.enums) {
				if (enumElement.name === typeName) {
					return [true, definitionName, "enum"];
				}
			}

			for (const bitfield of definition.bitfields) {
				if (bitfield.name === typeName) {
					return [true, definitionName, "bitfield"];
				}
			}

			for (const struct of definition.structs) {
				if (struct.name === typeName) {
					return [true, definitionName, "struct"];
				}
			}
		}

		return [false, null, null];
	};

	for (const [definitionName, definition] of Object.entries(definitions)) {
		for (const struct of definition.structs) {
			if (struct.inherits) {
				const [exists, dependency, dependencyType] = findType(struct.inherits);
				if (!exists || dependencyType !== "struct") {
					throw new Error(`Struct ${struct.name} inherits from ${struct.inherits} which does not exist or is not a struct`);
				}
				if (dependency) {
					dependencies[definitionName] = dependencies[definitionName] || {};
					dependencies[definitionName][dependency] = dependencies[definitionName][dependency] || {};
					dependencies[definitionName][dependency][struct.inherits] = dependencyType;
				}
			}
			for (const field of struct.fields) {
				if (field.type === "tag_block") {
					const [exists, dependency, dependencyType] = findType(field.struct!);
					if (!exists || dependencyType !== "struct") {
						throw new Error(`Struct ${struct.name} has a block field with an unknown struct type: ${field.struct}`);
					}
					if (dependency) {
						dependencies[definitionName] = dependencies[definitionName] || {};
						dependencies[definitionName][dependency] = dependencies[definitionName][dependency] || {};
						dependencies[definitionName][dependency][field.struct!] = dependencyType;
					}
				} else {
					const [exists, dependency, dependencyType] = findType(field.type);
					if (!exists) {
						throw new Error(`Struct ${struct.name} has a field with an unknown type: ${field.type}`);
					}
					if (dependency) {
						dependencies[definitionName] = dependencies[definitionName] || {};
						dependencies[definitionName][dependency] = dependencies[definitionName][dependency] || {};
						dependencies[definitionName][dependency][field.type] = dependencyType;
					}
				}
			}
		}
	}

	return dependencies;
}
