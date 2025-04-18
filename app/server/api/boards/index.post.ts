import { defineEventHandler, readBody } from 'h3';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as v from 'valibot';
import { INVALID_REQUEST_ERROR, SERVER_ERROR, CREATE_BOARD_SUCCESS } from '~/constants';
import * as createBoard from '~/schemas/createBoard';
import { generateHash, getTimestamp, stringify } from '~/shared/utils';
import { updateBoardMap } from '~/server/utils';
import type { Board, Column } from '~/types';

const isNewBoard = (boardId: string) => boardId.startsWith('__');

export default defineEventHandler(async event => {
	try {
		const body = await readBody(event);
		// TODO: validate request body
		//const result = v.safeParse(createBoardSchema, body);
		//if (!result.success) {
		//	setResponseStatus(event, 400);
		//	return { message: INVALID_REQUEST_ERROR, timestamp: getTimestamp() };
		//}

		// check if unsynced board is a new board
		//if (isn)
	} catch {
		setResponseStatus(event, 500);
		return { message: SERVER_ERROR, timestamp: getTimestamp() };
	}
});
