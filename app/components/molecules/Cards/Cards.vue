<script setup lang="ts">
import draggable from 'vuedraggable';

defineProps({
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
</script>

<template>
	<div class="w-full h-full flex flex-col gap-4 mb-2">
		<draggable :list="cardIds" :item-key="(cardId: string) => cardId" handle=".draggable-card" group="cards"
			class="flex flex-col gap-4">
			<template #item="{ element }">
				<Card :cardId="element" />
			</template>
		</draggable>
		<CreateCard :columnId="columnId" />
	</div>
</template>
