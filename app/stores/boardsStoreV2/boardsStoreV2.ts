import { defineStore } from 'pinia';
import { useColumnsStore } from '../columnsStoreV2';
import { generateHash, getTimestamp } from '~/shared/utils';
import type { Board, NewBoard } from '~/types';

export const useBoardsStore = defineStore('Boards', {
	persist: { pick: ['boardIds', 'boardMap'] },
	state: () => ({
		boardIds: [] as string[],
		boardMap: {} as Record<string, Board>
	}),
	getters: {
		isValidBoardId:
			state =>
			(boardId: string): boolean =>
				boardId in state.boardMap,
		boardsCount: state => state.boardIds.length,
		getBoardById:
			state =>
			(boardId: string): Board | undefined =>
				state.boardMap[boardId]
	}
});
