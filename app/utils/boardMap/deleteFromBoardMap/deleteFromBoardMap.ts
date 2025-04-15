import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { withLock } from '~/utils';

export const deleteFromBoardMap = (id: string) => {
	withLock('boardMap', () => {
		const dataDirectoryPath = join(process.cwd(), '..', 'data');
		const boardMapJsonPath = join(dataDirectoryPath, 'boardMap.json');
		if (!existsSync(boardMapJsonPath)) return;

		let boardMap: Record<string, string> = {};
		if (existsSync(boardMapJsonPath)) {
			try {
				boardMap = JSON.parse(readFileSync(boardMapJsonPath, 'utf-8'));
			} catch {
				console.warn('Invalid `boardMap.json` format... skipping deletion.');
			}
		}

		if (boardMap[id]) {
			delete boardMap[id];
			writeFileSync(boardMapJsonPath, JSON.stringify(boardMap));
		}
	});
};
