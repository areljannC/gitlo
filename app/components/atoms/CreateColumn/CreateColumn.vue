<script setup lang="ts">
import { useTemplateRef, ref } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { createColumnWithName } from '~/services';

const props = defineProps({
	boardId: {
		type: String,
		required: true,
	}
});

const createColumnInputRef = useTemplateRef<HTMLInputElement>('createColumnInputRef');
const columnNameInput = ref('');
const isEditingColumnName = ref(false);

const handleStartEditingColumnName = () => {
	columnNameInput.value = '';
	isEditingColumnName.value = true;
}

// TODO: use `valibot` to validate the name
const handleStopEditingColumnName = () => {
	const columnName = columnNameInput.value.trim();
	if (columnName !== '' && columnName.length > 0) {
		createColumnWithName(props.boardId, columnName);
		columnNameInput.value = '';
		isEditingColumnName.value = false;
	} else {
		console.warn('Invalid column name.');
	}
}

const handleKeyUp = (event: KeyboardEvent) => {
	event.preventDefault();
	if (event.key !== 'Enter') return;
	handleStopEditingColumnName();
}

onClickOutside(createColumnInputRef, () => {
	if (!isEditingColumnName.value) return;
	handleStopEditingColumnName();
})

const baseClass = 'rounded-md flex-shrink-0 overflow-y-auto p-2 opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out';
const dimensionClass = 'w-full md:w-68 h-fit min-h-13';
const lightThemeClass = 'bg-gray-300'
const darkThemeClass = 'dark:bg-gray-800';
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<UInput ref="createColumnInputRef" v-model="columnNameInput" type="text" placeholder="Enter new column name..."
			color="secondary" icon="heroicons:plus-solid" :highlight="isEditingColumnName" class='w-full font-bold'
			size="lg" :variant="isEditingColumnName ? 'soft' : 'ghost'" @click="handleStartEditingColumnName"
			@keyup="handleKeyUp" />
	</div>
</template>