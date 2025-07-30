import { defineStore } from 'pinia';
import { useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
import { getTimestamp } from '~/shared/utils';
import { DATA_ERROR } from '~/constants';
import type { SavePostBody } from '~/types';

export const useDataStore = defineStore('data', {
	persist: {
		pick: ['changes']
	},
	state: () => ({
		// TODO: Actually track the changes with in an array instead of using a counter.
		// NOTE: This is a temporary solution until we implement a proper change tracking system.
		changes: 0 as number
	}),
	actions: {
		recordChange(): void {
			this.changes++;
		},
		async saveBoard(boardId: string): Promise<void> {
			try {
				const boardsStore = useBoardsStore();
				const columnsStore = useColumnsStore();
				const cardsStore = useCardsStore();

				// Get board details.
				const board = boardsStore.boardMap[boardId];

				// Filter columns that belong to this board.
				const columns = Object.values(columnsStore.columnMap).filter(column => column && column.boardId === boardId);

				// Filter cards that belong to these columns.
				const columnIdSet = new Set(columns.map(column => column && column.id));
				const cards = Object.values(cardsStore.cardMap).filter(card => card && columnIdSet.has(card.columnId));

				// Create a JSON blob and trigger a download.
				const jsonBlob = new Blob([JSON.stringify({ board, columns, cards }, null, '\t')], { type: 'application/json' });
				const url = URL.createObjectURL(jsonBlob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `${getTimestamp().replace(/[:.]/g, '-')}_${boardId}.json`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			} catch (error) {
				console.error(DATA_ERROR.SAVE(boardId));
				throw error;
			}
		},
		async loadBoard(json: any): Promise<void> {
			const boardsStore = useBoardsStore();
			const columnsStore = useColumnsStore();
			const cardsStore = useCardsStore();

			// Load board data.
			boardsStore.$patch({
				boardIds: [...boardsStore.boardIds, json.board.id],
				boardMap: {
					...boardsStore.boardMap,
					[json.board.id]: json.board
				}
			});

			// Load board columns.
			columnsStore.$patch({
				columnMap: {
					...columnsStore.columnMap,
					...Object.fromEntries(json.columns.map((column: any) => [column.id, column]))
				}
			});

			// Load board cards.
			cardsStore.$patch({
				cardMap: {
					...cardsStore.cardMap,
					...Object.fromEntries(json.cards.map((card: any) => [card.id, card]))
				}
			});
		}
	}
});
