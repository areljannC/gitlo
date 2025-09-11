<script setup lang="ts">
const emit = defineEmits(['close']);

const handleClose = () => {
	emit('close');
};
</script>

<template>
	<UButton label="Close" color="neutral" variant="ghost" @click="handleClose" />
</template>