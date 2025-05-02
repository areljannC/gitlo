import { defineStore } from 'pinia';
import { useColumnsStore, useCardsStore } from '~/stores';
import { generateHash, getTimestamp } from '~/shared/utils';
import { BoardError, ColumnError } from '~/shared/errors';
import { BOARD_ERROR, COLUMN_ERROR } from '~/constants';
import type { Board } from '~/types';

export const useBoardsStore = defineStore('boards', {
	persist: {
		pick: ['boardIds', 'boardMap']
		// TODO: use `localStorage` for cross-tab sync
		//storage: piniaPluginPeok.rsistedstate.localStorage()
	},
	state: () => ({
		boardIds: [] as string[],
		boardMap: {} as Record<string, Board>
	}),
	getters: {
		isValidBoardId:
			state =>
			(boardId: string): boolean =>
				boardId in state.boardMap,
		getBoardById:
			state =>
			(boardId: string): Board | undefined =>
				state.boardMap[boardId],
		getBoardIds: state => (): string[] => state.boardIds.filter(boardId => !state.boardMap[boardId].archived),
		getArchivedBoardIds: state => (): string[] => state.boardIds.filter(boardId => state.boardMap[boardId].archived)
	},
	actions: {
		createBoard(newBoard: Partial<Board>): string | void {
			try {
				const newBoardId = generateHash();
				if (this.isValidBoardId(newBoardId)) {
					throw new BoardError(BOARD_ERROR.ID_ALREADY_EXISTS);
				}

				const currentTimestamp = getTimestamp();
				this.boardIds.push(newBoardId);
				this.boardMap[newBoardId] = {
					id: newBoardId,
					name: newBoard.name || '',
					description: newBoard.description || '',
					tags: newBoard.tags || [],
					columnIds: [],
					archived: false,
					createdAt: currentTimestamp,
					updatedAt: currentTimestamp
				};

				const columnsStore = useColumnsStore();
				for (let i = 0; i < newBoard.columns!; i++) {
					const newColumnId = generateHash();
					if (columnsStore.isValidColumnId(newColumnId)) {
						throw new ColumnError(COLUMN_ERROR.ID_ALREADY_EXISTS);
					}

					this.boardMap[newBoardId]!.columnIds!.push(newColumnId);
					columnsStore.columnMap[newColumnId] = {
						boardId: newBoardId,
						id: newColumnId,
						name: '',
						cardIds: [],
						archived: false,
						createdAt: currentTimestamp,
						updatedAt: currentTimestamp
					};
				}

				return newBoardId;
			} catch (error) {
				console.error(BOARD_ERROR.CREATE_BOARD);
				throw error;
			}
		},
		updateBoard(boardId: string, updatedBoard: Partial<Board>): void {
			try {
				if (!this.isValidBoardId(boardId)) {
					throw new BoardError(BOARD_ERROR.ID_INVALID);
				}

				const currentTimestamp = getTimestamp();
				const oldBoard = this.boardMap[boardId];
				this.boardMap[boardId] = {
					...oldBoard,
					...updatedBoard,
					createdAt: oldBoard.createdAt,
					updatedAt: currentTimestamp
				};
			} catch (error) {
				console.error(BOARD_ERROR.UPDATE_BOARD);
				throw error;
			}
		},
		archiveBoard(boardId: string): void {
			try {
				this.updateBoard(boardId, { archived: true });
			} catch (error) {
				console.error(BOARD_ERROR.ARCHIVE_BOARD);
				throw error;
			}
		},
		unarchiveBoard(boardId: string): void {
			try {
				this.updateBoard(boardId, { archived: false });
			} catch (error) {
				console.error(BOARD_ERROR.UNARCHIVE_BOARD);
				throw error;
			}
		},
		deleteBoard(boardId: string): void {
			try {
				if (!this.isValidBoardId(boardId)) {
					throw new BoardError(BOARD_ERROR.ID_INVALID);
				}

				const columnsStore = useColumnsStore();
				const cardsStore = useCardsStore();
				const boardColumnIds = this.boardMap[boardId]!.columnIds!;
				for (const columnId of boardColumnIds) {
					const columnCardIds = columnsStore.columnMap[columnId]!.cardIds;
					for (const cardId of columnCardIds) {
						cardsStore.deleteCard(cardId);
					}
					columnsStore.deleteColumn(columnId);
				}
				this.boardIds = this.boardIds.filter(id => id !== boardId);
				delete this.boardMap[boardId];
			} catch (error) {
				console.error(BOARD_ERROR.DELETE_BOARD);
				throw error;
			}
		}
	}
});
