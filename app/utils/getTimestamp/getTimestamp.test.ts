import { describe, it, expect } from 'vitest';
import { getTimestamp } from './getTimestamp';

describe('getTimestamp', () => {
	it('returns an ISO timestamp of type `string`', () => {
		const timestamp = getTimestamp();
		expect(timestamp).toBeTypeOf('string');
	});
	it('returns a valid ISO timestamp', () => {
		const timestamp = getTimestamp();
		const currentDate = new Date();
		expect(currentDate.toISOString()).toBe(timestamp);
	});
});
