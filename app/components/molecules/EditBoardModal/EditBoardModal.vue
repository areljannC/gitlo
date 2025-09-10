<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue';
import * as v from 'valibot';
import { useBoardsStore } from '~/stores';
import * as boardSchema from '~/schemas/boardSchema';
import type { FormSubmitEvent } from '@nuxt/ui';

const props = defineProps({
	open: {
		type: Boolean,
		required: true
	},
	boardId: {
		type: String,
		required: true
	}
});

const emit = defineEmits(['close']);

const boardsStore = useBoardsStore();
const board = computed(() => boardsStore.getBoardById(props.boardId));

const isEditing = ref(false);
const form = useTemplateRef('form');
const formSchema = v.object({
	name: boardSchema.getNameValidator(),
	description: boardSchema.getDescriptionValidator(),
	tag: boardSchema.getTagValidator(),
});
const formState = reactive({
	name: board.value?.name,
	description: board.value?.description,
	tag: undefined,
	tags: new Set<string>(board.value?.tags)
})

watch(board, updatedBoard => {
	formState.name = updatedBoard?.name;
	formState.description = updatedBoard?.description;
	formState.tags = new Set<string>(updatedBoard?.tags);
});

const resetFormState = () => {
	formState.name = board.value?.name;
	formState.description = board.value?.description;
	formState.tag = undefined;
	formState.tags = new Set<string>(board.value?.tags);
};

const handleCreateBoardTag = () => {
	form.value?.validate({ name: 'tag', silent: true });
	const result = v.safeParse(v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(16)), formState.tag);
	if (result.success) {
		formState.tags.add(formState.tag!);
		formState.tag = undefined;
	}
};

const handleDeleteBoardTag = (tag: string) => {
	formState.tags.delete(tag);
};

const handleCancelBoardChanges = () => {
	resetFormState();
	isEditing.value = false;
};

const handleEditBoard = () => {
	isEditing.value = true;
};

const handleCloseBoardModal = () => {
	isEditing.value = false;
	emit('close');
};

const handleArchiveBoard = () => {
	try {
		boardsStore.archiveBoard(props.boardId);
	} catch (error) {
		console.error('Error archiving board:', error);
	}
};

const handleUnarchiveBoard = () => {
	try {
		boardsStore.unarchiveBoard(props.boardId);
	} catch (error) {
		console.error('Error unarchiving board:', error);
	}
};

const handleDeleteBoard = async () => {
	try {
		await navigateTo('/boards');
		boardsStore.deleteBoard(props.boardId);
	} catch (error) {
		console.error('Error deleting board:', error);
	}
};

const handleUpdateBoard = () => {
	form.value?.submit();
};

const handleSubmitBoardChanges = (event: FormSubmitEvent<v.InferOutput<typeof formSchema>>) => {
	try {
		boardsStore.updateBoard(props.boardId, {
			name: event.data.name,
			description: event.data.description,
			tags: [...formState.tags]
		});
		isEditing.value = false;
	} catch (error) {
		console.error('Error submitting form:', error);
	}
};
</script>

<template>
	<UModal :open="props.open" :dismissable="false" :close="false">
		<template #header>
			<div class="w-full flex justify-center">
				<h2 class="font-bold text-xl">{{ isEditing ? 'Editing Board' : 'Board Overview' }}</h2>
			</div>
		</template>
		<template #body>
			<UForm ref="form" :schema="formSchema" :state="formState" class="w-full h-fit flex flex-col gap-4"
				@submit="handleSubmitBoardChanges">
				<UFormField name="name" label="Name"
					:description="isEditing ? 'A short, clear title for this board.' : ''" size="lg">
					<UInput v-model="formState.name" type="text" placeholder="e.g. Sprint 3 - Frontend Tasks"
						class="w-full" :variant="isEditing ? 'soft' : 'ghost'" :readonly="!isEditing" />
				</UFormField>
				<UFormField name="description" label="Description"
					:description="isEditing ? 'Optional context about this board\'s purpose.' : ''" size="lg">
					<UInput v-model="formState.description" type="text"
						placeholder="e.g. Optional context about what this board is for." class="w-full"
						:variant="isEditing ? 'soft' : 'ghost'" :readonly="!isEditing" />
				</UFormField>
				<UFormField name="tag" label="Tags"
					:description="isEditing ? 'Add tags to help organize and filter your board.' : ''" size="lg">
					<UInput v-if="isEditing" v-model="formState.tag" type="text"
						placeholder="e.g. frontend, urgent, personal" @keydown.enter.prevent="handleCreateBoardTag"
						class="w-full" />
				</UFormField>
				<div v-if="formState.tags.size > 0" class="flex flex-wrap gap-1">
					<Tag v-for="tag in formState.tags" :key="tag" :label="tag" :deleteable="isEditing"
						@delete="handleDeleteBoardTag(tag)" />
				</div>
			</UForm>
		</template>
		<template #footer>
			<div class="w-full flex justify-between items-center gap-2">
				<ArchiveButton v-if="!board?.archived && !isEditing" @archive="handleArchiveBoard" />
				<UnarchiveButton v-else-if="board?.archived && !isEditing" @unarchive="handleUnarchiveBoard" />
				<div v-if="!board?.archived" class="flex gap-2 ml-auto">
					<CancelButton v-if="isEditing" @cancel="handleCancelBoardChanges" />
					<CloseButton v-else @close="handleCloseBoardModal" />
					<UpdateButton v-if="isEditing" @update="handleUpdateBoard" />
					<EditButton v-else @edit="handleEditBoard" />
				</div>
				<div v-else class="flex gap-2">
					<CloseButton @close="handleCloseBoardModal" />
					<DeleteButton @delete="handleDeleteBoard" />
				</div>
			</div>
		</template>
	</UModal>
</template>