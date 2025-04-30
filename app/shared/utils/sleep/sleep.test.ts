import { describe, it, expect, vi, afterEach } from 'vitest';
import { sleep } from './sleep';

describe('sleep', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('resolves after the specified delay', async () => {
		vi.useFakeTimers();

		const delay = 500;
		const sleepPromise = sleep(delay);

		// Fast-forward time by the delay
		vi.advanceTimersByTime(delay);

		// Await the promise—it should resolve
		await expect(sleepPromise).resolves.toBeUndefined();
	});
});
