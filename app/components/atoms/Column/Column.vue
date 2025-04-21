<script setup lang="ts">
import { computed, useTemplateRef, ref } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { useColumnsStore } from '~/stores';

const props = defineProps({
	columnId: {
		type: String,
		required: true
	},
});

const columnsStore = useColumnsStore();
const column = computed(() => columnsStore.columnMap[props.columnId]);

const editColumnNameInputRef = useTemplateRef<HTMLInputElement>('editColumnNameInputRef');
const columnNameInput = ref(column.value.name);
const isEditingColumnName = ref(false);

const handleStartEditingColumnName = () => {
	columnNameInput.value = column.value.name;
	isEditingColumnName.value = true;
}

// TODO: use `valibot` to validate the name
const handleStopEditingColumnName = () => {
	const columnName = columnNameInput.value.trim();
	if (columnName !== '' && columnName.length > 0) {
		columnsStore.columnMap[props.columnId].name = columnName;
		isEditingColumnName.value = false;
	} else {
		console.warn('Invalid column name.');
	}
}

const handleTabKey = (event: KeyboardEvent) => {
	if (event.key === 'Tab') {
		handleStopEditingColumnName();
	}
}

const handleEnterKey = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		handleStopEditingColumnName();
	}
}

onClickOutside(editColumnNameInputRef, () => {
	if (!isEditingColumnName.value) return;
	handleStopEditingColumnName();
})

const baseClass = 'rounded-md flex flex-col flex-shrink-0 overflow-y-auto gap-2 p-2';
const dimensionClass = 'w-full md:w-68 h-fit min-h-13 max-h-full ';
const lightThemeClass = 'bg-gray-300'
const darkThemeClass = 'dark:bg-gray-800';
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<div class="w-full flex justify-between items-center gap-2">
			<UInput ref="editColumnNameInputRef" v-model="columnNameInput" type="text" placeholder="Enter column name..."
				color="secondary" :highlight="isEditingColumnName" class='w-full font-bold' size="lg"
				:variant="isEditingColumnName ? 'soft' : 'ghost'" @click="handleStartEditingColumnName"
				@keydown="handleTabKey" @keyup="handleEnterKey" />
			<UIcon name="heroicons:arrows-up-down-solid"
				class="size-5 draggable-column cursor-move ml-1 mr-3 md:hidden" />
			<UIcon name="heroicons:arrows-right-left-solid"
				class="size-5 draggable-column cursor-move ml-1 mr-3 hidden md:block" />
		</div>
		<Cards :columnId="column.id" :cardIds="column.cardIds" />
	</div>
</template>