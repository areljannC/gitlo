import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import * as columnSchema from './columnSchema';

describe('Column Schema Validators', () => {
	describe('getIdValidator', () => {
		it('should validate a valid ID', () => {
			const result = v.safeParse(columnSchema.getIdValidator(), 'valid-id');
			expect(result.success).toBe(true);
		});

		it('should invalidate an invalid ID', () => {
			const result = v.safeParse(columnSchema.getIdValidator(), undefined);
			expect(result.success).toBe(false);
		});
	});

	describe('getNameValidator', () => {
		it('should validate a valid name', () => {
			const result = v.safeParse(columnSchema.getNameValidator(), 'Valid Column Name');
			expect(result.success).toBe(true);
		});

		it('should invalidate a name that is too long', () => {
			const result = v.safeParse(columnSchema.getNameValidator(), 'a'.repeat(33));
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(columnSchema.ERROR.NAME.MAX_LENGTH);
		});
	});
});
