import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { parsify, stringify } from '~/shared/utils';
import { withLock } from '~/server/utils';

export const updateBoardMap = (id: string, directoryPath: string) => {
	withLock('boardMap', () => {
		const dataDirectoryPath = join(process.cwd(), '..', 'data');
		const boardMapJsonPath = join(dataDirectoryPath, 'boardMap.json');

		let boardMap: Record<string, string> = {};
		if (existsSync(boardMapJsonPath)) {
			try {
				boardMap = parsify(readFileSync(boardMapJsonPath, 'utf-8'));
			} catch {
				console.warn('Invalid `boardMap.json` format.');
			}
		}

		boardMap[id] = directoryPath;
		writeFileSync(boardMapJsonPath, stringify(boardMap));
	});
};
