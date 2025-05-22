<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import * as v from 'valibot';
import { useBoardsStore } from '~/stores';
import * as boardSchema from '~/schemas/boardSchema';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { Board } from '~/types';

const boardsStore = useBoardsStore();
const route = useRoute();

const boardId = route.params.id as string;
if (!boardsStore.isValidBoardId(route.params.id as string)) {
	navigateTo('/boards')
}

const board = computed(() => boardsStore.getBoardById(boardId)!);
const isEditBoardModalOpen = ref(false);
const isEditingBoardName = ref(false);
const form = useTemplateRef('form');
const schema = v.object({ name: boardSchema.getNameValidator() });
const state = reactive({ name: board.value.name });

watch(board, updatedBoard => {
	state.name = updatedBoard.name;
});

const handleStartEditingBoardName = () => {
	isEditingBoardName.value = true;
};

const handleStopEditingBoardName = () => {
	isEditingBoardName.value = false;
	form.value?.submit();
};

const handleSubmit = (event: FormSubmitEvent<v.InferOutput<typeof schema>>) => {
	boardsStore.updateBoard(boardId, { name: event.data.name });
};

const handleOpenEditBoardModal = () => {
	isEditBoardModalOpen.value = true;
};

const handleCloseEditBoardModal = () => {
	isEditBoardModalOpen.value = false;
};

// TODO: Move this to `EditBoardModal.vue`.
const handleArchiveBoard = () => {
	boardsStore.archiveBoard(boardId);
};

// TODO: Move this to `EditBoardModal.vue`.
const handleUnarchiveBoard = () => {
	boardsStore.unarchiveBoard(boardId);
}

// TODO: Move this to `EditBoardModal.vue`.
const handleDeleteBoard = async () => {
	await navigateTo('/boards');
	boardsStore.deleteBoard(boardId);
};

// TODO: Move this to `EditBoardModal.vue`.
const handleUpdateBoard = (updatedBoard: Partial<Board>) => {
	try {
		boardsStore.updateBoard(boardId, updatedBoard);
		isEditBoardModalOpen.value = false;
	} catch (error) {
		console.error("Error updating board:", error);
	}
};
</script>

<template>
	<div class="w-screen h-screen flex flex-col items-center gap-4 p-4">
		<div class="w-fit min-w-68">
			<UForm ref="form" :schema="schema" :state="state" @submit="handleSubmit">
				<UFormField name="name" size="lg" :ui="{ error: 'text-center' }">
					<UInput v-model="state.name" type="text" placeholder="Enter board name..." color="secondary"
						:highlight="isEditingBoardName" class='w-full font-bold' size="xl"
						:variant="isEditingBoardName ? 'soft' : 'ghost'" :ui="{ base: 'text-2xl text-center' }"
						@focus="handleStartEditingBoardName" @blur="handleStopEditingBoardName" />
				</UFormField>
			</UForm>
		</div>
		<Columns :boardId="board.id" :columnIds="board.columnIds" />
	</div>

	<!-- action menu -->
	<ActionMenu>
		<EditBoardButton @edit="handleOpenEditBoardModal" />
	</ActionMenu>

	<!-- modals -->
	<EditBoardModal v-model:open="isEditBoardModalOpen" @cancel="handleCloseEditBoardModal"
		@archive="handleArchiveBoard" @unarchive="handleUnarchiveBoard" @update="handleUpdateBoard"
		@delete="handleDeleteBoard" :boardId="boardId" />
	<ExpandedCardModal />
</template>
