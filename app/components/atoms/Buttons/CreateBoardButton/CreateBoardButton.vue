<script setup lang="ts">
const emit = defineEmits(['click']);
const handleClick = () => {
	emit('click');
};

const buttonClass = 'text-lg';
const hoverEffectClass = 'hover:shadow-md hover:-translate-y-0.25 transition-transform duration-50 ease-in-out';
</script>

<template>
	<UButton label="Create a board" color="secondary" size="md" :class="[buttonClass, hoverEffectClass]"
		trailing-icon="heroicons:plus-solid" @click="handleClick" />
</template>