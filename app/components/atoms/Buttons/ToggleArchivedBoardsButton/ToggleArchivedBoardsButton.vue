<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '~/stores';

const settingsStore = useSettingsStore();
const showArchivedBoards = computed(() => settingsStore.showArchivedBoards);
const toggleArchivedBoards = () => {
	settingsStore.setShowArchivedBoards(!showArchivedBoards.value);
};

const buttonClass = 'text-lg';
const hoverEffectClass = 'hover:shadow-md hover:-translate-y-0.25 transition-transform duration-50 ease-in-out';
</script>

<template>
	<UButton :label="showArchivedBoards ? 'Hide archived boards' : 'Show archived boards'" color="secondary" size="md"
		:class="[buttonClass, hoverEffectClass]"
		:trailing-icon="showArchivedBoards ? 'heroicons:eye-slash' : 'heroicons:eye'" @click="toggleArchivedBoards" />
</template>
