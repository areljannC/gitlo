import { defineStore } from 'pinia';
import { useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
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
		async save(): Promise<void> {
			try {
				const boardsStore = useBoardsStore();
				const columnsStore = useColumnsStore();
				const cardsStore = useCardsStore();

				const body: SavePostBody = {
					boardMap: boardsStore.boardMap,
					columnMap: columnsStore.columnMap,
					cardMap: cardsStore.cardMap
				};

				await $fetch('/api/data/save', {
					body,
					method: 'POST'
				});

				this.changes = 0;
			} catch (error) {
				console.error(DATA_ERROR.SAVE);
				throw error;
			}
		},
		async load(): Promise<void> {}
	}
});
