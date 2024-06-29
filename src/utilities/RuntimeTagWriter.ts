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
						tagClass: value.tagClass,
						path: value.path,
						tagHandle: {
							value: value.tagHandle
						}
					}
				}
			}
		}
		setDeepValue(this.data, runtimeKey, value);
	}

	public writeTag() {
		client.conn.devkit.updateTag(this.tag.handle, this.data);
	}
}
