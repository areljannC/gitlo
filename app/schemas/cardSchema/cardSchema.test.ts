import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import * as cardSchema from './cardSchema';

describe('Card Schema Validators', () => {
	describe('getIdValidator', () => {
		it('should validate a valid ID', () => {
			const result = v.safeParse(cardSchema.getIdValidator(), 'valid-id');
			expect(result.success).toBe(true);
		});

		it('should invalidate an invalid ID', () => {
			const result = v.safeParse(cardSchema.getIdValidator(), undefined);
			expect(result.success).toBe(false);
		});
	});

	describe('getNameValidator', () => {
		it('should validate a valid name', () => {
			const result = v.safeParse(cardSchema.getNameValidator(), 'Valid Card Name');
			expect(result.success).toBe(true);
		});

		it('should invalidate a name that is too long', () => {
			const result = v.safeParse(cardSchema.getNameValidator(), 'a'.repeat(65));
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(cardSchema.ERROR.NAME.MAX_LENGTH);
		});
	});
});
