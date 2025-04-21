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

const nonDraggableColumnId = 'sdfsdf';

//function onMove(event: { relatedContext: any; draggedContext: any }) {
//	const draggedId = event.draggedContext.element;
//	const relatedId = event.relatedContext.element;

//	// Prevent dragging if the dragged or related item is the non-draggable column
//	if (draggedId === nonDraggableColumnId || relatedId === nonDraggableColumnId) {
//		return false;
//	}
//	return true;
//}


</script>

<template>
	<div class="w-full h-full flex flex-col md:flex-row gap-4 overflow-x-auto px-4">
		<draggable :list="columnIds" :item-key="(columnId: string) => columnId" handle=".draggable-column" class="flex flex-col md:flex-row gap-4">
			<template #item="{ element }">
				<Column :columnId="element" />
			</template>
		</draggable>
		<CreateColumn :boardId="boardId" />
	</div>
</template>