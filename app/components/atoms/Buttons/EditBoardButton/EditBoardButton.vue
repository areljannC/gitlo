<script setup lang="ts">
const emit = defineEmits(['edit']);
const handleEdit = () => {
	emit('edit');
};

const buttonClass = 'text-lg';
const hoverEffectClass = 'hover:shadow-md hover:-translate-y-0.25 transition-transform duration-50 ease-in-out';
</script>

<template>
	<UButton label="Edit board" color="secondary" size="md" :class="[buttonClass, hoverEffectClass]"
		trailing-icon="heroicons:pencil-solid" @click="handleEdit" />
</template>