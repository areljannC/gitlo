import { describe, it, expect } from 'vitest';
import { generateHash } from './generateHash';

describe('generateHash', () => {
	it('generates a hash of type `string`', () => {
		const hash = generateHash();
		expect(hash).toBeTypeOf('string');
	});
	it('generates a hash with 8 characters', () => {
		const hash = generateHash();
		expect(hash).toHaveLength(8);
		expect(hash).toBeTypeOf('string');
	});
});
