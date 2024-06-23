
export function camelCaseToSnakeCase(str: string): string {
	str = str[0].toLowerCase() + str.slice(1);
	let newStr = str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
	if (newStr.startsWith('_')) {
		newStr = newStr.slice(1);
	}
	return newStr;
}

export function snakeCaseToCamelCase(str: string): string {
	return str.replace(/_([a-z0-9])/g, function (match, p1) {
		return p1.toUpperCase();
	});
}

export function snakeCaseToPascalCase(str: string): string {
	let newStr: string = str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
	newStr = newStr[0].toUpperCase() + newStr.slice(1);
	return newStr;
}

export function normalToSnakeCase(str: string): string {
	return str.replace(/ /g, "_").replace(/[()']/g, "");
}

export function normalToCamelCase(str: string): string {
	return snakeCaseToCamelCase(normalToSnakeCase(str)) || str;
}

export function camelCaseToNormal(str: string): string {
	return str.replace(/([A-Z])/g, " $1").toLowerCase();
}
