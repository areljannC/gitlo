import { defineEventHandler, readBody } from 'h3';
import { getTimestamp } from '~/shared/utils';
import { INVALID_REQUEST_ERROR, SERVER_ERROR } from '~/constants';

export default defineEventHandler(async event => {
	try {
		// TODO: Validate request body.
		const body = await readBody(event);
		const { boards, columns, cards } = body;

		// Create a JSON file for each board that contains their columns and cards.
		for (const boardId in boards) {
			// SCENARIO 1: Board ID does not have a corresponding directory.
			// TODO: Implement logic for new board ID.

			// SCENARIO 2: Board ID already has a corresponding directory.
			// TODO: Implement logic for existing board ID.


		}
	} catch (error) {
		setResponseStatus(event, 500);
		return { message: SERVER_ERROR, timestamp: getTimestamp() };
	}
});
