import { isNumberObject } from "util/types";
import ITagChangelog from "./ITagChangeLog";
import { vscode } from "./vscode";

export default class TagDataProxy {
	public target: { [key: string]: any };
	public changelog: ITagChangelog;
	public key?: string;

	constructor(target: any, changelog: ITagChangelog, parentKey?: string) {
		this.target = target;
		this.changelog = changelog;
		this.key = parentKey;
        
		return new Proxy(this, {
            set: (object: TagDataProxy, key: string, value: any) => {
                object.target[key] = value;
				const targetKey = object.key ? `${object.key}.${key}` : key;
				object.changelog.changes.push({ 
					key: targetKey, 
					value: value 
				});
				vscode.postMessage({ type: "tagDataChange", change: { key: targetKey, value: value } });
                return true;
            },

			get: (object: TagDataProxy, key: string) => {
				switch(key) {
					case "map": {
						if(Array.isArray(object.target)) {
							return function(...args: any) {
								return Array.prototype.map.apply(object.target.map((elem: any) => {
									if(typeof(elem) === "object") {
										const index = object.target.indexOf(elem);
										const targetKey = object.key ? `${object.key}[${index}]` : index;
										return new TagDataProxy(elem, object.changelog, targetKey);
									}
									return elem;
								}), args);
							};
						}
						return;
					}

					case "length": {
						if(Array.isArray(object.target)) {
							return object.target.length;
						}
						return;
					}

					case "indexOf": {
						if(Array.isArray(object.target)) {
							return function(item: any) {
								if(item instanceof TagDataProxy) {
									return object.target.indexOf((item as any).__target);
								}
								return object.target.indexOf(item);
							}
						}
						return;
					}

					default: {
						if (key in object.target) {
							if(typeof(object.target[key]) === "object") {
								const targetKey = object.key ? `${object.key}.${key}` : key;
								return new TagDataProxy(object.target[key], object.changelog, targetKey);
							}
							return object.target[key];
						}
						if(key == "__target") {
							return object.target;
						}
						return undefined;
					}
				}
			},

			ownKeys(object: TagDataProxy): string[] {
				if (typeof object.target === 'object') {
					return Object.keys(object.target);
				}
				return [];
			},

			getOwnPropertyDescriptor(object: TagDataProxy, key: string) {
				return { enumerable: true, configurable: true, value: object.target[key] };
			}
        });
    }
}
