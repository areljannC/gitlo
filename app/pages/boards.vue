<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';

const columns = ref([{ id: 1, name: 'column 1', items: [{ id: 1, name: 'task 1' }] }])

const addColumn = () => {
	const newId = columns.value.length + 1
	columns.value.push({ id: newId, name: `column ${newId}`, items: [{ id: 1, name: 'task 1' }, { id: 2, name: 'task 2' }] })
}
</script>

<template>
	<div class="w-screen h-screen overflow-x-auto">
		<div class="flex items-start space-x-4 min-w-max">
			<button @click="addColumn"
				class="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">Add column</button>
			<div v-for="column in columns" :key="column.id" class="w-64">
				<draggable v-model="column.items" item-key="column.id" class="space-y-2 min-h-64" group="tasks">
					<template #item="{ element }">
						<div class="bg-gray-200 p-4 rounded shadow">
							<p class="text-lg font-bold">{{ element.name }}</p>
						</div>
					</template>
				</draggable>
			</div>
		</div>
	</div>
</template>