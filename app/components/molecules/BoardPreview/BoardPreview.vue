<script setup lang="ts">
defineProps({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: ''
	},
	tags: {
		type: Array as PropType<string[]>,
		default: []
	}
});

const emit = defineEmits(['view']);

const handleViewBoard = (() => {
	emit('view')
});

const dimensionsClass = 'w-full h-fit sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(25%-1rem)]';
const nameClass = 'font-bold text-sm md:text-md lg:text-lg xl:text-xl';
const descriptionClass = 'text-sm md:text-md lg:text-lg break-all';
</script>

<template>
	<UCard v-if="description !== '' || tags.length > 0" :class="[dimensionsClass]">
		<template #header>
			<h1 :class="nameClass">{{ name }}</h1>
		</template>
		<div class="flex flex-col gap-4">
			<p v-if="description !== ''" :class="descriptionClass">{{ description }}</p>
			<div v-if="tags.length > 0" class="flex flex-wrap gap-2">
				<Tag v-for="tag in [...tags]" :key="tag" :label="tag" />
			</div>
		</div>
		<template #footer>
			<UButton label="View" color="secondary" variant="ghost" class="w-full flex justify-center"
				@click="handleViewBoard" />
		</template>
	</UCard>
	<UCard v-else :class="[dimensionsClass]">
		<template #header>
			<h1 :class="nameClass">{{ name }}</h1>
		</template>
		<template #footer>
			<UButton label="View" color="secondary" variant="ghost" class="w-full flex justify-center"
				@click="handleViewBoard" />
		</template>
	</UCard>
</template>
