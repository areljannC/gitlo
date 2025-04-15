import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import * as createBoard from './createBoard';

describe('Create Board Validators', () => {
	describe('getNameValidator', () => {
		it('passes with a valid name', () => {
			const result = v.safeParse(createBoard.getNameValidator(), 'VALID_BOARD_NAME');
			expect(result.success).toBe(true);
		});

		const errors = [
			{ input: '', message: createBoard.ERROR.NAME.NON_EMPTY },
			{ input: 'abc', message: createBoard.ERROR.NAME.MIN_LENGTH },
			{ input: 'a'.repeat(40), message: createBoard.ERROR.NAME.MAX_LENGTH }
		];

		it.each(errors)('fails with input: "$input"', ({ input, message }) => {
			const result = v.safeParse(createBoard.getNameValidator(), input);
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(message);
		});
	});

	describe('getDescriptionValidator', () => {
		it('passes with a valid description', () => {
			const result = v.safeParse(createBoard.getDescriptionValidator(), 'This is a valid board description.');
			expect(result.success).toBe(true);
		});

		it('passes with no description (optional)', () => {
			const result = v.safeParse(createBoard.getDescriptionValidator(), undefined);
			expect(result.success).toBe(true);
		});

		it('fails when description exceeds max length', () => {
			const result = v.safeParse(createBoard.getDescriptionValidator(), 'a'.repeat(200));
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(createBoard.ERROR.DESCRIPTION.MAX_LENGTH);
		});
	});

	describe('getTagValidator', () => {
		it('passes with a valid tag', () => {
			const result = v.safeParse(createBoard.getTagValidator(), 'frontend');
			expect(result.success).toBe(true);
		});

		it('passes with no tag (optional)', () => {
			const result = v.safeParse(createBoard.getTagValidator(), undefined);
			expect(result.success).toBe(true);
		});

		const errors = [
			{ input: 'a', message: createBoard.ERROR.TAG.MIN_LENGTH },
			{ input: 'a'.repeat(20), message: createBoard.ERROR.TAG.MAX_LENGTH }
		];

		it.each(errors)('fails with input: "$input"', ({ input, message }) => {
			const result = v.safeParse(createBoard.getTagValidator(), input);
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(message);
		});
	});

	describe('getTagsValidator', () => {
		it('passes with a valid array of tags', () => {
			const result = v.safeParse(createBoard.getTagsValidator(), ['dev', 'frontend']);
			expect(result.success).toBe(true);
		});

		it('passes with no tags (optional)', () => {
			const result = v.safeParse(createBoard.getTagsValidator(), undefined);
			expect(result.success).toBe(true);
		});

		it('fails when one or more tags are invalid', () => {
			const result = v.safeParse(createBoard.getTagsValidator(), ['ok', 'x']);
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(createBoard.ERROR.TAG.MIN_LENGTH);
		});
	});

	describe('getColumnsValidator', () => {
		it('passes with a valid column count', () => {
			const result = v.safeParse(createBoard.getColumnsValidator(), 5);
			expect(result.success).toBe(true);
		});

		const errors = [
			{ input: 0, message: createBoard.ERROR.COLUMNS.MIN_VALUE },
			{ input: 20, message: createBoard.ERROR.COLUMNS.MAX_VALUE }
		];

		it.each(errors)('fails with value: $input', ({ input, message }) => {
			const result = v.safeParse(createBoard.getColumnsValidator(), input);
			expect(result.success).toBe(false);
			expect(result.issues![0].message).toContain(message);
		});
	});
});
