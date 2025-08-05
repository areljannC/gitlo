import * as v from 'valibot';

// TODO: localization
// TODO: unit test
export const ERROR = Object.freeze({
	ID: {
		NON_EMPTY: 'Column ID is required.'
	},
	NAME: Object.freeze({
		MAX_LENGTH: 'Column name must be shorter than 32 characters.'
	})
});

export const getIdValidator = () => v.pipe(v.string(), v.trim(), v.nonEmpty(ERROR.ID.NON_EMPTY));
export const getNameValidator = () => v.pipe(v.string(), v.trim(), v.maxLength(32, ERROR.NAME.MAX_LENGTH));
