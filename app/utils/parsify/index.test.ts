import { describe, it, expect } from 'vitest';
import { parsify } from './parsify';

describe('parsify', () => {
	it('should parse a valid JSON string into an object', () => {
		const jsonString = '{"key":"value"}';
		expect(parsify<{ key: string }>(jsonString)).toEqual({ key: 'value' });
	});

	it('should parse a valid JSON string into an array', () => {
		const jsonString = '[1,2,3]';
		expect(parsify<number[]>(jsonString)).toEqual([1, 2, 3]);
	});

	it('should throw an error for invalid JSON string', () => {
		const invalidJsonString = '{"key":value}';
		expect(() => parsify(invalidJsonString)).toThrow(SyntaxError);
	});
});
