<script setup lang="ts">
import { computed, useTemplateRef, ref } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { useCardsStore } from '~/stores';
import { updateCard } from '~/services';

const props = defineProps({
	cardId: {
		type: String,
		required: true
	},
});

const cardsStore = useCardsStore();
const card = computed(() => cardsStore.cardMap[props.cardId]);

const editCardNameInputRef = useTemplateRef<HTMLInputElement>('editCardNameInputRef');
const cardNameInput = ref(card.value.name);
const isEditingCardName = ref(false);

const handleStartEditingCardName = () => {
	cardNameInput.value = card.value.name;
	isEditingCardName.value = true;
}

// TODO: use `valibot` to validate the name
const handleStopEditingCardName = () => {
	const cardName = cardNameInput.value.trim();
	if (cardName !== '' && cardName.length > 0) {
		updateCard(props.cardId, { name: cardName });
		isEditingCardName.value = false;
	} else {
		console.warn('Invalid card name.');
	}
}

const handleTabKey = (event: KeyboardEvent) => {
	if (event.key === 'Tab') {
		handleStopEditingCardName();
	}
}

const handleEnterKey = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		handleStopEditingCardName();
	}
}

onClickOutside(editCardNameInputRef, () => {
	if (!isEditingCardName.value) return;
	handleStopEditingCardName();
})

const baseClass = 'rounded-md flex-shrink-0 p-2';
const dimensionClass = 'w-full h-fit min-h-13'
const lightThemeClass = 'bg-gray-100'
const darkThemeClass = 'dark:bg-gray-600';

const NOOP = () => { };
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<div class="w-full flex justify-between items-center gap-1 pr-2">
			<UInput ref="editCardNameInputRef" v-model="cardNameInput" type="text" placeholder="Enter card name..."
				color="secondary" :highlight="isEditingCardName" class='w-full font-bold' size="lg"
				:variant="false ? 'soft' : 'ghost'" @click="handleStartEditingCardName" @keydown="handleTabKey"
				@keyup="handleEnterKey" />
			<div class="flex gap-1 items-center">
				<UButton icon="heroicons:arrows-pointing-out-20-solid" class="size-5 w-fit h-fit cursor-pointer"
					variant="ghost" color="neutral" />
				<UIcon name="heroicons:arrows-up-down-solid"
					class="size-5 draggable-card md:hidden hover:cursor-grab active:cursor-grabbing" />
				<UIcon name="icon-park-outline:direction-adjustment-two"
					class="size-5 draggable-card cursor-move hidden md:block hover:cursor-grab active:cursor-grabbing" />
			</div>
		</div>
	</div>
</template>