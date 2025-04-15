import { defineEventHandler } from 'h3';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { getTimestamp } from '~/utils';
import type { Board } from '~/types';

export default defineEventHandler(event => {
	const dataDirectoryPath = join(process.cwd(), '..', 'data');

	try {
		const boardsCount = readdirSync(dataDirectoryPath).filter(name => statSync(join(dataDirectoryPath, name)).isDirectory()).length;
		if (boardsCount === 0) {
			// TODO: try throwing an error instead
			setResponseStatus(event, 404);
			return { message: 'No boards found.', timestamp: getTimestamp() };
		}

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
	} catch {
		setResponseStatus(event, 404);
		return { message: 'No boards found.', timestamp: getTimestamp() };
	}
});
