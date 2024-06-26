
export function round(num: number): number {
	if (Math.abs(num - Math.round(num)) < 1e-5) {
	  return Math.round(num);
	}
	return Math.round(num * 1e5) / 1e5;
}

export function radToDeg(radians: number): number {
	return radians * (180 / Math.PI);
}

export function degToRad(degrees: number): number {
	return degrees * (Math.PI / 180);
}
