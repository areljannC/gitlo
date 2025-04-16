import { defineEventHandler } from 'h3';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { SERVER_ERROR } from '~/constants';
import { getTimestamp, parsify } from '~/utils';
import type { Board } from '~/types';

export default defineEventHandler(event => {
	try {
		// check if `/data` directory exists
		const dataDirectoryPath = join(process.cwd(), '..', 'data');
		if (!existsSync(dataDirectoryPath)) {
			mkdirSync(dataDirectoryPath, { recursive: true });
			setResponseStatus(event, 200);
			return { boards: [], timestamp: getTimestamp() };
		}

		// count the number of board directories
		const boardDirectoryCount = readdirSync(dataDirectoryPath).filter(name => statSync(join(dataDirectoryPath, name)).isDirectory()).length;
		if (boardDirectoryCount === 0) {
			setResponseStatus(event, 200);
			return { boards: [], timestamp: getTimestamp() };
		}

		// parse board JSON content for each board directory
		const boards: Board[] = [];
		const boardDirectoryPaths = readdirSync(dataDirectoryPath).filter(name => statSync(join(dataDirectoryPath, name)).isDirectory());
		for (const boardDirectoryPath of boardDirectoryPaths) {
			const boardJsonContent = readFileSync(join(dataDirectoryPath, boardDirectoryPath, 'board.json'), 'utf-8');
			const board: Board = parsify<Board>(boardJsonContent);
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
		setResponseStatus(event, 500);
		return { message: SERVER_ERROR, timestamp: getTimestamp() };
	}
});
