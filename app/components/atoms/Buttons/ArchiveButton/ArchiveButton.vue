<script setup lang="ts">
const emit = defineEmits(['archive']);

const handleArchive = () => {
	emit('archive');
};
</script>

<template>
	<UButton label="Archive" color="secondary" variant="ghost" @click="handleArchive" />
</template>