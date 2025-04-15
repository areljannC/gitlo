import { describe, it, expect } from 'vitest';
import handler from './ping.get';

describe('GET /api/ping', () => {
	it('returns a response of pong with a timestamp', () => {
		const response = handler({} as any);
		expect(response.message).toBe('pong');
		expect(response.timestamp).toBeTypeOf('string');
	});
});
