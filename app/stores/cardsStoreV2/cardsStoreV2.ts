import { defineStore } from 'pinia';
import { useBoardsStore, useColumnsStore } from '~/stores';
import { generateHash, getTimestamp } from '~/shared/utils';
import { BoardError, ColumnError, CardError } from '~/shared/errors';
import { BOARD_ERROR, COLUMN_ERROR, CARD_ERROR } from '~/constants';
import type { Card } from '~/types';

export const useCardsStore = defineStore('cards', {
	persist: {
		pick: ['cardMap']
		// TODO: use `localStorage` for cross-tab sync
		//storage: piniaPluginPersistedstate.localStorage()
	},
	state: () => ({
		cardMap: {} as Record<string, Card>,
		expandedCardId: null as string | null
	}),
	getters: {
		isValidCardId:
			state =>
			(cardId: string): boolean =>
				cardId in state.cardMap,
		getCardById:
			state =>
			(columnId: string): Card | undefined =>
				state.cardMap[columnId]
	},
	actions: {
		createCard(columnId: string, newCard?: Partial<Card>): string | void {
			try {
				const columnsStore = useColumnsStore();
				if (!columnsStore.isValidColumnId(columnId)) {
					throw new ColumnError(COLUMN_ERROR.ID_INVALID);
				}

				const boardsStore = useBoardsStore();
				const boardId = columnsStore.columnMap[columnId]!.boardId;
				if (!boardsStore.isValidBoardId(boardId)) {
					throw new BoardError(BOARD_ERROR.ID_INVALID);
				}

				const newCardId = generateHash();
				if (this.isValidCardId(newCardId)) {
					throw new CardError(CARD_ERROR.ID_ALREADY_EXISTS);
				}

				const currentTimestamp = getTimestamp();
				boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;
				columnsStore.columnMap[columnId]!.updatedAt = currentTimestamp;
				columnsStore.columnMap[columnId]!.cardIds.push(newCardId);

				this.cardMap[newCardId] = {
					columnId: columnId,
					id: newCardId,
					name: newCard?.name || '',
					description: newCard?.description || '',
					archived: false,
					createdAt: currentTimestamp,
					updatedAt: currentTimestamp
				};

				return newCardId;
			} catch (error) {
				console.error(CARD_ERROR.CREATE_CARD);
				throw error;
			}
		},
		updateCard(cardId: string, updatedCard: Partial<Card>): void {
			try {
				if (!this.isValidCardId(cardId)) {
					throw new CardError(CARD_ERROR.ID_INVALID);
				}

				const columnsStore = useColumnsStore();
				const columnId = this.cardMap[cardId].columnId;
				if (!columnsStore.isValidColumnId(columnId)) {
					throw new ColumnError(COLUMN_ERROR.ID_INVALID);
				}

				const boardsStore = useBoardsStore();
				const boardId = columnsStore.columnMap[columnId]!.boardId;
				if (!boardsStore.isValidBoardId(boardId)) {
					throw new BoardError(BOARD_ERROR.ID_INVALID);
				}

				const currentTimestamp = getTimestamp();
				const oldCard = this.cardMap[cardId];
				this.cardMap[cardId] = {
					...oldCard,
					...updatedCard,
					createdAt: oldCard.createdAt,
					updatedAt: currentTimestamp
				};

				columnsStore.columnMap[columnId]!.updatedAt = currentTimestamp;
				boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;
			} catch (error) {
				console.error(CARD_ERROR.UPDATE_CARD);
				throw error;
			}
		},
		archiveCard(cardId: string): void {
			try {
				this.updateCard(cardId, { archived: true });
			} catch (error) {
				console.error(CARD_ERROR.ARCHIVE_CARD);
				throw error;
			}
		},
		unarchiveCard(cardId: string): void {
			try {
				this.updateCard(cardId, { archived: false });
			} catch (error) {
				console.error(CARD_ERROR.UNARCHIVE_CARD);
				throw error;
			}
		},
		deleteCard(cardId: string): void {
			try {
				if (!this.isValidCardId(cardId)) {
					throw new CardError(CARD_ERROR.ID_INVALID);
				}

				const columnsStore = useColumnsStore();
				const columnId = this.cardMap[cardId].columnId;
				if (!columnsStore.isValidColumnId(columnId)) {
					throw new ColumnError(COLUMN_ERROR.ID_INVALID);
				}

				const boardsStore = useBoardsStore();
				const boardId = columnsStore.columnMap[columnId]!.boardId;
				if (!boardsStore.isValidBoardId(boardId)) {
					throw new BoardError(BOARD_ERROR.ID_INVALID);
				}

				const column = columnsStore.columnMap[columnId];
				columnsStore.columnMap[columnId]!.cardIds = column.cardIds!.filter((id: string) => id !== cardId);
				delete this.cardMap[cardId];

				const currentTimestamp = getTimestamp();
				columnsStore.columnMap[columnId]!.updatedAt = currentTimestamp;
				boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;
			} catch (error) {
				console.error(CARD_ERROR.DELETE_CARD);
				throw error;
			}
		},
		moveCardToColumn(cardId: string, targetColumnId: string): void {
			try {
				if (!this.isValidCardId(cardId)) {
					throw new CardError(CARD_ERROR.ID_INVALID);
				}

				const columnsStore = useColumnsStore();
				const currentColumnId = this.cardMap[cardId].columnId;
				if (!columnsStore.isValidColumnId(currentColumnId) || !columnsStore.isValidColumnId(targetColumnId)) {
					throw new ColumnError(COLUMN_ERROR.ID_INVALID);
				}

				const boardsStore = useBoardsStore();
				const oldColumnBoardId = columnsStore.columnMap[currentColumnId]!.boardId;
				const newColumnBoardId = columnsStore.columnMap[targetColumnId]!.boardId;
				if (!boardsStore.isValidBoardId(oldColumnBoardId) || !boardsStore.isValidBoardId(newColumnBoardId)) {
					throw new BoardError(BOARD_ERROR.ID_INVALID);
				}

				const currentTimestamp = getTimestamp();

				// remove card from old column if it exists
				if (columnsStore.columnMap[currentColumnId]!.cardIds!.includes(cardId)) {
					columnsStore.columnMap[currentColumnId]!.cardIds = columnsStore.columnMap[currentColumnId]!.cardIds.filter((id: string) => id !== cardId);
				}

				// moved card to new column if it has not been moved already
				if (!columnsStore.columnMap[targetColumnId]!.cardIds!.includes(cardId)) {
					columnsStore.columnMap[targetColumnId]!.cardIds.push(cardId);
				}

				// update card's column ID
				this.cardMap[cardId].columnId = targetColumnId;

				// update timestamps
				boardsStore.boardMap[oldColumnBoardId]!.updatedAt = currentTimestamp;
				boardsStore.boardMap[newColumnBoardId]!.updatedAt = currentTimestamp;
				columnsStore.columnMap[currentColumnId]!.updatedAt = currentTimestamp;
				columnsStore.columnMap[targetColumnId]!.updatedAt = currentTimestamp;
				this.cardMap[cardId].updatedAt = currentTimestamp;
			} catch (error) {
				console.error(CARD_ERROR.MOVE_CARD);
				throw error;
			}
		},
		expandCard(cardId: string): void {
			try {
				if (!this.isValidCardId(cardId)) {
					throw new CardError(CARD_ERROR.ID_INVALID);
				}
				this.expandedCardId = cardId;
			} catch (error) {
				console.error(CARD_ERROR.EXPAND_CARD);
				throw error;
			}
		},
		collapseCard(): void {
			try {
				this.expandedCardId = null;
			} catch (error) {
				console.error(CARD_ERROR.COLLAPSE_CARD);
				throw error;
			}
		}
	}
});
