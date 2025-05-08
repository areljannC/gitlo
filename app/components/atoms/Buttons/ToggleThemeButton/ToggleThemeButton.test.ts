import { describe, it, expect } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useColorMode } from '#imports';
import ToggleThemeButton from './ToggleThemeButton.vue';

mockNuxtImport('useColorMode', () => {
	const colorMode = ref('light');
	return () => colorMode
});

describe('ToggleThemeButton', () => {
	it('should render a button with the correct label', async () => {
		const wrapper = await mountSuspended(ToggleThemeButton);
		expect(wrapper.find('button').text()).toContain('Toggle theme');
	});

	it('should toggle the theme when clicked', async () => {
		const wrapper = await mountSuspended(ToggleThemeButton);
		const button = wrapper.find('button');
		const colorMode = useColorMode();
		
		await button.trigger('click');
		expect(colorMode.value).toBe('dark');
		await button.trigger('click');
		expect(colorMode.value).toBe('light');
		await button.trigger('click');
		expect(colorMode.value).toBe('dark');
		await button.trigger('click');
		expect(colorMode.value).toBe('light');
		await button.trigger('click');
		expect(colorMode.value).toBe('dark');
		await button.trigger('click');
		expect(colorMode.value).toBe('light');
	});
});
