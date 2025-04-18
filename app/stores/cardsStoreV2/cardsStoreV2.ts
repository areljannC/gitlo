import { defineStore } from 'pinia';
import { generateHash, getTimestamp } from '~/shared/utils';
import type { Card } from '~/types';

export const useCardsStore = defineStore('cardV2', {
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
	},
	actions: {
		createCard(columnId: string): string {
			const cardId = generateHash();
			const currentTimestamp = getTimestamp();
			this.cardMap[cardId] = {
				columnId: columnId,
				id: cardId,
				title: '',
				description: '',
				archived: false,
				createdAt: currentTimestamp,
				updatedAt: currentTimestamp
			};
			return cardId;
		}
	}
});
