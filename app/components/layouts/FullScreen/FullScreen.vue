<script setup lang="ts">
defineProps({
	centered: {
		type: Boolean,
		default: false
	}
})

const baseStyle = 'w-screen h-screen flex flex-col space-y-2'
</script>

<template>
	<div :class="[baseStyle, centered && 'justify-center items-center']">
		<slot />
	</div>
</template>