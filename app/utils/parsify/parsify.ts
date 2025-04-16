export function parsify<T>(jsonString: string): T {
	return JSON.parse(jsonString);
}
