<script setup lang="ts">
defineProps({
	color: {
		type: String,
		default: 'primary',
		validator: (value: string) => new Set(['primary', 'secondary', 'success', 'warning', 'danger', 'error']).has(value)
	},
	disabled: {
		type: Boolean,
		default: false
	}
})

const baseStyle =
	'px-4 py-2 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1'
const colorClasses: Record<string, string> = {
	primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400',
	secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
	warning: 'bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-400',
	danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
	success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
	error: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
}

const emit = defineEmits(['click'])
const handleClick = (event: MouseEvent) => {
	emit('click', event)
}
</script>

<template>
	<button
		:class="[baseStyle, colorClasses[color] || colorClasses.primary, disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
		:disabled="disabled" @click="handleClick">
		<slot />
	</button>
</template>