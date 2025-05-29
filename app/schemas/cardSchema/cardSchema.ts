import * as v from 'valibot';

// TODO: localization
// TODO: unit test
export const ERROR = Object.freeze({
	ID: {
		NON_EMPTY: 'Card ID is required.'
	},
	NAME: Object.freeze({
		MAX_LENGTH: 'Card name must be shorter than 64 characters.'
	})
});

export const getIdValidator = () => v.pipe(v.string(), v.trim(), v.nonEmpty(ERROR.ID.NON_EMPTY));
export const getNameValidator = () => v.pipe(v.string(), v.trim(), v.maxLength(64, ERROR.NAME.MAX_LENGTH));
