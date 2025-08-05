<script setup lang="ts">
import draggable from 'vuedraggable';

defineProps({
	boardId: {
		type: String,
		required: true,
	},
	columnIds: {
		type: Array as () => string[],
		required: true,
		default: []
	},
});
</script>

<template>
	<ClientOnly>
		<div class="w-full h-full flex flex-col md:flex-row gap-4 overflow-x-auto px-4">
			<draggable :list="columnIds" :item-key="(columnId: string) => columnId" handle=".draggable-column"
				group="columns" class="flex flex-col md:flex-row gap-4">
				<template #item="{ element }">
					<Column :columnId="element" />
				</template>
			</draggable>
			<CreateColumn :boardId="boardId" />
		</div>
	</ClientOnly>
</template>