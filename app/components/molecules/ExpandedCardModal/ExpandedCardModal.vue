<script setup lang="ts">
import { computed, ref, useTemplateRef, reactive, watch } from 'vue';
import { useCardsStore } from '~/stores';
import { parseTimestamp } from '~/shared/utils';

const cardsStore = useCardsStore();
const expandedCardId = computed(() => cardsStore.expandedCardId);
const expandedCard = computed(() => expandedCardId.value !== null ? cardsStore.getCardById(expandedCardId.value) : null);

const isEditing = ref(false);
const form = useTemplateRef('form');
const formState = reactive({
	name: expandedCard.value?.name,
	description: expandedCard.value?.description
});

watch(expandedCard, (card) => {
	formState.name = card?.name;
	formState.description = card?.description;
});

const resetFormState = () => {
	formState.name = expandedCard.value?.name;
	formState.description = expandedCard.value?.description;
};

const handleCardNameInputKeyDown = (event: KeyboardEvent) => {
	(event.target as HTMLTextAreaElement).blur();
};

const handleArchiveCard = () => {
	cardsStore.archiveCard(expandedCard.value!.id);
};

const handleUnarchiveCard = () => {
	cardsStore.unarchiveCard(expandedCard.value!.id);
};

const handleCloseCardModal = () => {
	isEditing.value = false;
	cardsStore.collapseCard();
};

const handleCancelCardChanges = () => {
	resetFormState();
	isEditing.value = false;
};

const handleEditCard = () => {
	isEditing.value = true;
};

const handleDeleteCard = () => {
	cardsStore.deleteCard(expandedCard.value!.id);
	cardsStore.collapseCard();
};

const handleUpdateCard = () => {
	form.value?.submit();
};

const handleSubmitCardChanges = () => {
	cardsStore.updateCard(expandedCard.value!.id, { ...formState });
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
			<UForm ref="form" :state="formState" class="w-full h-fit flex flex-col gap-4"
				@submit="handleSubmitCardChanges">
				<UFormField name="name" label="Name" size="lg">
					<UTextarea v-model="formState.name" placeholder="Enter card name..." color="secondary"
						class="w-full font-bold" size="xl" :variant="isEditing ? 'soft' : 'ghost'" :rows="1"
						:maxrows="0" autoresize :autoresizeDelay="0" :readonly="!isEditing"
						@keydown.enter.prevent="handleCardNameInputKeyDown" />
				</UFormField>
				<UFormField name="description" label="Description" size="lg">
					<UTextarea v-model="formState.description"
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
		<template #footer>
			<div class="w-full flex justify-between items-center gap-2">
				<ArchiveButton v-if="!expandedCard?.archived && !isEditing" @archive="handleArchiveCard" />
				<UnarchiveButton v-else-if="expandedCard?.archived && !isEditing" @unarchive="handleUnarchiveCard" />
				<div v-if="!expandedCard?.archived" class="flex gap-2 ml-auto">
					<CancelButton v-if="isEditing" @cancel="handleCancelCardChanges" />
					<CloseButton v-else @close="handleCloseCardModal" />
					<UpdateButton v-if="isEditing" @update="handleUpdateCard" />
					<EditButton v-else @edit="handleEditCard" />
				</div>
				<div v-else class="flex gap-2">
					<CloseButton @close="handleCloseCardModal" />
					<DeleteButton @delete="handleDeleteCard" />
				</div>
			</div>
		</template>
	</UModal>
</template>
