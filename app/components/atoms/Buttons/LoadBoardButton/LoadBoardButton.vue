<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '~/stores';

const dataStore = useDataStore();
const isLoadingBoard = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const handleLoadBoard = (): void => {
	isLoadingBoard.value = true;
	fileInputRef.value?.click();
};

const handleSelectDirectory = async (event: Event): Promise<void> => {
	const files = (event.target as HTMLInputElement).files;
	if (!files || files.length === 0) {
		isLoadingBoard.value = false;
		return;
	}

	const file = files[0];
	try {
		const text = await file.text();
		const json = JSON.parse(text);
		await dataStore.loadBoard(json);
	} catch (error) {
		alert('Invalid JSON file');
	}

	isLoadingBoard.value = false;
};

const buttonClass = 'text-lg';
</script>

<template>
	<UButton label="Load board" :loading="isLoadingBoard" trailing :color="isLoadingBoard ? 'neutral' : 'primary'"
		size="md" :class="[buttonClass]" trailing-icon="heroicons:document-arrow-up-solid" @click="handleLoadBoard"
		:disabled="isLoadingBoard" />
	<input ref="fileInputRef" type="file" accept=".json" style="display: none" @change="handleSelectDirectory" />
</template>