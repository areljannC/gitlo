import { vi, describe, it, expect } from 'vitest';
import handler from './ping.get';

const MOCKED_TIMESTAMP = 'MOCKED_TIMESTAMP';

vi.mock('~/shared/utils', () => ({ getTimestamp: () => MOCKED_TIMESTAMP }));

describe('GET /api/ping', () => {
	it('returns a response of pong with a timestamp', () => {
		const response = handler({} as any);
		expect(response).toEqual({
			message: 'pong',
			timestamp: MOCKED_TIMESTAMP
		});
	});
});
