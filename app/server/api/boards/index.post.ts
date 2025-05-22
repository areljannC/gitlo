import { defineEventHandler, readBody } from 'h3';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as v from 'valibot';
import { INVALID_REQUEST_ERROR, SERVER_ERROR, CREATE_BOARD_SUCCESS } from '~/constants';
import * as createBoard from '~/schemas/createBoard';
import { generateHash, getTimestamp, stringify } from '~/shared/utils';
import { updateBoardMap } from '~/server/utils';
import type { Board, Column } from '~/types';

const createBoardSchema = v.object({
	name: createBoard.getNameValidator(),
	description: createBoard.getDescriptionValidator(),
	tags: createBoard.getTagsValidator(),
	columns: createBoard.getColumnsValidator()
});

export default defineEventHandler(async event => {
	try {
		const body = await readBody(event);
		const result = v.safeParse(createBoardSchema, body);

		if (!result.success) {
			setResponseStatus(event, 400);
			return { message: INVALID_REQUEST_ERROR, timestamp: getTimestamp() };
		}

		// create a new board
		const currentTimestamp = getTimestamp();
		const boardData = result.output;
		const board: Board = {
			id: generateHash(),
			name: boardData.name,
			description: boardData.description,
			tags: boardData.tags,
			columnIds: Array.from({ length: boardData.columns }, () => generateHash()),
			archived: false,
			createdAt: currentTimestamp,
			updatedAt: currentTimestamp
		};

		// create initial columns
		const columns: Record<string, Column> = {};
		for (const [index, columnId] of board.columnIds!.entries()) {
			columns[columnId] = {
				id: columnId,
				name: `Column ${index + 1}`,
				cardIds: [],
				archived: false,
				createdAt: currentTimestamp,
				updatedAt: currentTimestamp
			};
		}

		// get current date in `yyyymmdd` format
		const now = new Date();
		const yyyy = now.getFullYear();
		const mm = String(now.getMonth() + 1).padStart(2, '0');
		const dd = String(now.getDate()).padStart(2, '0');
		const date = `${yyyy}${mm}${dd}`;

		// set board data directory name
		const boardDirectoryName = `${date}_${generateHash()}`;

		// get path to `/data`
		const dataDirectoryPath = join(process.cwd(), '..', 'data');
		const boardDirectoryPath = join(dataDirectoryPath, boardDirectoryName);

		// create the board's directory in `/data`
		if (!existsSync(boardDirectoryPath)) {
			mkdirSync(boardDirectoryPath, { recursive: true });
		}

		// create `board.json`, `columns.json` and `cards.json`
		const boardJsonPath = join(boardDirectoryPath, 'board.json');
		const columnsJsonPath = join(boardDirectoryPath, 'columns.json');
		const cardsJsonPath = join(boardDirectoryPath, 'cards.json');

		// '\t' to use tabs for indentation
		writeFileSync(boardJsonPath, stringify(board));
		writeFileSync(columnsJsonPath, stringify(columns));
		writeFileSync(cardsJsonPath, stringify({}));

		// update board map
		updateBoardMap(board.id, boardDirectoryName);

		setResponseStatus(event, 201);
		return {
			message: CREATE_BOARD_SUCCESS,
			timestamp: getTimestamp()
		};
	} catch {
		setResponseStatus(event, 500);
		return { message: SERVER_ERROR, timestamp: getTimestamp() };
	}
});
