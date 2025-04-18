<script setup lang="ts">
import { useColorMode } from '#imports';

const colorMode = useColorMode();
const icon = computed(() => colorMode.value === 'light' ? 'heroicons:moon-solid' : 'heroicons:sun-solid');
const toggleTheme = () => {
	colorMode.value = colorMode.value === 'light' ? 'dark' : 'light';
}

const buttonClass = 'text-lg';
const hoverEffectClass = 'hover:shadow-md hover:-translate-y-0.25 transition-transform duration-50 ease-in-out';
</script>

<template>
	<UButton label="Toggle theme" color="secondary" size="md" :class="[buttonClass, hoverEffectClass]" :trailing-icon="icon"
		@click="toggleTheme" />
</template>