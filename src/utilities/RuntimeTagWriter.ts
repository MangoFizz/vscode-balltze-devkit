import { TagEntry } from "../types/EngineTag";
import { normalToCamelCase } from "./naming";
import setDeepValue from "./setDeepValue";
import client from "./devkitClient";

interface TagChange {
	key: string;
	value: any;
	fieldType: string;
}

export class RuntimeTagWriter {
	private data: any = {};
	private tag: TagEntry;

	constructor(tag: TagEntry) {
		this.tag = tag;
	}

	public applyTagChange({ key, value, fieldType }: TagChange) {
		let runtimeKey = normalToCamelCase(key);
		runtimeKey = runtimeKey.replace(/\[(\d+)\]\./g, ".elements[$1].");
		if(typeof(value) === "object") {
			switch(fieldType) {
				case "TagDependency": {
					value = {
						tagClass: value.tagClass.fourCC,
						tagHandle: {
							value: value.tagHandle
						}
					}
					break;
				}
				case "enum": {
					value = value.index;
					break;
				}
			}
		}
		setDeepValue(this.data, runtimeKey, value);
	}

	public writeTag() {
		let res = client.conn.devkit.updateTag(this.tag.handle, this.data);
		console.log(res);
	}
}
