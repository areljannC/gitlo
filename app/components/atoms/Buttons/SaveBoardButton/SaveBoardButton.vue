<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '~/stores';

defineProps({
	boardId: {
		type: String,
		required: true
	}
});

const dataStore = useDataStore();
const isSavingBoard = ref(false);

const handleSaveBoard = async (boardId: string) => {
	isSavingBoard.value = true;
	try {
		await dataStore.saveBoard(boardId);
	} catch (error) {
		console.error('Failed to save board:', error);
	} finally {
		isSavingBoard.value = false;
	}
}

const buttonClass = 'text-lg';
</script>

<template>
	<UButton label="Save board" :loading="isSavingBoard" trailing :color="isSavingBoard ? 'neutral' : 'primary'"
		size="md" :class="[buttonClass]" trailing-icon="heroicons:document-arrow-down-solid"
		@click="handleSaveBoard(boardId)" :disabled="isSavingBoard" />
</template>