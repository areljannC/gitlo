import { defineStore } from 'pinia';
import { generateHash, getTimestamp } from '~/shared/utils';
import type { Card } from '~/types';

export const useCardsStore = defineStore('Cards', {
	persist: { pick: ['cardMap'] },
	state: () => ({
		cardMap: {} as Record<string, Card>
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
	}
});
