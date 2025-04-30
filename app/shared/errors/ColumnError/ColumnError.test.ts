import { describe, it, expect } from 'vitest';
import { ColumnError } from './ColumnError';

describe('ColumnError', () => {
	it('should set the name property to `ColumnError`', () => {
		const error = new ColumnError('Test message');
		expect(error.name).toBe('ColumnError');
	});

	it('should set the message correctly', () => {
		const testMessage = 'This is a test error.';
		const error = new ColumnError(testMessage);
		expect(error.message).toBe(testMessage);
	});

	it('should be an instance of Error', () => {
		const error = new ColumnError('Another test');
		expect(error).toBeInstanceOf(Error);
	});
});
