import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import * as boardSchema from './boardSchema';

describe('Board Schema Validators', () => {
	describe('getIdValidator', () => {
		it('should validate a valid ID', () => {
			const result = v.safeParse(boardSchema.getIdValidator(), 'valid-id');
			expect(result.success).toBe(true);
		});
		it('should invalidate an empty ID', () => {
			const result = v.safeParse(boardSchema.getIdValidator(), '');
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.ID.NON_EMPTY);
		});
	});

	describe('getNameValidator', () => {
		it('should validate a valid name', () => {
			const result = v.safeParse(boardSchema.getNameValidator(), 'Valid Board Name');
			expect(result.success).toBe(true);
		});
		it('should invalidate an empty name', () => {
			const result = v.safeParse(boardSchema.getNameValidator(), '');
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.NAME.NON_EMPTY);
		});
		it('should invalidate a name that is too short', () => {
			const result = v.safeParse(boardSchema.getNameValidator(), 'abc');
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.NAME.MIN_LENGTH);
		});
		it('should invalidate a name that is too long', () => {
			const result = v.safeParse(boardSchema.getNameValidator(), 'a'.repeat(33));
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.NAME.MAX_LENGTH);
		});
	});

	describe('getDescriptionValidator', () => {
		it('should validate a valid description', () => {
			const result = v.safeParse(boardSchema.getDescriptionValidator(), 'A valid description.');
			expect(result.success).toBe(true);
		});
		it('should validate with no description (optional)', () => {
			const result = v.safeParse(boardSchema.getDescriptionValidator(), undefined);
			expect(result.success).toBe(true);
		});
		it('should invalidate a description that is too long', () => {
			const result = v.safeParse(boardSchema.getDescriptionValidator(), 'a'.repeat(129));
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.DESCRIPTION.MAX_LENGTH);
		});
	});

	describe('getTagValidator', () => {
		it('should validate a valid tag', () => {
			const result = v.safeParse(boardSchema.getTagValidator(), 'frontend');
			expect(result.success).toBe(true);
		});
		it('should validate with no tag (optional)', () => {
			const result = v.safeParse(boardSchema.getTagValidator(), undefined);
			expect(result.success).toBe(true);
		});
		it('should invalidate a tag that is too short', () => {
			const result = v.safeParse(boardSchema.getTagValidator(), 'a');
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.TAG.MIN_LENGTH);
		});
		it('should invalidate a tag that is too long', () => {
			const result = v.safeParse(boardSchema.getTagValidator(), 'a'.repeat(17));
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.TAG.MAX_LENGTH);
		});
	});

	describe('getTagsValidator', () => {
		it('should validate a valid array of tags', () => {
			const result = v.safeParse(boardSchema.getTagsValidator(), ['dev', 'frontend']);
			expect(result.success).toBe(true);
		});
		it('should validate with no tags (optional)', () => {
			const result = v.safeParse(boardSchema.getTagsValidator(), undefined);
			expect(result.success).toBe(true);
		});
		it('should invalidate if one or more tags are invalid', () => {
			const result = v.safeParse(boardSchema.getTagsValidator(), ['ok', 'x']);
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.TAG.MIN_LENGTH);
		});
	});

	describe('getColumnsValidator', () => {
		it('should validate a valid column count', () => {
			const result = v.safeParse(boardSchema.getColumnsValidator(), 5);
			expect(result.success).toBe(true);
		});
		it('should invalidate a column count that is too low', () => {
			const result = v.safeParse(boardSchema.getColumnsValidator(), 0);
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.COLUMNS.MIN_VALUE);
		});
		it('should invalidate a column count that is too high', () => {
			const result = v.safeParse(boardSchema.getColumnsValidator(), 20);
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.COLUMNS.MAX_VALUE);
		});
	});

	describe('getColumnIdsValidator', () => {
		it('should validate a valid array of column IDs', () => {
			const result = v.safeParse(boardSchema.getColumnIdsValidator(), ['a', 'b', 'c']);
			expect(result.success).toBe(true);
		});
		it('should invalidate if array is empty', () => {
			const result = v.safeParse(boardSchema.getColumnIdsValidator(), []);
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.COLUMNS.MIN_VALUE);
		});
		it('should invalidate if array is too long', () => {
			const result = v.safeParse(boardSchema.getColumnIdsValidator(), Array(17).fill('id'));
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(boardSchema.ERROR.COLUMNS.MAX_VALUE);
		});
	});
});
