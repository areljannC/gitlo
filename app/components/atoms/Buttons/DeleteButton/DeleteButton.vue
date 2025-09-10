<script setup lang="ts">
const emit = defineEmits(['delete']);

const handleDelete = () => {
	emit('delete');
};
</script>

<template>
	<UButton label="Delete" color="error" variant="soft" @click="handleDelete" />
</template>