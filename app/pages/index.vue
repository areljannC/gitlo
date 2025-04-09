<script setup lang="ts">
const goToBoard = () => {
	navigateTo('/boards');
};
</script>

<template>
	<FullScreen centered>
		<h1 class="text-lg font-bold" id="title">gitlo</h1>
		<button @click="goToBoard" class="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">View
			Boards</button>
	</FullScreen>
</template>
