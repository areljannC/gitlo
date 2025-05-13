<script setup lang="ts">
import { computed, ref } from 'vue';
import { useBoardsStore } from '~/stores';

const boardsStore = useBoardsStore();
const boardsCount = computed(() => boardsStore.boardIds.length);

const isSavingChanges = ref(false);
const handleSaveChanges = async () => {
	isSavingChanges.value = true;
	try {
		//boardsStore.syncUnsyncedBoards(); // Uncomment if needed for actual logic
	} catch (error) {
		console.error('Failed to save changes:', error);
	} finally {
		isSavingChanges.value = false;
	}
};

const buttonClass = 'text-lg';
const hoverEffectClass = 'hover:shadow-md hover:-translate-y-0.25 transition-transform duration-50 ease-in-out';
</script>

<template>
	<UButton v-if="boardsCount > 0" label="TODO: Save changes" :loading="isSavingChanges" trailing :color="isSavingChanges ? 'neutral' : 'primary'"
		size="md" :class="[buttonClass, hoverEffectClass]" trailing-icon="heroicons:document-arrow-down-solid"
		@click="handleSaveChanges" :disabled="isSavingChanges" />
</template>
