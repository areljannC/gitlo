<script setup lang="ts">
import { computed, useTemplateRef, ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { useCardsStore } from '~/stores';

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

watch(card, updatedCard => {
	cardNameInput.value = updatedCard.name
});

const handleStartEditingCardName = () => {
	cardNameInput.value = card.value.name;
	isEditingCardName.value = true;
}

// TODO: use `valibot` to validate the name
// TODO: wrap this in a try-catch block
const handleStopEditingCardName = () => {
	const cardName = cardNameInput.value.trim();
	if (cardName !== '' && cardName.length > 0) {
		cardsStore.updateCard(props.cardId, { name: cardName });
		isEditingCardName.value = false;
	} else {
		console.warn('Invalid card name.');
	}
}

// TODO: make this better
const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		handleStopEditingCardName();
	}
	if (event.key === 'Tab') {
		handleStopEditingCardName();
	}
}

onClickOutside(editCardNameInputRef, () => {
	if (!isEditingCardName.value) return;
	handleStopEditingCardName();
})

const handleExpandCard = () => {
	cardsStore.expandCard(props.cardId);
}

const baseClass = 'rounded-md flex-shrink-0 p-2';
const dimensionClass = 'w-full h-fit min-h-13 max'
const lightThemeClass = 'bg-gray-100'
const darkThemeClass = 'dark:bg-gray-600';
</script>

<template>
	<div :class="[baseClass, dimensionClass, lightThemeClass, darkThemeClass]">
		<div class="w-full flex justify-between items-start gap-1 pr-2">
			<UTextarea ref="editCardNameInputRef" v-model="cardNameInput" placeholder="Enter card name..."
				color="secondary" :highlight="isEditingCardName" class="w-full font-bold" size="lg"
				:variant="isEditingCardName ? 'soft' : 'ghost'" :rows="1" :maxrows="0" autoresize :autoresizeDelay="0"
				@click="handleStartEditingCardName" @keydown="handleKeyDown" />
			<div class="w-fit h-fit flex gap-1 items-center">
				<UButton icon="heroicons:arrows-pointing-out-20-solid" class="size-5 w-fit h-fit cursor-pointer"
					variant="ghost" color="neutral" @click="handleExpandCard" />
				<UIcon name="heroicons:arrows-up-down-solid"
					class="size-5 draggable-card md:hidden hover:cursor-grab active:cursor-grabbing" />
				<UIcon name="icon-park-outline:direction-adjustment-two"
					class="size-5 draggable-card cursor-move hidden md:block hover:cursor-grab active:cursor-grabbing" />
			</div>
		</div>
	</div>
</template>