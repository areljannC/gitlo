import { defineEventHandler } from 'h3';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { getTimestamp } from '~/utils';
import type { Board } from '~/types';

export const NO_BOARDS_FOUND = 'No boards found.';

export default defineEventHandler(event => {
	try {
		// check if `/data` exists
		const dataDirectoryPath = join(process.cwd(), '..', 'data');
		if (!existsSync(dataDirectoryPath)) {
			mkdirSync(dataDirectoryPath, { recursive: true });
			setResponseStatus(event, 404);
			return { message: NO_BOARDS_FOUND, timestamp: getTimestamp() };
		}

		// count the number of board directories
		const boardDirectoryCount = readdirSync(dataDirectoryPath).filter(name => statSync(join(dataDirectoryPath, name)).isDirectory()).length;
		if (boardDirectoryCount === 0) {
			setResponseStatus(event, 404);
			return { message: NO_BOARDS_FOUND, timestamp: getTimestamp() };
		}

		// parse board JSON content for each directory
		const boards: Board[] = [];
		const boardDirectoryPaths = readdirSync(dataDirectoryPath).filter(name => statSync(join(dataDirectoryPath, name)).isDirectory());
		for (const boardDirectoryPath of boardDirectoryPaths) {
			const boardJsonContent = readFileSync(join(dataDirectoryPath, boardDirectoryPath, 'board.json'), 'utf-8');
			const board: Board = JSON.parse(boardJsonContent);
			boards.push({
				id: board.id,
				name: board.name,
				description: board.description,
				tags: board.tags,
				archived: board.archived,
				createdAt: board.createdAt,
				updatedAt: board.updatedAt
			});
		}

		return { boards, timestamp: getTimestamp() };
	} catch (error) {
		setResponseStatus(event, 404);
		return { message: NO_BOARDS_FOUND, timestamp: getTimestamp() };
	}
});
