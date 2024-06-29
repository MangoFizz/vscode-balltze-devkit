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
		setDeepValue(this.data, runtimeKey, value);
	}

	public writeTag() {
		client.conn.devkit.updateTag(this.tag.handle, this.data);
	}
}
