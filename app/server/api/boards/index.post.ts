import { defineEventHandler, readBody } from 'h3';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as v from 'valibot';
import { generateHash, getTimestamp } from '~/utils';
import type { Board, Column } from '~/types';

const createBoardSchema = v.object({
	name: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty('Board name is required.'),
		v.minLength(4, 'Board name must be longer than 4 characters.'),
		v.maxLength(32, 'Board name must be shorter than 32 characters.')
	),
	description: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(64, 'Board description must be shorter than 64 characters.'))),
	tags: v.optional(v.array(v.pipe(v.string(), v.trim(), v.minLength(2, 'Tag must be longer than 2 characters.'), v.maxLength(16, 'Tag must be shorter than 16 characters.')))),
	columns: v.pipe(v.number(), v.minValue(1, 'There must be at least 1 column.'), v.maxValue(16, 'There can only be up to 16 columns.'))
});

export default defineEventHandler(async event => {
	const body = await readBody(event);
	const result = v.safeParse(createBoardSchema, body);

	// TODO: return schema error messages
	if (!result.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Validation failed.'
		});
	}

	// TODO: wrap this in a try-catch
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
	writeFileSync(boardJsonPath, JSON.stringify(board, null, '\t'));
	writeFileSync(columnsJsonPath, JSON.stringify(columns, null, '\t'));
	writeFileSync(cardsJsonPath, JSON.stringify({}, null, '\t'));

	setResponseStatus(event, 201);
	return {
		message: 'Board created successfully!',
		timestamp: getTimestamp()
	};
});
