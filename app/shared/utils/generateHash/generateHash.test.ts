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
	});

	it('generates an unsynced hash with `__` prefix', () => {
		const unsyncedHash = generateHash(true);
		expect(unsyncedHash.startsWith('__')).toBe(true); // Check if it starts with `__`
		expect(unsyncedHash).toHaveLength(10); // 8 characters + 2 for the prefix
	});

	it('generates different hashes on multiple calls', () => {
		let hash1 = generateHash();
		let hash2 = generateHash();
		expect(hash1).not.toBe(hash2);

		let unsyncedHash1 = generateHash(true);
		let unsyncedHash2 = generateHash(true);
		expect(unsyncedHash1).not.toBe(unsyncedHash2);

		hash1 = generateHash();
		hash2 = generateHash();
		expect(hash1).not.toBe(hash2);

		unsyncedHash1 = generateHash(true);
		unsyncedHash2 = generateHash(true);
		expect(unsyncedHash1).not.toBe(unsyncedHash2);

		hash1 = generateHash();
		hash2 = generateHash();
		expect(hash1).not.toBe(hash2);

		unsyncedHash1 = generateHash(true);
		unsyncedHash2 = generateHash(true);
		expect(unsyncedHash1).not.toBe(unsyncedHash2);

		hash1 = generateHash();
		hash2 = generateHash();
		expect(hash1).not.toBe(hash2);

		unsyncedHash1 = generateHash(true);
		unsyncedHash2 = generateHash(true);
		expect(unsyncedHash1).not.toBe(unsyncedHash2);
	});
});
