<script setup lang="ts">
import { useTemplateRef, ref } from 'vue';
import { useColumnsStore } from '~/stores';

const props = defineProps({
	boardId: {
		type: String,
		required: true,
	}
});

const columnsStore = useColumnsStore();
const createColumnInputRef = useTemplateRef<HTMLInputElement>('createColumnInputRef');
const columnNameInput = ref('');
const isEditingColumnName = ref(false);

const handleStartEditingColumnName = () => {
	isEditingColumnName.value = true;
}

// TODO: use `valibot` to validate the name
const handleStopEditingColumnName = () => {
	try {
		const columnName = columnNameInput.value.trim();
		if (columnName.length === 0) {
			isEditingColumnName.value = false;
			return;
		}
		columnsStore.createColumn(props.boardId, { name: columnName });
		columnNameInput.value = '';
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

const baseClass = 'rounded-md flex-shrink-0 overflow-y-auto p-2 opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out';
const dimensionClass = 'w-full md:w-68 h-fit min-h-13';
const lightThemeClass = 'bg-gray-300'
const darkThemeClass = 'dark:bg-gray-800';
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<UInput ref="createColumnInputRef" v-model="columnNameInput" type="text" placeholder="Enter new column name..."
			color="secondary" icon="heroicons:plus-solid" :highlight="isEditingColumnName" class='w-full font-bold'
			size="lg" :variant="isEditingColumnName ? 'soft' : 'ghost'" @focus="handleStartEditingColumnName"
			@blur="handleStopEditingColumnName" @keydown="handleKeyDown" />
	</div>
</template>