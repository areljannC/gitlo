<script setup lang="ts">
import draggable from 'vuedraggable';
import { useCardsStore } from '~/stores';

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
})

const cardsStore = useCardsStore();

// TODO: add better logging
const handleMoveCard = (event: any) => {
	if ('added' in event) {
		cardsStore.moveCardToColumn(event.added.element, props.columnId)
	}
	// TODO: update column and card timestamps
	//if ('moved' in event) {
	//	// DO SOMETHING
	//}
}
</script>

<template>
	<div class="w-full h-full flex flex-col mb-2">
		<draggable :list="cardIds" :item-key="(cardId: string) => cardId" handle=".draggable-card" group="cards"
			class="flex flex-col gap-4 mb-4" @change="handleMoveCard">
			<template #item="{ element }">
				<Card :cardId="element" />
			</template>
		</draggable>
		<CreateCard :columnId="columnId" />
	</div>
</template>