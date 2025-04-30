export class ColumnError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ColumnError';
	}
}
