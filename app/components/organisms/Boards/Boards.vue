<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useSettingsStore, useBoardsStore } from '~/stores';
import type { Board } from '~/types';

const settingsStore = useSettingsStore();
const boardsStore = useBoardsStore();
const boardMap = computed(() => boardsStore.boardMap);
const boardIds = computed(() => boardsStore.getBoardIds());
const archivedBoardIds = computed(() => boardsStore.getArchivedBoardIds());
const visibleBoardIds = computed(() => settingsStore.showArchivedBoards
	? [...boardIds.value, ...archivedBoardIds.value]
	: boardIds.value
);

const isCreateBoardModalOpen = ref(false);

const handleOpenCreateBoardModal = () => {
	isCreateBoardModalOpen.value = true;
};
const handleCloseCreateBoardModal = () => {
	isCreateBoardModalOpen.value = false;
};

const handleCreateBoard = (newBoard: Partial<Board>) => {
	try {
		boardsStore.createBoard(newBoard);
		isCreateBoardModalOpen.value = false;
	} catch (error) {
		console.error("Error creating board:", error);
	}
};

const handleViewBoard = (boardId: string) => {
	navigateTo(`/boards/${boardId}`);
};
</script>

<template>
	<!-- no boards -->
	<UContainer v-if="visibleBoardIds.length === 0"
		class="w-screen h-screen flex flex-col justify-center items-center text-center gap-4 p-4">
		<h1 class="font-bold text-3xl">Boards</h1>
		<p class="text-lg">You have <span class="font-bold">no boards</span>.</p>
		<UButton label="Create a board" color="secondary" class="text-lg" @click="handleOpenCreateBoardModal" />
	</UContainer>

	<!-- boards -->
	<UContainer v-else class="w-screen flex flex-col items-center gap-4 p-4">
		<h1 class="font-bold text-3xl">Boards</h1>
		<div class="w-full flex flex-wrap gap-4 justify-start">
			<BoardPreview v-for="boardId of visibleBoardIds" :key="boardId" :name="boardMap[boardId].name"
				:description="boardMap[boardId].description" :tags="boardMap[boardId].tags"
				@view="handleViewBoard(boardId)" />
		</div>
	</UContainer>

	<!-- action menu -->
	<ActionMenu>
		<CreateBoardButton @create="handleOpenCreateBoardModal" />
		<LoadBoardButton />
		<ToggleArchivedBoardsButton />
	</ActionMenu>

	<!-- modals -->
	<CreateBoardModal v-model:open="isCreateBoardModalOpen" @cancel="handleCloseCreateBoardModal"
		@create="handleCreateBoard" />
</template>
