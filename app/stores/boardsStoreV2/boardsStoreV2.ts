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
	},
	actions: {
		createBoard(newBoard: NewBoard): string {
			const boardId = generateHash();
			const currentTimestamp = getTimestamp();
			const columnsStore = useColumnsStore();
			this.boardIds.push(boardId);
			this.boardMap[boardId] = {
				id: boardId,
				name: newBoard.name,
				description: newBoard.description,
				tags: newBoard.tags,
				columnIds: Array.from({ length: newBoard.columns }, () => columnsStore.createColumn(boardId)),
				archived: false,
				createdAt: currentTimestamp,
				updatedAt: currentTimestamp
			};
			return boardId
		}
	}
});
