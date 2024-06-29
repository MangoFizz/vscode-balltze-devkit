import { TagEntry } from "../types/EngineTag";
import { camelCaseToSnakeCase, normalToSnakeCase } from "./naming";
import setDeepValue from "./setDeepValue";
import InvaderClient from "./invaderTagClient";

interface TagChange {
	key: string;
	value: any;
	fieldType: string;
}

export class InvaderTagWriter {
	private data: any = {};
	private tag: TagEntry;

	constructor(tag: TagEntry) {
		this.tag = tag;
	}

	public applyTagChange({ key, value, fieldType }: TagChange) {
		let staticKey = camelCaseToSnakeCase(key);
		staticKey = normalToSnakeCase(staticKey);

		if(typeof(value) === "object") {
			switch(fieldType) {
				case "Rectangle2D": {
					value = `${value.top},${value.left},${value.bottom},${value.right}`;
					break;
				}
				case "ColorARGB": {
					value = `${value.alpha},${value.red},${value.green},${value.blue}`;
					break;
				}
				case "ColorRGB": {
					value = `${value.red},${value.green},${value.blue}`;
					break;
				}
				case "Point2D": {
					value = `${value.x},${value.y}`;
					break;
				}
				case "Point3D": {
					value = `${value.x},${value.y},${value.z}`;
					break;
				}
				case "Vector2D": {
					value = `${value.i},${value.j}`;
					break;
				}
				case "Vector3D": {
					value = `${value.i},${value.j},${value.k}`;
					break;
				}
				case "Euler2D": {
					value = `${value.yaw},${value.pitch}`;
					break;
				}
				case "Euler3D": {
					value = `${value.yaw},${value.pitch},${value.roll}`;
					break;
				}
				case "Euler3DPYR": {
					value = `${value.pitch},${value.yaw},${value.roll}`;
					break;
				}
				case "Quaternion": {
					value = `${value.i},${value.j},${value.k},${value.w}`;
					break;
				}
				case "TagDependency": {
					value = `${value.path}.${value.tagClass}`;
					break;
				}
			}
		}

		setDeepValue(this.data, staticKey, value);
	}

	public writeTag() {
		InvaderClient.edit(`${this.tag.path}.${this.tag.class}`, this.data);
	}
}
