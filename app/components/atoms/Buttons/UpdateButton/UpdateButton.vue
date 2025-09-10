<script setup lang="ts">
const emit = defineEmits(['update']);

const handleUpdate = () => {
	emit('update');
};
</script>

<template>
	<UButton label="Update" color="primary" @click="handleUpdate" />
</template>