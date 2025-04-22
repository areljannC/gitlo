import { defineStore } from 'pinia';
import type { Column } from '~/types';

export const useColumnsStore = defineStore('Columns', {
	persist: { pick: ['columnMap'] },
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
	}
});
