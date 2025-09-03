<script setup lang="ts">
import draggable from 'vuedraggable';
import { useSettingsStore, useColumnsStore } from '~/stores';

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

const settingsStore = useSettingsStore();
const columnsStore = useColumnsStore();

const isColumnVisible = (columnId: string) => {
	if (settingsStore.showArchivedColumns) return true;
	const column = columnsStore.getColumnById(columnId);
	return column && !column.archived;
};
</script>

<template>
	<ClientOnly>
		<div class="w-full h-full flex flex-col md:flex-row gap-4 overflow-x-auto px-4">
			<draggable :list="columnIds" :item-key="(columnId: string) => columnId" handle=".draggable-column"
				group="columns" class="flex flex-col md:flex-row gap-4">
				<template #item="{ element }">
					<Column v-if="isColumnVisible(element)" :columnId="element" />
				</template>
			</draggable>
			<CreateColumn :boardId="boardId" />
		</div>
	</ClientOnly>
</template>