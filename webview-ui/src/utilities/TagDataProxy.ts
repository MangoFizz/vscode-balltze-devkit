import ITagChangelog from "./ITagChangeLog";

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
                return true;
            },

			get: (object: TagDataProxy, key: string) => {
				if (key in object.target) {
					if(typeof(object.target[key]) === 'object') {
						const targetKey = object.key ? `${object.key}.${key}` : key;
						return new TagDataProxy(object.target[key], object.changelog, targetKey);
					}
					return object.target[key];
				}
				return undefined;
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
