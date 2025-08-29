<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '~/stores/settingsStore/settingsStore';

const settingsStore = useSettingsStore();
const showArchivedCards = computed(() => settingsStore.showArchivedCards);
const toggleArchivedCards = () => {
	settingsStore.setShowArchivedCards(!showArchivedCards.value);
}

const buttonClass = 'text-lg';
const hoverEffectClass = 'hover:shadow-md hover:-translate-y-0.25 transition-transform duration-50 ease-in-out';
</script>

<template>
	<UButton :label="showArchivedCards ? 'Hide archived cards' : 'Show archived cards'" color="secondary" size="md"
		:class="[buttonClass, hoverEffectClass]"
		:trailing-icon="showArchivedCards ? 'heroicons:eye-slash' : 'heroicons:eye'" @click="toggleArchivedCards" />
</template>
