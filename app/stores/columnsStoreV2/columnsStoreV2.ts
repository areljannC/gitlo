import { defineStore } from 'pinia';
import { useDataStore, useBoardsStore, useCardsStore } from '~/stores';
import { generateHash, getTimestamp } from '~/shared/utils';
import { BoardError, ColumnError } from '~/shared/errors';
import { BOARD_ERROR, COLUMN_ERROR } from '~/constants';
import type { Column } from '~/types';

export const useColumnsStore = defineStore('columns', {
	persist: {
		pick: ['columnMap']
		// TODO: use `localStorage` for cross-tab sync
		//storage: piniaPluginPersistedstate.localStorage()
	},
	state: () => ({
		columnMap: {} as Record<string, Column>
	}),
	getters: {
		isValidColumnId:
			state =>
			(columnId: string): boolean =>
				columnId in state.columnMap,
		getColumnById:
			state =>
			(columnId: string): Column | undefined =>
				state.columnMap[columnId]
	},
	actions: {
		createColumn(boardId: string, newColumn?: Partial<Column>): string | void {
			try {
				const boardsStore = useBoardsStore();
				if (!boardsStore.isValidBoardId(boardId)) {
					throw new BoardError(BOARD_ERROR.ID_INVALID);
				}

				const newColumnId = generateHash();
				if (this.isValidColumnId(newColumnId)) {
					throw new ColumnError(COLUMN_ERROR.ID_ALREADY_EXISTS);
				}

				const currentTimestamp = getTimestamp();
				boardsStore.boardMap[boardId]!.columnIds!.push(newColumnId);
				boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;

				this.columnMap[newColumnId] = {
					boardId: boardId,
					id: newColumnId,
					name: newColumn?.name || '',
					cardIds: [],
					archived: false,
					createdAt: currentTimestamp,
					updatedAt: currentTimestamp
				};

				const dataStore = useDataStore();
				dataStore.recordChange();

				return newColumnId;
			} catch (error) {
				console.error(COLUMN_ERROR.CREATE_COLUMN);
				throw error;
			}
		},
		updateColumn(columnId: string, updatedColumn: Partial<Column>): void {
			try {
				if (!this.isValidColumnId(columnId)) {
					throw new ColumnError(COLUMN_ERROR.ID_INVALID);
				}

				const currentTimestamp = getTimestamp();
				const oldColumn = this.columnMap[columnId];
				this.columnMap[columnId] = {
					...oldColumn,
					...updatedColumn,
					createdAt: oldColumn.createdAt,
					updatedAt: currentTimestamp
				};

				const boardsStore = useBoardsStore();
				const boardId = this.columnMap[columnId]!.boardId;
				if (!boardsStore.isValidBoardId(boardId)) {
					throw new BoardError(BOARD_ERROR.ID_INVALID);
				}
				boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;

				const dataStore = useDataStore();
				dataStore.recordChange();
			} catch (error) {
				console.error(COLUMN_ERROR.UPDATE_COLUMN);
				throw error;
			}
		},
		archiveColumn(columnId: string): void {
			try {
				this.updateColumn(columnId, { archived: true });

				const dataStore = useDataStore();
				dataStore.recordChange();
			} catch (error) {
				console.error(COLUMN_ERROR.ARCHIVE_COLUMN);
				throw error;
			}
		},
		unarchiveColumn(columnId: string): void {
			try {
				this.updateColumn(columnId, { archived: false });

				const dataStore = useDataStore();
				dataStore.recordChange();
			} catch (error) {
				console.error(COLUMN_ERROR.UNARCHIVE_COLUMN);
				throw error;
			}
		},
		deleteColumn(columnId: string): void {
			try {
				if (!this.isValidColumnId(columnId)) {
					throw new ColumnError(COLUMN_ERROR.ID_INVALID);
				}

				const boardsStore = useBoardsStore();
				const boardId = this.columnMap[columnId]!.boardId;
				if (!boardsStore.isValidBoardId(boardId)) {
					throw new BoardError(BOARD_ERROR.ID_INVALID);
				}

				const cardsStore = useCardsStore();
				const columnCardIds = this.columnMap[columnId]!.cardIds;
				if (columnCardIds.length > 0) {
					for (const cardId of columnCardIds) {
						cardsStore.deleteCard(cardId);
					}
				}

				const board = boardsStore.boardMap[boardId];
				boardsStore.boardMap[boardId]!.columnIds = board.columnIds!.filter(id => id !== columnId);
				delete this.columnMap[columnId];

				const currentTimestamp = getTimestamp();
				boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;

				const dataStore = useDataStore();
				dataStore.recordChange();
			} catch (error) {
				console.error(COLUMN_ERROR.DELETE_COLUMN);
				throw error;
			}
		}
	}
});
