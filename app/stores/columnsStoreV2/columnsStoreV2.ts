import { defineStore } from 'pinia';
import { generateHash, getTimestamp } from '~/shared/utils';
import type { Column } from '~/types';

export const useColumnsStore = defineStore('columnsV2', {
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
	},
	actions: {
		createColumn(boardId: string): string {
			const columnId = generateHash();
			const currentTimestamp = getTimestamp();
			this.columnMap[columnId] = {
				boardId: boardId,
				id: columnId,
				name: '',
				cardIds: [],
				archived: false,
				createdAt: currentTimestamp,
				updatedAt: currentTimestamp
			};
			return columnId;
		}
	}
});
