import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import CreateBoardButton from './CreateBoardButton.vue';

describe('CreateBoardButton', () => {
	describe('emits', () => {
		it('should emit `create` when the button is clicked', async () => {
			const wrapper = await mountSuspended(CreateBoardButton);
			await wrapper.find('button').trigger('click');
			expect(wrapper.emitted()).toHaveProperty('create');
		});
	});

	it('should render a button with the correct label', async () => {
		const wrapper = await mountSuspended(CreateBoardButton);
		expect(wrapper.find('button').text()).toContain('Create a board');
	});
});
