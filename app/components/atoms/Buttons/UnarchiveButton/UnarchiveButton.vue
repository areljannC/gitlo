<script setup lang="ts">
const emit = defineEmits(['unarchive']);

const handleUnarchive = () => {
	emit('unarchive');
};
</script>

<template>
	<UButton label="Unarchive" color="secondary" variant="ghost" @click="handleUnarchive" />
</template>