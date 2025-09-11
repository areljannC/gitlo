import { vi, describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { useSettingsStore } from '~/stores';
import ToggleArchivedBoardsButton from './ToggleArchivedBoardsButton.vue';

describe('ToggleArchivedBoardsButton', () => {
	let pinia: any;

	beforeEach(() => {
		vi.resetAllMocks();
		pinia = createPinia();
		setActivePinia(pinia);
	});

	it('renders "Show archived boards" when `showArchivedBoards` is `false`', async () => {
		const settingsStore = useSettingsStore();
		const wrapper = await mountSuspended(ToggleArchivedBoardsButton, { global: { plugins: [pinia] } });
		expect(wrapper.text()).toContain('Show archived boards');
		expect(settingsStore.showArchivedBoards).toBe(false);
	});

	it('renders "Hide archived boards" when `showArchivedBoards` is `true`', async () => {
		const settingsStore = useSettingsStore();
		settingsStore.setShowArchivedBoards(true);
		const wrapper = await mountSuspended(ToggleArchivedBoardsButton, { global: { plugins: [pinia] } });
		expect(wrapper.text()).toContain('Hide archived boards');
		expect(settingsStore.showArchivedBoards).toBe(true);
	});

	it('toggles `showArchivedBoards` on click', async () => {
		const settingsStore = useSettingsStore();
		const wrapper = await mountSuspended(ToggleArchivedBoardsButton, { global: { plugins: [pinia] } });
		const button = wrapper.find('button');
		await button.trigger('click');
		expect(settingsStore.showArchivedBoards).toBe(true);
		await button.trigger('click');
		expect(settingsStore.showArchivedBoards).toBe(false);
	});
});
