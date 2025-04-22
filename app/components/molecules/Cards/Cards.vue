<script setup lang="ts">
import draggable from 'vuedraggable';
import { moveCardToColumn } from '~/services';

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

// TODO: add better logging
const handleMoveCardToColumn = (event: any) => {
	if ('added' in event) {
		moveCardToColumn(event.added.element, props.columnId)
	}
}
</script>

<template>
	<div class="w-full h-full flex flex-col mb-2">
		<draggable :list="cardIds" :item-key="(cardId: string) => cardId" handle=".draggable-card" group="cards"
			class="flex flex-col gap-4" @change="handleMoveCardToColumn">
			<template #item="{ element }">
				<Card :cardId="element" />
			</template>
		</draggable>
		<CreateCard :columnId="columnId" />
	</div>
</template>
