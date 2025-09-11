<script setup lang="ts">
const emit = defineEmits(['edit']);

const handleEdit = () => {
	emit('edit');
};
</script>

<template>
	<UButton label="Edit" color="secondary" @click="handleEdit" />
</template>