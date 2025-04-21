<script setup lang="ts">
import { computed } from 'vue';
import { useBoardsStore } from '~/stores';

const boardsStore = useBoardsStore();
const route = useRoute();

const boardId = route.params.id as string;
if (!boardsStore.isValidBoardId(route.params.id as string)) {
	navigateTo('/boards')
}

const board = computed(() => boardsStore.boardMap[boardId]);
</script>

<template>
	<div class="w-screen h-screen flex flex-col items-center gap-4">
		<h1 class="font-bold text-3xl">{{ board?.name }}</h1>
		<Columns :boardId="board.id" :columnIds="board.columnIds" />
	</div>

	<!-- action menu -->
	<ActionMenu />
</template>
