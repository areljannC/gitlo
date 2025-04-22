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
	},
	actions: {
		createCard(columnId: string): string {
			const cardId = generateHash();
			const currentTimestamp = getTimestamp();
			this.cardMap[cardId] = {
				columnId: columnId,
				id: cardId,
				name: '',
				description: '',
				archived: false,
				createdAt: currentTimestamp,
				updatedAt: currentTimestamp
			};
			return cardId;
		},
		createCardWithName(columnId: string, cardName: string): string {
			const cardId = generateHash();
			const currentTimestamp = getTimestamp();
			this.cardMap[cardId] = {
				columnId: columnId,
				id: cardId,
				name: cardName,
				description: '',
				archived: false,
				createdAt: currentTimestamp,
				updatedAt: currentTimestamp
			};
			return cardId;
		},
		updateCardColumnId(cardId: string, columnId: string) {
			if (this.isValidCardId(cardId)) {
				this.cardMap[cardId].columnId = columnId;
			}
		}
	}
});
