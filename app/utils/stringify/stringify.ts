export function stringify(object: unknown): string {
	return JSON.stringify(object, null, '\t');
}
