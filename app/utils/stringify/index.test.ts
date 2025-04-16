import { describe, it, expect } from 'vitest';
import { stringify } from './stringify';

describe('stringify', () => {
	it('should stringify an object with indentation', () => {
		const obj = { key: 'value' };
		expect(stringify(obj)).toBe('{\n\t"key": "value"\n}');
	});

	it('should stringify an array with indentation', () => {
		const arr = [1, 2, 3];
		expect(stringify(arr)).toBe('[\n\t1,\n\t2,\n\t3\n]');
	});
});
