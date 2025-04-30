import { describe, beforeAll, afterAll, vi, it, expect } from 'vitest';
import { getTimestamp } from './getTimestamp';

describe('getTimestamp', () => {
	const fixedDate = new Date('2025-01-01T00:00:00.000Z');

	beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(fixedDate);
    });

    afterAll(() => {
        vi.useRealTimers();
    });

	it('returns an ISO timestamp of type `string`', () => {
		const timestamp = getTimestamp();
		expect(timestamp).toBeTypeOf('string');
	});

	it('returns a valid ISO timestamp', () => {
		const timestamp = getTimestamp();
		const currentTimestamp = new Date().toISOString();
		expect(currentTimestamp).toBe(timestamp);
	});
});
