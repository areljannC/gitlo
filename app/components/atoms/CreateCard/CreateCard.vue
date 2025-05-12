<script setup lang="ts">
import { useTemplateRef, ref } from 'vue';
import { useCardsStore } from '~/stores';

const props = defineProps({
	columnId: {
		type: String,
		required: true,
	}
});

const cardsStore = useCardsStore();
const createCardInputRef = useTemplateRef<HTMLInputElement>('createCardInputRef');
const cardNameInput = ref('');
const isEditingCardName = ref(false);

const handleStartEditingCardName = () => {
	isEditingCardName.value = true;
}

// TODO: use`valibot` to validate the name
const handleStopEditingCardName = () => {
	try {
		const cardName = cardNameInput.value.trim();
		if (cardName.length === 0) {
			isEditingCardName.value = false;
			return;
		}
		cardsStore.createCard(props.columnId, { name: cardName });
		cardNameInput.value = '';
		isEditingCardName.value = false;
	} catch (error) {
		console.error(error);
	}
}

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		handleStopEditingCardName();
	}
}

const baseClass = 'rounded-md flex-shrink-0 p-2 opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out';
const dimensionClass = 'w-full h-fit min-h-13'
const lightThemeClass = 'bg-gray-100'
const darkThemeClass = 'dark:bg-gray-600';
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<UTextarea ref="createCardInputRef" v-model="cardNameInput" placeholder="Add a card..." color="secondary"
			icon="heroicons:plus-solid" :highlight="isEditingCardName" class="w-full font-bold" size="lg"
			:variant="isEditingCardName ? 'soft' : 'ghost'" :rows="1" :maxrows="0" autoresize :autoresizeDelay="0"
			@focus="handleStartEditingCardName" @blur="handleStopEditingCardName" @keydown="handleKeyDown" />
	</div>
</template>