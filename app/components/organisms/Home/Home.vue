<script setup lang="ts">
const handleGoToBoards = () => {
	navigateTo('/boards');
};
</script>

<template>
	<UContainer class="w-screen h-screen flex flex-col justify-center items-center space-y-4">
		<h1 class="font-bold text-3xl">gitlo</h1>
		<UButton label="View Boards" color='secondary' @click="handleGoToBoards" class="text-lg" />
	</UContainer>
</template>