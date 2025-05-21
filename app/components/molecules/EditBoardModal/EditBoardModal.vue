<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
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
const emit = defineEmits(['cancel', 'archive', 'unarchive', 'update']);

const boardsStore = useBoardsStore();
const board = computed(() => boardsStore.getBoardById(props.boardId));

const form = useTemplateRef('form');
const schema = v.object({
	name: boardSchema.getNameValidator(),
	description: boardSchema.getDescriptionValidator(),
	tag: boardSchema.getTagValidator(),
});
const state = reactive({
	name: board.value?.name,
	description: board.value?.description,
	tag: undefined,
	tags: new Set<string>(board.value?.tags)
})

watch(board, updatedBoard => {
	state.name = updatedBoard?.name;
	state.description = updatedBoard?.description;
	state.tags = new Set<string>(updatedBoard?.tags);
});

const resetState = () => {
	state.name = board.value?.name;
	state.description = board.value?.description;
	state.tag = undefined;
	state.tags = new Set<string>(board.value?.tags);
};

const handleCreateTag = () => {
	form.value?.validate({ name: 'tag', silent: true });
	const rawTag = (state.tag ?? '').trim();
	const result = v.safeParse(v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(16)), rawTag);
	if (result.success) {
		state.tags.add(rawTag);
		state.tag = undefined;
	}
	// TODO: Figure out why this is not being covered by coverage report
	/* c8 ignore next */
};

const handleDeleteTag = (tag: string) => {
	state.tags.delete(tag);
};

const handleCancel = () => {
	resetState();
	emit('cancel');
};

const handleArchiveBoard = () => {
	emit('archive');
};

const handleUnarchiveBoard = () => {
	emit('unarchive');
};

const handleUpdateBoard = () => {
	form.value?.submit();
};

const handleSubmit = (event: FormSubmitEvent<v.InferOutput<typeof schema>>) => {
	emit('update', {
		name: event.data.name,
		description: event.data.description,
		tags: [...state.tags]
	});
	resetState();
};
</script>

<template>
	<UModal v-model:open="props.open" :dismissable="false" :close="false">
		<template #header>
			<div class="w-full flex justify-center">
				<h2 class="font-bold text-xl">Edit board</h2>
			</div>
		</template>
		<template #body>
			<UForm ref="form" :schema="schema" :state="state" class="w-full h-fit flex flex-col gap-4"
				@submit="handleSubmit">
				<UFormField name="name" label="Name" description="A short, clear title for this board." size="lg">
					<UInput v-model="state.name" type="text" placeholder="e.g. Sprint 3 - Frontend Tasks"
						class="w-full" />
				</UFormField>
				<UFormField name="description" label="Description"
					description="Optional context about this board's purpose." size="lg">
					<UInput v-model="state.description" type="text"
						placeholder="e.g. Optional context about what this board is for." class="w-full" />
				</UFormField>
				<UFormField name="tag" label="Tags" description="Add tags to help organize and filter your board."
					size="lg">
					<UInput v-model="state.tag" type="text" placeholder="e.g. frontend, urgent, personal"
						@keydown.enter.prevent="handleCreateTag" class="w-full" />
				</UFormField>
				<div v-if="state.tags.size > 0" class="flex flex-wrap gap-1">
					<Tag v-for="tag in state.tags" :key="tag" :label="tag" deleteable @delete="handleDeleteTag(tag)" />
				</div>
			</UForm>
		</template>
		<template #footer>
			<div class="w-full flex justify-between items-center gap-2">
				<UButton v-if="!board?.archived" label="Archive" color="neutral" variant="ghost"
					@click="handleArchiveBoard" />
				<UButton v-else label="Unarchive" color="secondary" variant="ghost"
					@click="handleUnarchiveBoard" />
				<div class="flex gap-2">
					<UButton label="Cancel" color="error" variant="soft" @click="handleCancel" />
					<UButton label="Update" color="primary" @click="handleUpdateBoard" />
				</div>
			</div>
		</template>
	</UModal>
</template>