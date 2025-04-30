import { describe, it, expect } from 'vitest';
import { CardError } from './CardError';

describe('CardError', () => {
	it('should set the name property to `CardError`', () => {
		const error = new CardError('Test message');
		expect(error.name).toBe('CardError');
	});

	it('should set the message correctly', () => {
		const testMessage = 'This is a test error.';
		const error = new CardError(testMessage);
		expect(error.message).toBe(testMessage);
	});

	it('should be an instance of Error', () => {
		const error = new CardError('Another test');
		expect(error).toBeInstanceOf(Error);
	});
});
