<script setup lang="ts">
import { reactive } from 'vue';
import * as v from 'valibot';
import * as boardSchema from '~/schemas/boardSchema';
import type { FormSubmitEvent } from '@nuxt/ui';

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
});
const emit = defineEmits(['cancel', 'create']);

const form = useTemplateRef('form');
const schema = v.object({
	name: boardSchema.getNameValidator(),
	description: boardSchema.getDescriptionValidator(),
	tag: boardSchema.getTagValidator(),
	columns: boardSchema.getColumnsValidator()
});
const state = reactive({
	name: '',
	description: undefined,
	tag: undefined,
	tags: new Set<string>(),
	columns: 3
});

const resetState = () => {
	state.name = '';
	state.description = undefined;
	state.tag = undefined;
	state.tags = new Set<string>();
	state.columns = 3;
};

const handleCreateTag = (event: KeyboardEvent) => {
	if (event.key !== 'Enter') return;
	form.value?.validate({ name: 'tag', silent: true });
	const rawTag = (state.tag ?? '').trim();
	const result = v.safeParse(v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(16)), rawTag);
	if (result.success && rawTag !== '') {
		state.tags.add(rawTag);
		state.tag = undefined;
	}
};

const handleDeleteTag = (tag: string) => {
	state.tags.delete(tag);
};

const handleCancel = () => {
	resetState();
	emit('cancel');
};

const handleCreateBoard = () => {
	form.value?.submit();
};

const handleSubmit = (event: FormSubmitEvent<v.InferOutput<typeof schema>>) => {
	emit('create', {
		name: event.data.name,
		description: event.data.description,
		tags: [...state.tags],
		columns: event.data.columns
	});
	resetState();
};
</script>

<template>
	<UModal v-model:open="props.open" :dismissible="false" :close="false">
		<template #header>
			<h1 class="font-bold text-xl">Create a board</h1>
		</template>
		<template #body>
			<UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
				<UFormField name="name" label="Name" description="A short, clear title for this board." size="lg">
					<UInput v-model="state.name" type="text" placeholder="e.g. Sprint 3 - Frontend Tasks" class="w-full"  />
				</UFormField>
				<UFormField name="description" label="Description" description="Optional context about this board's purpose." size="lg">
					<UInput v-model="state.description" type="text" placeholder="e.g. Optional context about what this board is for." class="w-full"  />
				</UFormField>
				<UFormField name="tag" label="Tags" description="Add tags to help organize and filter your board." size="lg">
					<UInput v-model="state.tag" type="text" placeholder="e.g. frontend, urgent, personal" @keydown.enter.prevent="handleCreateTag" class="w-full"  />
				</UFormField>
				<div v-if="state.tags.size > 0" class="flex flex-wrap gap-1">
					<Tag v-for="tag in state.tags" :key="tag" :label="tag" deleteable @click="handleDeleteTag(tag)" />
				</div>
				<UFormField name="columns" label="Columns" description="Set up the starting columns for your board." size="lg">
					<UInput v-model="state.columns" type="number" placeholder="e.g. 3" class="w-full"  />
				</UFormField>
			</UForm>
		</template>
		<template #footer>
			<UButton label="Cancel" color="error" variant="soft" @click="handleCancel" />
			<UButton label="Create board" color="primary" @click="handleCreateBoard" />
		</template>
	</UModal>
</template>
