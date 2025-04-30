import { describe, it, expect } from 'vitest';
import { BoardError } from './BoardError';

describe('BoardError', () => {
	it('should set the name property to `BoardError`', () => {
		const error = new BoardError('Test message');
		expect(error.name).toBe('BoardError');
	});

	it('should set the message correctly', () => {
		const testMessage = 'This is a test error.';
		const error = new BoardError(testMessage);
		expect(error.message).toBe(testMessage);
	});

	it('should be an instance of Error', () => {
		const error = new BoardError('Another test');
		expect(error).toBeInstanceOf(Error);
	});
});
