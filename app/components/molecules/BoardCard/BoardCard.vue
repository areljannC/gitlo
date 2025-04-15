<script setup lang="ts">
defineProps({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	tags: {
		type: Array as PropType<string[]>,
		default: []
	}
})

const emit = defineEmits(['click'])

const handleOnClick = () => {
	emit('click')
}
</script>

<template>
	<UCard class="w-64 h-64 hover:shadow-lg hover:translate-y-[-4px] transition duration-100" @click="handleOnClick">
		<template #header>
			<h1 class="font-bold text-xl">{{ name }}</h1>
		</template>
		<p v-if="description">{{ description }}</p>
		<template v-if="tags !== undefined && tags.length > 0" #footer>
			<div class="flex flex-wrap gap-1">
				<Tag v-for="tag in [...tags]" :key="tag" :label="tag" />
			</div>
		</template>
	</UCard>
</template>