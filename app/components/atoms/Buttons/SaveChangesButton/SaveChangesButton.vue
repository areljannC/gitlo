<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '~/stores';

const dataStore = useDataStore();
const changes = computed(() => dataStore.changes);

const isSavingChanges = ref(false);
const handleSaveChanges = async () => {
	isSavingChanges.value = true;
	try {
		await dataStore.save();
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
	<UChip v-if="changes > 0" :text="changes" size="3xl" color="warning" :class="[hoverEffectClass]">
		<UButton label="Save changes" :loading="isSavingChanges" trailing
			:color="isSavingChanges ? 'neutral' : 'primary'" size="md" :class="[buttonClass]"
			trailing-icon="heroicons:document-arrow-down-solid" @click="handleSaveChanges"
			:disabled="isSavingChanges" />
	</UChip>
</template>
