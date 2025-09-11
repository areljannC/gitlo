<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '~/stores';

const settingsStore = useSettingsStore();
const showArchivedColumns = computed(() => settingsStore.showArchivedColumns);
const toggleArchivedColumns = () => {
	settingsStore.setShowArchivedColumns(!showArchivedColumns.value);
};

const buttonClass = 'text-lg';
const hoverEffectClass = 'hover:shadow-md hover:-translate-y-0.25 transition-transform duration-50 ease-in-out';
</script>

<template>
	<UButton :label="showArchivedColumns ? 'Hide archived columns' : 'Show archived columns'" color="secondary"
		size="md" :class="[buttonClass, hoverEffectClass]"
		:trailing-icon="showArchivedColumns ? 'heroicons:eye-slash' : 'heroicons:eye'" @click="toggleArchivedColumns" />
</template>
