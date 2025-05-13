import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { ToggleThemeButton } from '#components';
import ActionMenu from './ActionMenu.vue';

describe('ActionMenu', () => {
	it('should render a button', async () => {
		const wrapper = await mountSuspended(ActionMenu);
		expect(wrapper.find('button')).toBeTruthy();
	});

	it('should open the menu when the button is clicked', async () => {
		const wrapper = await mountSuspended(ActionMenu);

		const openActionMenuButton = wrapper.find('button');
		expect(openActionMenuButton).toBeTruthy();

		await openActionMenuButton.trigger('click');
		expect(wrapper.findComponent(ToggleThemeButton).exists()).toBe(true);
		expect(wrapper.findAll('button').length).toBe(2);
	});

	it('should close the menu when the button is clicked again', async () => {
		const wrapper = await mountSuspended(ActionMenu);

		const openActionMenuButton = wrapper.find('button');
		expect(openActionMenuButton).toBeTruthy();

		await openActionMenuButton.trigger('click');
		expect(wrapper.findComponent(ToggleThemeButton).exists()).toBe(true);
		expect(wrapper.findAll('button').length).toBe(2);

		const closeActionMenuButton = wrapper.findAll('button').at(1)!;
		await closeActionMenuButton.trigger('click');
		expect(wrapper.findComponent(ToggleThemeButton).exists()).toBe(false);
		expect(wrapper.findAll('button').length).toBe(1);
	});
});
