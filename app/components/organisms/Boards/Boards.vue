<script setup lang="ts">
import { ref } from 'vue';
import * as v from 'valibot';
import type { FormSubmitEvent } from '@nuxt/ui';
import * as createBoard from '~/schemas/createBoard';
import type { Board } from '~/types';

const { data, status, error, refresh } = await useFetch<{ boards: Board[] }>('/api/boards');

const isCreateBoardModalOpen = ref(false);
const createBoardForm = useTemplateRef('createBoardForm');
const createBoardSchema = v.object({
	name: createBoard.getNameValidator(),
	description: createBoard.getDescriptionValidator(),
	tag: createBoard.getTagValidator(),
	columns: createBoard.getColumnsValidator()
})
const createBoardFormState = reactive({
	name: '',
	description: undefined,
	tag: undefined,
	tags: new Set<string>(),
	columns: 3
});

const resetCreateBoardFormState = () => {
	createBoardFormState.name = '';
	createBoardFormState.description = undefined;
	createBoardFormState.tag = undefined;
	createBoardFormState.tags = new Set<string>();
	createBoardFormState.columns = 3;
}

const handleOpenCreateBoardModal = () => {
	isCreateBoardModalOpen.value = true
}
const handleCloseCreateBoardModal = () => {
	isCreateBoardModalOpen.value = false;
	resetCreateBoardFormState()
};

const handleAddTag = (event: KeyboardEvent) => {
	if (event.key !== 'Enter') return;
	createBoardForm.value?.validate({ name: 'tag', silent: true });
	const rawTag = (createBoardFormState.tag ?? '').trim();
	const result = v.safeParse(v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(16)), rawTag);
	if (result.success && rawTag !== '') {
		createBoardFormState.tags.add(rawTag);
		createBoardFormState.tag = undefined;
	}
};

const handleDeleteTag = (tag: string) => {
	createBoardFormState.tags.delete(tag);
};

const handleClickCreateBoard = () => {
	createBoardForm.value?.submit();
};

const handleCreateBoard = async (event: FormSubmitEvent<v.InferOutput<typeof createBoardSchema>>) => {
	await $fetch('/api/boards', {
		method: 'POST',
		body: {
			name: event.data.name,
			description: event.data.description,
			tags: [...createBoardFormState.tags],
			columns: event.data.columns
		}
	});
	isCreateBoardModalOpen.value = false;
	resetCreateBoardFormState()
	await refresh()
};

const handleGoToBoard = (id: string) => {
	navigateTo(`/boards/${id}`)
}
</script>

<!-- TODO:  -->
<template>
	<!-- no boards -->
	<UContainer v-if="data?.boards.length === 0 || error?.statusCode === 404"
		class="w-screen h-screen flex flex-col justify-center items-center space-y-4">
		<h1 class="font-bold text-3xl">Boards</h1>
		<p class="text-lg">You have <span class="font-bold">no boards</span>.</p>
		<UButton label="Create a board" color="secondary" class="text-lg" @click="handleOpenCreateBoardModal" />
	</UContainer>

	<!-- boards -->
	<UContainer class="w-screen flex flex-col items-center space-x-4 space-y-4">
		<h1 class="font-bold text-3xl">Boards</h1>
		<div class="w-full flex flex-wrap gap-4 justify-start">
			<BoardCard v-for="board of data?.boards" :key="board.id" :name="board.name" :description="board.description"
				:tags="board.tags" @click="handleGoToBoard(board.id)" />
			<div class="w-64 h-64 flex justify-center items-center border border-neutral-200 border-dashed rounded-md">
				<UButton icon="heroicons:plus-solid" color="secondary" class="text-lg"
					@click="handleOpenCreateBoardModal" />
			</div>
		</div>
	</UContainer>

	<!-- modal -->
	<UModal v-model:open="isCreateBoardModalOpen" :dismissible="false" :close="false">
		<template #header>
			<h1 class="font-bold text-xl">Create a board</h1>
		</template>
		<template #body>
			<UForm ref="createBoardForm" :schema="createBoardSchema" :state="createBoardFormState" class="space-y-4"
				@submit="handleCreateBoard">
				<UFormField name="name" label="Name" description="A short, clear title for this board." size="lg"
					class="text-md">
					<UInput v-model="createBoardFormState.name" type="text" placeholder="e.g. Sprint 3 - Frontend Tasks"
						class="w-full" />
				</UFormField>
				<UFormField name="description" label="Description"
					description="Optional context about this board's purpose." size="lg" class="text-md">
					<UInput v-model="createBoardFormState.description" type="text"
						placeholder="e.g. Optional context about what this board is for." class="w-full" />
				</UFormField>
				<UFormField name="tag" label="Tags" description="Add tags to help organize and filter your board.
" size="lg" class="text-md">
					<UInput v-model="createBoardFormState.tag" type="text" placeholder="e.g. frontend, urgent, personal
" class="w-full" @keydown.enter.prevent="handleAddTag" />
				</UFormField>
				<div v-if="createBoardFormState.tags.size > 0" class="flex flex-wrap gap-1">
					<Tag v-for="tag in [...createBoardFormState.tags]" :key="tag" :label="tag" deleteable
						@click="handleDeleteTag(tag)" />
				</div>
				<UFormField name="columns" label="Columns" description="Set up the starting columns for your board.
" size="lg" class="text-md">
					<UInput v-model="createBoardFormState.columns" type="number" placeholder="e.g. 3
" class="w-full" />
				</UFormField>
			</UForm>
		</template>

		<template #footer>
			<UButton label="Cancel" color="error" class="text-lg" variant="soft" @click="handleCloseCreateBoardModal" />
			<UButton label="Create board" color="primary" class="text-lg" @click="handleClickCreateBoard" />
		</template>
	</UModal>
</template>

<!--<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';

const columns = ref([{ id: 1, name: 'column 1', items: [{ id: 1, name: 'task 1' }] }])

const addColumn = () => {
	const newId = columns.value.length + 1
	columns.value.push({ id: newId, name: `column ${newId}`, items: [{ id: 1, name: 'task 1' }, { id: 2, name: 'task 2' }] })
}
</script>

<template>
	<div class="w-screen h-screen overflow-x-auto">
		<div class="flex items-start space-x-4 min-w-max">
			<button @click="addColumn"
				class="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">Add column</button>
			<div v-for="column in columns" :key="column.id" class="w-64">
				<draggable v-model="column.items" item-key="column.id" class="space-y-2 min-h-64" group="tasks">
					<template #item="{ element }">
						<div class="bg-gray-200 p-4 rounded shadow">
							<p class="text-lg font-bold">{{ element.name }}</p>
						</div>
					</template>
				</draggable>
			</div>
		</div>
	</div>
</template>-->
