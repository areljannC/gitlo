<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';

const isOpen = ref(false);
const handleOpenMenu = () => {
	isOpen.value = true;
}
const handleCloseMenu = () => {
	isOpen.value = false;
}

const target = useTemplateRef<HTMLElement>('target');
onClickOutside(target, () => {
	if (isOpen.value) {
		handleCloseMenu();
	}
});

const buttonClass = 'text-lg rounded-full';
const hoverEffectClass = 'hover:shadow-md hover:-translate-y-0.25 transition-transform duration-50 ease-in-out';
</script>

<template>
	<div ref="target" class="fixed bottom-8 right-8 flex flex-col gap-4 justify-end items-end">
		<UButton v-if="!isOpen" color="secondary" size="xl" :class="[buttonClass, hoverEffectClass]"
			trailing-icon="heroicons:squares-plus" @click="handleOpenMenu" />
		<ToggleThemeButton v-if="isOpen" />
		<slot v-if="isOpen" :class="[hoverEffectClass]" />
		<UButton v-if="isOpen" color="secondary" size="xl" :class="[buttonClass, hoverEffectClass]"
			trailing-icon="heroicons:x-mark-solid" @click="handleCloseMenu" />
	</div>
</template>