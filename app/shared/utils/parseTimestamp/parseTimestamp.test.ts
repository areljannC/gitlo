import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { parseTimestamp } from './parseTimestamp';
import { format } from 'date-fns';

describe('parseTimestamp', () => {
	const fixedDate = new Date('2025-01-01T00:00:00.000Z');

	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(fixedDate);
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	it('formats a valid ISO timestamp correctly', () => {
		const inputTimestamp = '2025-01-01T02:30:00.000Z';
		// Use the same format as in your function to compute the expected value.
		const expected = format(new Date(inputTimestamp), 'yyyy/MM/dd hh:mm a');
		const result = parseTimestamp(inputTimestamp);
		expect(result).toBe(expected);
	});

	it('returns undefined and logs an error for an invalid timestamp', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const result = parseTimestamp('invalid date string');
		expect(result).toBeUndefined();
		expect(consoleSpy).toHaveBeenCalledWith('Error parsing timestamp.');
		consoleSpy.mockRestore();
	});
});
