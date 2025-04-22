import { useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
import { generateHash, getTimestamp } from '~/shared/utils';
import type { Board, NewBoard, Column, Card } from '~/types';

// boards
export const createBoard = (newBoard: NewBoard): string | void => {
	try {
		const boardsStore = useBoardsStore();
		const columnsStore = useColumnsStore();
		const currentTimestamp = getTimestamp();
		const newBoardId = generateHash();

		boardsStore.boardIds.push(newBoardId);
		boardsStore.boardMap[newBoardId] = {
			id: newBoardId,
			name: newBoard.name,
			description: newBoard.description,
			tags: newBoard.tags,
			columnIds: [],
			//columnIds: Array.from({ length: newBoard.columns }, () => columnsStore.createColumn(newBoardId)),
			archived: false,
			createdAt: currentTimestamp,
			updatedAt: currentTimestamp
		};

		for (let i = 0; i < newBoard.columns; i++) {
			const newColumnId = generateHash();
			boardsStore.boardMap[newBoardId]!.columnIds!.push(newColumnId);
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
	} catch {
		console.error('Error creating a new board.');
	}
};

// columns
export const createColumn = (boardId: string): string | void => {
	try {
		const boardsStore = useBoardsStore();
		const columnsStore = useColumnsStore();
		const currentTimestamp = getTimestamp();
		const newColumnId = generateHash();

		boardsStore.boardMap[boardId]!.columnIds!.push(newColumnId);
		boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;

		columnsStore.columnMap[newColumnId] = {
			boardId: boardId,
			id: newColumnId,
			name: '',
			cardIds: [],
			archived: false,
			createdAt: currentTimestamp,
			updatedAt: currentTimestamp
		};

		return newColumnId;
	} catch {
		console.error('Error creating a new column.');
	}
};

export const createColumnWithName = (boardId: string, columnName: string): string | void => {
	try {
		const boardsStore = useBoardsStore();
		const columnsStore = useColumnsStore();
		const currentTimestamp = getTimestamp();
		const newColumnId = generateHash();

		boardsStore.boardMap[boardId]!.columnIds!.push(newColumnId);
		boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;

		columnsStore.columnMap[newColumnId] = {
			boardId: boardId,
			id: newColumnId,
			name: columnName,
			cardIds: [],
			archived: false,
			createdAt: currentTimestamp,
			updatedAt: currentTimestamp
		};

		return newColumnId;
	} catch {
		console.error('Error creating a new column.');
	}
};

export const updateColumn = (columnId: string, updatedColumn: Partial<Column>): void => {
	try {
		const columnsStore = useColumnsStore();
		const currentTimestamp = getTimestamp();

		if (columnsStore.isValidColumnId(columnId)) {
			const oldColumn = columnsStore.columnMap[columnId];
			columnsStore.columnMap[columnId] = {
				...oldColumn,
				...updatedColumn,
				updatedAt: currentTimestamp
			};

			// update the board's `updatedAt` timestamp
			const boardsStore = useBoardsStore();
			const boardId = columnsStore.columnMap[columnId]!.boardId;
			if (boardsStore.isValidBoardId(boardId)) {
				boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;
			}
		}
	} catch {
		console.error('Error updating column.');
	}
};

// cards
export const createCard = (columnId: string): string | void => {
	try {
		const boardsStore = useBoardsStore();
		const columnsStore = useColumnsStore();
		const cardsStore = useCardsStore();
		const currentTimestamp = getTimestamp();
		const newCardId = generateHash();

		boardsStore.boardMap[columnsStore.columnMap[columnId]!.boardId]!.updatedAt = currentTimestamp;
		columnsStore.columnMap[columnId]!.cardIds.push(newCardId);
		columnsStore.columnMap[columnId]!.updatedAt = currentTimestamp;

		cardsStore.cardMap[newCardId] = {
			columnId: columnId,
			id: newCardId,
			name: '',
			description: '',
			archived: false,
			createdAt: currentTimestamp,
			updatedAt: currentTimestamp
		};

		return newCardId;
	} catch {
		console.error('Error creating a new card.');
	}
};

export const createCardWithName = (columnId: string, cardName: string): string | void => {
	try {
		const boardsStore = useBoardsStore();
		const columnsStore = useColumnsStore();
		const cardsStore = useCardsStore();
		const currentTimestamp = getTimestamp();
		const newCardId = generateHash();

		boardsStore.boardMap[columnsStore.columnMap[columnId]!.boardId]!.updatedAt = currentTimestamp;
		columnsStore.columnMap[columnId]!.cardIds.push(newCardId);
		columnsStore.columnMap[columnId]!.updatedAt = currentTimestamp;

		cardsStore.cardMap[newCardId] = {
			columnId: columnId,
			id: newCardId,
			name: cardName,
			description: '',
			archived: false,
			createdAt: currentTimestamp,
			updatedAt: currentTimestamp
		};

		return newCardId;
	} catch {
		console.error('Error creating a new card.');
	}
};

export const updateCard = (cardId: string, updatedCard: Partial<Card>): void => {
	try {
		const cardsStore = useCardsStore();
		const currentTimestamp = getTimestamp();

		if (cardsStore.isValidCardId(cardId)) {
			const oldCard = cardsStore.cardMap[cardId];
			cardsStore.cardMap[cardId] = {
				...oldCard,
				...updatedCard,
				updatedAt: currentTimestamp
			};

			// update the column's `updatedAt` timestamp
			const columnsStore = useColumnsStore();
			const columnId = cardsStore.cardMap[cardId].columnId;
			if (columnsStore.isValidColumnId(columnId)) {
				columnsStore.columnMap[columnId]!.updatedAt = currentTimestamp;
			}

			// update the board's `updatedAt` timestamp
			const boardsStore = useBoardsStore();
			const boardId = columnsStore.columnMap[columnId]!.boardId;
			if (boardsStore.isValidBoardId(boardId)) {
				boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;
			}
		}
	} catch {
		console.error('Error updating card.');
	}
};

export const moveCardToColumn = (cardId: string, newColumnId: string): void => {
	try {
		const boardsStore = useBoardsStore();
		const columnsStore = useColumnsStore();
		const cardsStore = useCardsStore();
		const currentTimestamp = getTimestamp();
		const oldColumnId = cardsStore.cardMap[cardId].columnId;

		if (columnsStore.isValidColumnId(oldColumnId) && columnsStore.isValidColumnId(newColumnId) && cardsStore.isValidCardId(cardId)) {
			// remove card from old column if it exists
			if (columnsStore.columnMap[oldColumnId]!.cardIds!.includes(cardId)) {
				columnsStore.columnMap[oldColumnId]!.cardIds = columnsStore.columnMap[oldColumnId]!.cardIds.filter((id: string) => id !== cardId);
				columnsStore.columnMap[oldColumnId]!.updatedAt = currentTimestamp;
			}

			// move card to new column if it has not been moved already
			if (!columnsStore.columnMap[newColumnId]!.cardIds!.includes(cardId)) {
				columnsStore.columnMap[newColumnId]!.cardIds.push(cardId);
				columnsStore.columnMap[newColumnId]!.updatedAt = currentTimestamp;
			}

			// update card's column ID
			cardsStore.cardMap[cardId].columnId = newColumnId;

			// update timestamps
			let boardId = columnsStore.columnMap[oldColumnId]!.boardId;
			columnsStore.columnMap[oldColumnId]!.updatedAt = currentTimestamp;
			boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;

			boardId = columnsStore.columnMap[newColumnId]!.boardId;
			columnsStore.columnMap[newColumnId]!.updatedAt = currentTimestamp;
			boardsStore.boardMap[boardId]!.updatedAt = currentTimestamp;

			cardsStore.cardMap[cardId].updatedAt = currentTimestamp;
		}
	} catch {
		console.error('Error moving card to column.');
	}
};
