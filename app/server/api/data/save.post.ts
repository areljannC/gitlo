import { defineEventHandler, readBody } from 'h3';
import { promises as fs } from 'fs';
import path from 'path';

import { getTimestamp } from '~/shared/utils';
import { INVALID_REQUEST_ERROR, SERVER_ERROR } from '~/constants';
import type { Board, Column, Card } from '~/types';

export default defineEventHandler(async event => {
	try {
		// TODO: Validate request body.
		const body = await readBody(event);
		const { boardMap, columnMap, cardMap } = body;

		// Default directory path for storing data.
		const storageDirectory = path.resolve(process.cwd(), '../../../../data');

		for (const boardId in boardMap) {
			const boardDirectory = path.join(storageDirectory, boardId);
			try {
				await fs.access(boardDirectory); // Throws an error if the directory does not exist.
				await updateBoardDirectory(boardDirectory, boardId, boardMap, columnMap, cardMap);
			} catch (error) {
				await createBoardDirectory(boardDirectory, boardId, boardMap, columnMap, cardMap);
			}
		}
	} catch (error) {
		setResponseStatus(event, 500);
		return { message: SERVER_ERROR, timestamp: getTimestamp() };
	}
});

const getBoardData = (boardId: string, boardMap: Partial<Record<string, Board>>, columnMap: Partial<Record<string, Column>>, cardMap: Partial<Record<string, Card>>) => {
	// Get board details.
	const board = boardMap[boardId];

	// Filter columns that belong to this board.
	const columns = Object.values(columnMap).filter((column) => column && column.boardId === boardId);

	// Filter cards that belong to these columns.
	const columnIdSet = new Set(columns.map((column) => column && column.id));
	const cards = Object.values(cardMap).filter((card) => card && columnIdSet.has(card.columnId));

	return { board, columns, cards };
};

const createBoardDirectory = async (
	boardDirectory: string,
	boardId: string,
	boardMap: Partial<Record<string, Board>>,
	columnMap: Partial<Record<string, Column>>,
	cardMap: Partial<Record<string, Card>>
): Promise<void> => {
	// TODO: Handle errors.
	const { board, columns, cards } = getBoardData(boardId, boardMap, columnMap, cardMap);

	// Create board directory.
	await fs.mkdir(boardDirectory, { recursive: true });

	// Create board file path.
	const boardFilePath = path.join(boardDirectory, `${getTimestamp()}_${boardId}.json`);

	// Write board data to file.
	await fs.writeFile(boardFilePath, JSON.stringify({ board, columns, cards }, null, '\t'), 'utf-8');
};

const updateBoardDirectory = async (
	boardDirectory: string,
	boardId: string,
	boardMap: Partial<Record<string, Board>>,
	columnMap: Partial<Record<string, Column>>,
	cardMap: Partial<Record<string, Card>>
): Promise<void> => {
	// TODO: Handle errors.
	const { board, columns, cards } = getBoardData(boardId, boardMap, columnMap, cardMap);

	// Create board file path.
	const boardFilePath = path.join(boardDirectory, `${getTimestamp()}_${boardId}.json`);

	// Write board data to file.
	await fs.writeFile(boardFilePath, JSON.stringify({ board, columns, cards }, null, '\t'), 'utf-8');
};
