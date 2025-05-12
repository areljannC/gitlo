<script setup lang="ts">
import { computed, useTemplateRef, ref, watch } from 'vue';
import { useColumnsStore } from '~/stores';

const props = defineProps({
	columnId: {
		type: String,
		required: true
	},
});

const columnsStore = useColumnsStore();
const column = computed(() => columnsStore.getColumnById(props.columnId)!);

const editColumnNameInputRef = useTemplateRef<HTMLInputElement>('editColumnNameInputRef');
const columnNameInput = ref(column.value.name);
const isEditingColumnName = ref(false);

watch(column, updatedColumn => {
	columnNameInput.value = updatedColumn.name
});

const handleStartEditingColumnName = () => {
	columnNameInput.value = column.value.name;
	isEditingColumnName.value = true;
}

// TODO: use `valibot` to validate the name
const handleStopEditingColumnName = () => {
	try {
		const columnName = columnNameInput.value.trim();
		columnsStore.updateColumn(props.columnId, { name: columnName });
		isEditingColumnName.value = false;
	} catch (error) {
		console.error(error);
	}
}

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		handleStopEditingColumnName();
	}
}

const baseClass = 'rounded-md flex flex-col flex-shrink-0 overflow-y-auto gap-2 p-2';
const dimensionClass = 'w-full md:w-68 h-fit min-h-13 max-h-full ';
const lightThemeClass = 'bg-gray-300';
const darkThemeClass = 'dark:bg-gray-800';
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<div class="w-full flex justify-between items-center gap-2">
			<UInput ref="editColumnNameInputRef" v-model="columnNameInput" type="text"
				placeholder="Enter column name..." color="secondary" :highlight="isEditingColumnName"
				class='w-full font-bold' size="lg" :variant="isEditingColumnName ? 'soft' : 'ghost'"
				@focus="handleStartEditingColumnName" @blur="handleStopEditingColumnName" @keydown="handleKeyDown" />
			<UIcon name="heroicons:arrows-up-down-solid"
				class="size-5 draggable-column cursor-move ml-1 mr-3 md:hidden hover:cursor-grab active:cursor-grabbing" />
			<UIcon name="heroicons:arrows-right-left-solid"
				class="size-5 draggable-column cursor-move ml-1 mr-3 hidden md:block hover:cursor-grab active:cursor-grabbing" />
		</div>
		<Cards :columnId="column.id" :cardIds="column.cardIds" />
	</div>
</template>