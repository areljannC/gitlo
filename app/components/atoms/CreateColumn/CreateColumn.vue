<script setup lang="ts">
import { reactive, useTemplateRef, ref } from 'vue';
import * as v from 'valibot';
import { useColumnsStore } from '~/stores'
import * as columnSchema from '~/schemas/columnSchema';
import type { FormSubmitEvent } from '@nuxt/ui';

const props = defineProps({
	boardId: {
		type: String,
		required: true,
	}
});

const columnsStore = useColumnsStore();
const isEditingColumnName = ref(false);
const createColumnForm = useTemplateRef<HTMLFormElement>('createColumnForm');
const createColumnFormSchema = v.object({ name: columnSchema.getNameValidator() });
const createColumnFormState = reactive({ name: '' });

const handleStartEditingColumnName = () => {
	isEditingColumnName.value = true;
};

const handleStopEditingColumnName = () => {
	isEditingColumnName.value = false;
	createColumnForm.value?.submit();
};

const handleSubmit = (event: FormSubmitEvent<v.InferOutput<typeof createColumnFormSchema>>) => {
	try {
		if (event.data.name.trim().length > 0) {
			columnsStore.createColumn(props.boardId, { name: event.data.name.trim() });
			createColumnFormState.name = '';
		}
	} catch (error) {
		console.error(error)
	}
};

const baseClass = 'rounded-md flex-shrink-0 overflow-y-auto p-2 opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out';
const dimensionClass = 'w-full md:w-68 h-fit min-h-13';
const lightThemeClass = 'bg-gray-300'
const darkThemeClass = 'dark:bg-gray-800';
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<UForm ref="createColumnForm" :schema="createColumnFormSchema" :state="createColumnFormState"
			@submit="handleSubmit">
			<UFormField name="name" size="lg">
				<UInput v-model="createColumnFormState.name" type="text" placeholder="Enter new column name..."
					color="secondary" icon="heroicons:plus-solid" :highlight="isEditingColumnName"
					class='w-full font-bold' size="lg" :variant="isEditingColumnName ? 'soft' : 'ghost'"
					@focus="handleStartEditingColumnName" @blur="handleStopEditingColumnName"
					@keyup.enter="handleStopEditingColumnName" />
			</UFormField>
		</UForm>
	</div>
</template>