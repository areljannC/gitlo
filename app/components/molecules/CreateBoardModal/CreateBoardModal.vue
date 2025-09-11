<script setup lang="ts">
import { reactive } from 'vue';
import * as v from 'valibot';
import * as boardSchema from '~/schemas/boardSchema';
import type { FormSubmitEvent } from '@nuxt/ui';

const props = defineProps({
	open: {
		type: Boolean,
		required: true
	},
});

const emit = defineEmits(['close', 'create']);

const form = useTemplateRef('form');
const formSchema = v.object({
	name: boardSchema.getNameValidator(),
	description: boardSchema.getDescriptionValidator(),
	tag: boardSchema.getTagValidator(),
	columns: boardSchema.getColumnsValidator()
});
const formState = reactive({
	name: '',
	description: undefined,
	tag: undefined,
	tags: new Set<string>(),
	columns: 3
});

const resetFormState = () => {
	formState.name = '';
	formState.description = undefined;
	formState.tag = undefined;
	formState.tags = new Set<string>();
	formState.columns = 3;
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

const handleCloseCreateBoardModal = () => {
	resetFormState();
	emit('close');
};

const handleSubmitCreateBoard = () => {
	form.value?.submit();
};

const handleSubmit = (event: FormSubmitEvent<v.InferOutput<typeof formSchema>>) => {
	emit('create', {
		name: event.data.name,
		description: event.data.description,
		tags: [...formState.tags],
		columns: event.data.columns
	});
	resetFormState();
};
</script>

<template>
	<UModal v-model:open="props.open" :dismissible="false" :close="false">
		<template #header>
			<div class="w-full flex justify-center">
				<h2 class="font-bold text-xl">Create a board</h2>
			</div>
		</template>
		<template #body>
			<UForm ref="form" :schema="formSchema" :state="formState" class="w-full h-fit flex flex-col gap-4"
				@submit="handleSubmit">
				<UFormField name="name" label="Name" description="A short, clear title for this board." size="lg">
					<UInput v-model="formState.name" type="text" placeholder="e.g. Sprint 3 - Frontend Tasks"
						class="w-full" />
				</UFormField>
				<UFormField name="description" label="Description"
					description="Optional context about this board's purpose." size="lg">
					<UInput v-model="formState.description" type="text"
						placeholder="e.g. Optional context about what this board is for." class="w-full" />
				</UFormField>
				<UFormField name="tag" label="Tags" description="Add tags to help organize and filter your board."
					size="lg">
					<UInput v-model="formState.tag" type="text" placeholder="e.g. frontend, urgent, personal"
						@keydown.enter.prevent="handleCreateBoardTag" class="w-full" />
				</UFormField>
				<div v-if="formState.tags.size > 0" class="flex flex-wrap gap-1">
					<Tag v-for="tag in formState.tags" :key="tag" :label="tag" deleteable
						@delete="handleDeleteBoardTag(tag)" />
				</div>
				<UFormField name="columns" label="Columns" description="Set up the starting columns for your board."
					size="lg">
					<UInput v-model="formState.columns" type="number" placeholder="e.g. 3" class="w-full" />
				</UFormField>
			</UForm>
		</template>
		<template #footer>
			<CancelButton @cancel="handleCloseCreateBoardModal" />
			<UButton label="Create board" color="primary" @click="handleSubmitCreateBoard" />
		</template>
	</UModal>
</template>
