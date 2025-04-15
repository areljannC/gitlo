import * as v from 'valibot';

// TODO: Localization
export const ERROR = Object.freeze({
	NAME: Object.freeze({
		NON_EMPTY: 'Board name is required.',
		MIN_LENGTH: 'Board name must be longer than 4 characters.',
		MAX_LENGTH: 'Board name must be shorter than 32 characters.'
	}),
	DESCRIPTION: Object.freeze({
		MAX_LENGTH: 'Board description must be shorter than 128 characters.'
	}),
	TAG: Object.freeze({
		MIN_LENGTH: 'Tag must be longer than 2 characters.',
		MAX_LENGTH: 'Tag must be shorter than 16 characters.'
	}),
	COLUMNS: Object.freeze({
		MIN_VALUE: 'There must be at least 1 column.',
		MAX_VALUE: 'There can only be up to 16 columns.'
	})
});

export const getNameValidator = () => v.pipe(v.string(), v.trim(), v.nonEmpty(ERROR.NAME.NON_EMPTY), v.minLength(4, ERROR.NAME.MIN_LENGTH), v.maxLength(32, ERROR.NAME.MAX_LENGTH));

export const getDescriptionValidator = () => v.optional(v.pipe(v.string(), v.trim(), v.maxLength(128, ERROR.DESCRIPTION.MAX_LENGTH)));

export const getTagValidator = () => v.optional(v.pipe(v.string(), v.trim(), v.minLength(2, ERROR.TAG.MIN_LENGTH), v.maxLength(16, ERROR.TAG.MAX_LENGTH)));

export const getTagsValidator = () => v.optional(v.array(v.pipe(v.string(), v.trim(), v.minLength(2, ERROR.TAG.MIN_LENGTH), v.maxLength(16, ERROR.TAG.MAX_LENGTH))));

export const getColumnsValidator = () => v.pipe(v.number(), v.minValue(1, ERROR.COLUMNS.MIN_VALUE), v.maxValue(16, ERROR.COLUMNS.MAX_VALUE));
