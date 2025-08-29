<script setup lang="ts">
import draggable from 'vuedraggable';
import { useSettingsStore, useCardsStore } from '~/stores';

const props = defineProps({
	columnId: {
		type: String,
		required: true,
	},
	cardIds: {
		type: Array as () => string[],
		required: true,
		default: []
	}
});

const settingsStore = useSettingsStore();
const cardsStore = useCardsStore();

const isCardVisible = (cardId: string) => {
	if (settingsStore.showArchivedCards) return true;
	const card = cardsStore.getCardById(cardId);
	return card && !card.archived;
};

// TODO: add better logging
const handleMoveCard = (event: any) => {
	if ('added' in event) {
		cardsStore.moveCardToColumn(event.added.element, props.columnId)
	}
	// TODO: update column and card timestamps
	//if ('moved' in event) {
	//	// DO SOMETHING
	//}
};
</script>

<template>
	<!-- Why use <ClientOnly> here? Read this: https://github.com/nuxt/nuxt/issues/31296 -->
	<!-- WTF?! This issue only happens on Firefox. -->
	<ClientOnly>
		<div class="w-full h-full flex flex-col mb-2">
			<draggable :list="cardIds" :item-key="(cardId: string) => cardId" handle=".draggable-card" group="cards"
				class="flex flex-col gap-4 mb-4" @change="handleMoveCard">
				<template #item="{ element }">
					<Card v-if="isCardVisible(element)" :cardId="element" />
				</template>
			</draggable>
			<CreateCard :columnId="columnId" />
		</div>
	</ClientOnly>
</template>