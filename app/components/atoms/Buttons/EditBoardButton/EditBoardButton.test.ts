import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import EditBoardButton from './EditBoardButton.vue';

describe('EditBoardButton', () => {
	describe('emits', () => {
		it('should emit `edit` when the button is clicked', async () => {
			const wrapper = await mountSuspended(EditBoardButton);
			await wrapper.find('button').trigger('click');
			expect(wrapper.emitted()).toHaveProperty('edit');
		});
	});

	it('should render a button with the correct label', async () => {
		const wrapper = await mountSuspended(EditBoardButton);
		expect(wrapper.find('button').text()).toContain('Edit board');
	});
});
