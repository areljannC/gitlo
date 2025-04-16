import { defineEventHandler, getRouterParam } from 'h3';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { BOARD_ID_REQUIRED_ERROR, NO_BOARDS_FOUND_ERROR, NO_BOARD_FOUND_ERROR, INCOMPLETE_BOARD_DATA_ERROR, SERVER_ERROR } from '~/constants';
import { getTimestamp, parsify } from '~/utils';
import type { Board, Column, Card } from '~/types';

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

		// check if the board directory path exists
		const boardMap: Record<string, string> = parsify(readFileSync(boardMapJsonPath, 'utf-8'));
		const boardDirectoryPath = boardMap[id];
		if (!boardDirectoryPath) {
			setResponseStatus(event, 404);
			return { message: NO_BOARD_FOUND_ERROR, timestamp: getTimestamp() };
		}

		// get the path to the board's `board.json` file
		const boardJsonPath = join(dataDirectoryPath, boardDirectoryPath, 'board.json');
		if (!existsSync(boardJsonPath)) {
			setResponseStatus(event, 404);
			return { message: NO_BOARD_FOUND_ERROR, timestamp: getTimestamp() };
		}

		// get the path to the board's `columns.json`
		const columnsJsonPath = join(dataDirectoryPath, boardDirectoryPath, 'columns.json');
		if (!existsSync(columnsJsonPath)) {
			setResponseStatus(event, 404);
			return { message: INCOMPLETE_BOARD_DATA_ERROR, timestamp: getTimestamp() };
		}

		// get the path to the board's `cards.json`
		const cardsJsonPath = join(dataDirectoryPath, boardDirectoryPath, 'cards.json');
		if (!existsSync(cardsJsonPath)) {
			setResponseStatus(event, 404);
			return { message: INCOMPLETE_BOARD_DATA_ERROR, timestamp: getTimestamp() };
		}

		// read and parse the JSON files
		const boardJsonContent = readFileSync(boardJsonPath, 'utf-8');
		const columnsJsonContent = readFileSync(columnsJsonPath, 'utf-8');
		const cardsJsonContent = readFileSync(cardsJsonPath, 'utf-8');
		const board: Board = parsify<Board>(boardJsonContent);
		const columns = parsify<Column[]>(columnsJsonContent);
		const cards = parsify<Card[]>(cardsJsonContent);

		setResponseStatus(event, 200);
		return { board, columns, cards, timestamp: getTimestamp() };
	} catch {
		setResponseStatus(event, 500);
		return { message: SERVER_ERROR, timestamp: getTimestamp() };
	}
});
