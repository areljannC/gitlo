<script setup lang="ts">
import { useHead, navigateTo } from '#app';

useHead({ title: 'gitlo.app' });

const handleGoToBoards = () => {
	navigateTo('/boards');
};
</script>

<template>
	<UContainer class="w-screen h-screen flex flex-col justify-center items-center space-y-4">
		<h1 class="font-bold text-3xl">gitlo.app</h1>
		<UButton label="View Boards" color='secondary' @click="handleGoToBoards" class="text-lg" />
	</UContainer>
</template>