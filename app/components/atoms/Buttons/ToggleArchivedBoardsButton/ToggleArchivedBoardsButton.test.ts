import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { useSettingsStore } from '~/stores';
import ToggleArchivedBoardsButton from './ToggleArchivedBoardsButton.vue';

describe('ToggleArchivedBoardsButton', () => {
	let settingsStore: ReturnType<typeof useSettingsStore>;

	beforeEach(() => {
		setActivePinia(createPinia());
		settingsStore = useSettingsStore();
		settingsStore.setShowArchivedBoards(false);
	});

	it('renders "Show archived boards" when `showArchivedBoards` is `false`', () => {
		const wrapper = mount(ToggleArchivedBoardsButton);
		expect(wrapper.text()).toContain('Show archived boards');
		expect(settingsStore.showArchivedBoards).toBe(false);
	});

	it('renders "Hide archived boards" when `showArchivedBoards` is `true`', async () => {
		settingsStore.setShowArchivedBoards(true);
		const wrapper = mount(ToggleArchivedBoardsButton);
		expect(wrapper.text()).toContain('Hide archived boards');
		expect(settingsStore.showArchivedBoards).toBe(true);
	});

	it('toggles `showArchivedBoards` on click', async () => {
		const wrapper = mount(ToggleArchivedBoardsButton);
		const button = wrapper.find('button');
		await button.trigger('click');
		expect(settingsStore.showArchivedBoards).toBe(true);
		await button.trigger('click');
		expect(settingsStore.showArchivedBoards).toBe(false);
	});
});
