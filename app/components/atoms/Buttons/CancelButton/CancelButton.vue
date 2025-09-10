<script setup lang="ts">
const emit = defineEmits(['cancel']);

const handleCancel = () => {
	emit('cancel');
};
</script>

<template>
	<UButton label="Cancel" color="error" variant="soft" @click="handleCancel" />
</template>