<script setup lang="ts">
import { computed, ref, useTemplateRef, reactive, watch } from 'vue';
import { useCardsStore } from '~/stores';
import { parseTimestamp } from '~/shared/utils';

const cardsStore = useCardsStore();
const expandedCardId = computed(() => cardsStore.expandedCardId);
const expandedCard = computed(() => expandedCardId.value !== null ? cardsStore.getCardById(expandedCardId.value) : null);

const isEditing = ref(false);
const form = useTemplateRef('form');
const state = reactive({
	name: expandedCard.value?.name,
	description: expandedCard.value?.description
})

watch(expandedCard, (card) => {
	state.name = card?.name;
	state.description = card?.description;
});

const handleNameInputKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		(event.target as HTMLTextAreaElement).blur();
	}
}

const handleCollapseCard = () => {
	isEditing.value = false;
	cardsStore.collapseCard();
}

const handleCancelChanges = () => {
	state.name = expandedCard.value?.name;
	state.description = expandedCard.value?.description;
	isEditing.value = false;
}

const handleStartEditing = () => {
	isEditing.value = true;
}

const handleSaveChanges = () => {
	form.value?.submit();
}

const handleSubmit = () => {
	cardsStore.updateCard(expandedCard.value!.id, { ...state });
	isEditing.value = false;
};
</script>

<template>
	<UModal :open="expandedCardId !== null" :dismissible="false" :close="false">
		<template #header>
			<div class="w-full flex justify-center">
				<h2 class="font-bold text-xl">{{ isEditing ? 'Editing Card' : 'Card Overview' }}</h2>
			</div>
		</template>
		<template #body>
			<UForm ref="form" :state="state" class="w-full h-fit flex flex-col gap-4" @submit="handleSubmit">
				<UFormField name="name" label="Name" size="lg">
					<UTextarea v-model="state.name" placeholder="Enter card name..." color="secondary"
						class="w-full font-bold" size="xl" :variant="isEditing ? 'soft' : 'ghost'" :rows="1"
						:maxrows="0" autoresize :autoresizeDelay="0" :readonly="!isEditing"
						@keydown="handleNameInputKeyDown" />
				</UFormField>
				<UFormField name="description" label="Description" size="lg">
					<UTextarea v-model="state.description"
						:placeholder="isEditing ? 'Enter card description...' : 'No description.'" color="secondary"
						class="w-full" size="xl" :variant="isEditing ? 'soft' : 'ghost'" :rows="1" :maxrows="0"
						autoresize :autoresizeDelay="0" :readonly="!isEditing" />
				</UFormField>
				<UFormField name="updatedAt" label="Updated at" size="md">
					<UInput :modelValue="`${expandedCard !== null && parseTimestamp(expandedCard?.updatedAt!)}`"
						type="text" color="secondary" icon="heroicons:clock" class="w-full font-light" size="md"
						variant="none" :readonly="true" />
				</UFormField>
				<UFormField name="createdAt" label="Created at" size="md">
					<UInput :modelValue="`${expandedCard !== null && parseTimestamp(expandedCard?.createdAt!)}`"
						type="text" color="secondary" icon="heroicons:clock" class="w-full font-light" size="md"
						variant="none" :readonly="true" />
				</UFormField>
			</UForm>
		</template>
		<template v-if="isEditing" #footer>
			<UButton label="Cancel" color="error" variant="soft" @click="handleCancelChanges" />
			<UButton label="Save changes" :color="'primary'" @click="handleSaveChanges" />
		</template>
		<template v-else #footer>
			<UButton label="Close" color="error" variant="soft" @click="handleCollapseCard" />
			<UButton label="Edit" color="secondary" @click="handleStartEditing" />
		</template>
	</UModal>
</template>
