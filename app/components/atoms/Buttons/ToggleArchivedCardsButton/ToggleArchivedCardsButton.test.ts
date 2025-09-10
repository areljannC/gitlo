import { vi, describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { useSettingsStore } from '~/stores';
import ToggleArchivedCardsButton from './ToggleArchivedCardsButton.vue';

describe('ToggleArchivedCardsButton', () => {
	let pinia: any;

	beforeEach(() => {
		vi.resetAllMocks();
		pinia = createPinia();
		setActivePinia(pinia);
	});

	it('renders "Show archived cards" when `showArchivedCards` is `false`', async () => {
		const settingsStore = useSettingsStore();
		const wrapper = await mountSuspended(ToggleArchivedCardsButton, { global: { plugins: [pinia] } });
		expect(settingsStore.showArchivedCards).toBe(false);
		expect(wrapper.text()).toContain('Show archived cards');
	});

	it('renders "Hide archived cards" when `showArchivedCards` is `true`', async () => {
		const settingsStore = useSettingsStore();
		settingsStore.setShowArchivedCards(true);
		const wrapper = await mountSuspended(ToggleArchivedCardsButton, { global: { plugins: [pinia] } });
		expect(wrapper.text()).toContain('Hide archived cards');
		expect(settingsStore.showArchivedCards).toBe(true);
	});

	it('toggles `showArchivedCards` on click', async () => {
		const settingsStore = useSettingsStore();
		const wrapper = await mountSuspended(ToggleArchivedCardsButton, { global: { plugins: [pinia] } });
		const button = wrapper.find('button');
		await button.trigger('click');
		expect(settingsStore.showArchivedCards).toBe(true);
		await button.trigger('click');
		expect(settingsStore.showArchivedCards).toBe(false);
	});
});
