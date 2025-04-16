import { defineEventHandler, getRouterParam } from 'h3';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { BOARD_ID_REQUIRED_ERROR, NO_BOARDS_FOUND_ERROR, NO_BOARD_FOUND_ERROR, SERVER_ERROR } from '~/constants';
import { getTimestamp, parsify } from '~/utils';
import type { Board } from '~/types';

export default defineEventHandler(event => {
	try {
		const id = getRouterParam(event, 'id');
		if (!id) {
			setResponseStatus(event, 400);
			return { message: BOARD_ID_REQUIRED_ERROR, timestamp: getTimestamp() };
		}

		// check if `/data` directory exists
		const dataDirectoryPath = join(process.cwd(), '..', 'data');
		if (!existsSync(dataDirectoryPath)) {
			mkdirSync(dataDirectoryPath, { recursive: true });
			setResponseStatus(event, 404);
			return { message: NO_BOARDS_FOUND_ERROR, timestamp: getTimestamp() };
		}

		// count the number of board directories
		const boardDirectoryCount = readdirSync(dataDirectoryPath).filter(name => statSync(join(dataDirectoryPath, name)).isDirectory()).length;
		if (boardDirectoryCount === 0) {
			setResponseStatus(event, 404);
			return { message: NO_BOARDS_FOUND_ERROR, timestamp: getTimestamp() };
		}

		// use board map to find board with specified ID
		const boardMapJsonPath = join(dataDirectoryPath, 'boardMap.json');
		if (!existsSync(boardMapJsonPath)) {
			setResponseStatus(event, 404);
			return { message: NO_BOARDS_FOUND_ERROR, timestamp: getTimestamp() };
		}

		const boardMap: Record<string, string> = parsify(readFileSync(boardMapJsonPath, 'utf-8'));
		const boardDirectoryPath = boardMap[id];
		if (!boardDirectoryPath) {
			setResponseStatus(event, 404);
			return { message: NO_BOARD_FOUND_ERROR, timestamp: getTimestamp() };
		}

		const boardJsonPath = join(dataDirectoryPath, boardDirectoryPath, 'board.json');
		if (!existsSync(boardJsonPath)) {
			setResponseStatus(event, 404);
			return { message: NO_BOARD_FOUND_ERROR, timestamp: getTimestamp() };
		}

		const boardJsonContent = readFileSync(boardJsonPath, 'utf-8');
		const board: Board = parsify<Board>(boardJsonContent);

		setResponseStatus(event, 200);
		return { board, timestamp: getTimestamp() };
	} catch {
		setResponseStatus(event, 500);
		return { message: SERVER_ERROR, timestamp: getTimestamp() };
	}
});
