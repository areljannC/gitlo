<script lang="ts">
const colors = new Set(["primary", "secondary", "info", "success", "warning", "error", "neutral"])
const variants = new Set(["solid", "outline", "subtle", "soft"])
const sizes = new Set(["xs", "sm", "md", "lg", "xl"])
</script>

<script setup lang="ts">
const props = defineProps({
	label: {
		type: String,
		required: true
	},
	color: {
		type: String,
		default: 'info',
		validator: (value: string) => colors.has(value)
	},
	variant: {
		type: String,
		default: 'soft',
		validator: (value: string) => variants.has(value)
	},
	size: {
		type: String,
		default: 'md',
		validator: (value: string) => sizes.has(value)
	},
	deleteable: {
		type: Boolean,
		default: false
	}
})

const color = props.color as "primary" | "secondary" | "info" | "success" | "warning" | "error" | "neutral"
const variant = props.variant as "solid" | "outline" | "subtle" | "soft"
const size = props.size as "xs" | "sm" | "md" | "lg" | "xl"

const emit = defineEmits(['delete'])

const handleDelete = () => {
	emit('delete')
}
</script>

<template>
	<UBadge :label="label" :color="color" :variant="variant" :size="size">
		<template v-if="deleteable" #trailing>
			<UButton :size="size" :color="color" icon="heroicons:x-mark-solid" variant="ghost" square
				@click="handleDelete" />
		</template>
	</UBadge>
</template>