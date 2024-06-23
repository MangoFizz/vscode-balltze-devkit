
export default interface ITagChangelog {
	path: string;
	class: string;
	handle: number;
	changes: { key: string, value: any }[];
};
