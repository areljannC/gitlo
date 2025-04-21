<script setup lang="ts">
import { computed, useTemplateRef, ref } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { useColumnsStore, useCardsStore } from '~/stores';

const props = defineProps({
	columnId: {
		type: String,
		required: true,
	},
});


const columnsStore = useColumnsStore();
const cardsStore = useCardsStore();

const createCardInputRef = useTemplateRef<HTMLInputElement>('createCardInputRef');
const cardNameInput = ref('');
const isEditingCardName = ref(false);

const handleStartEditingCardName = () => {
	cardNameInput.value = '';
	isEditingCardName.value = true;
}

// TODO: use`valibot` to validate the name
const handleStopEditingCardName = () => {
	const cardName = cardNameInput.value.trim();
	if (cardName !== '' && cardName.length > 0) {
		const newCardId = cardsStore.createCardWithName(props.columnId, cardName);
		columnsStore.columnMap[props.columnId]?.cardIds?.push(newCardId);
		cardNameInput.value = '';
		isEditingCardName.value = false;
	} else {
		console.warn('Invalid card name.');
	}
}

const handleKeyUp = (event: KeyboardEvent) => {
	event.preventDefault();
	if (event.key !== 'Enter') return;
	handleStopEditingCardName();
}

onClickOutside(createCardInputRef, () => {
	if (!isEditingCardName.value) return;
	handleStopEditingCardName();
})

const baseClass = 'rounded-md flex-shrink-0 p-2 opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out';
const dimensionClass = 'w-full h-fit min-h-13'
const lightThemeClass = 'bg-gray-100'
const darkThemeClass = 'dark:bg-gray-600';
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<UInput ref="createCardInputRef" v-model="cardNameInput" type="text" placeholder="Add a card..."
			color="secondary" icon="heroicons:plus-solid" :highlight="isEditingCardName" class='w-full font-bold'
			size="lg" :variant="isEditingCardName ? 'soft' : 'ghost'" @click="handleStartEditingCardName"
			@keyup="handleKeyUp" />
	</div>
</template>