<script setup lang="ts">
import { computed, reactive, useTemplateRef, ref, watch } from 'vue';
import * as v from 'valibot';
import { useColumnsStore } from '~/stores';
import * as columnSchema from '~/schemas/columnSchema';
import type { FormSubmitEvent } from '@nuxt/ui';

const props = defineProps({
	columnId: {
		type: String,
		required: true
	},
});

const columnsStore = useColumnsStore();
const column = computed(() => columnsStore.getColumnById(props.columnId)!);
const columnForm = useTemplateRef<HTMLFormElement>('columnForm');
const columnFormSchema = v.object({ name: columnSchema.getNameValidator() });
const columnFormState = reactive({ name: column.value.name });
const isEditingColumnName = ref(false);

watch(column, updatedColumn => {
	columnFormState.name = updatedColumn.name;
});

const handleStartEditingColumnName = () => {
	isEditingColumnName.value = true;
};

const handleStopEditingColumnName = () => {
	isEditingColumnName.value = false;
	columnForm.value?.submit();
};

const handleSubmit = (event: FormSubmitEvent<v.InferOutput<typeof columnFormSchema>>) => {
	try {
		columnsStore.updateColumn(props.columnId, { name: event.data.name.trim() });
	} catch (error) {
		console.error(error);
	}
};

const baseClass = 'rounded-md flex flex-col flex-shrink-0 overflow-y-auto gap-2 p-2';
const dimensionClass = 'w-full md:w-68 h-fit min-h-13 max-h-full ';
const lightThemeClass = 'bg-gray-300';
const darkThemeClass = 'dark:bg-gray-800';
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<div class="w-full flex justify-between items-center gap-2">
			<UForm ref="columnForm" :schema="columnFormSchema" :state="columnFormState" @submit="handleSubmit">
				<UFormField name="name" size="lg">
					<UInput v-model="columnFormState.name" type="text" placeholder="Enter column name..."
						color="secondary" :highlight="isEditingColumnName" class='w-full font-bold' size="lg"
						:variant="isEditingColumnName ? 'soft' : 'ghost'" @focus="handleStartEditingColumnName"
						@blur="handleStopEditingColumnName" @keyup.enter="handleStopEditingColumnName" />
				</UFormField>
			</UForm>
			<UIcon name="heroicons:arrows-up-down-solid"
				class="size-5 draggable-column cursor-move ml-1 mr-3 md:hidden hover:cursor-grab active:cursor-grabbing" />
			<UIcon name="heroicons:arrows-right-left-solid"
				class="size-5 draggable-column cursor-move ml-1 mr-3 hidden md:block hover:cursor-grab active:cursor-grabbing" />
		</div>
		<Cards :columnId="column.id" :cardIds="column.cardIds" />
	</div>
</template>