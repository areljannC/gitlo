import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { useSettingsStore } from '~/stores/settingsStore/settingsStore';
import ToggleArchivedCardsButton from './ToggleArchivedCardsButton.vue';

describe('ToggleArchivedCardsButton', () => {
	let settingsStore: ReturnType<typeof useSettingsStore>;

	beforeEach(() => {
		setActivePinia(createPinia());
		settingsStore = useSettingsStore();
		settingsStore.setShowArchivedCards(false);
	});

	it('renders "Show archived cards" when `showArchivedCards` is `false`', () => {
		const wrapper = mount(ToggleArchivedCardsButton);
		expect(wrapper.text()).toContain('Show archived cards');
		expect(settingsStore.showArchivedCards).toBe(false);
	});

	it('renders "Hide archived cards" when `showArchivedCards` is `true`', async () => {
		settingsStore.setShowArchivedCards(true);
		const wrapper = mount(ToggleArchivedCardsButton);
		expect(wrapper.text()).toContain('Hide archived cards');
		expect(settingsStore.showArchivedCards).toBe(true);
	});

	it('toggles `showArchivedCards` on click', async () => {
		const wrapper = mount(ToggleArchivedCardsButton);
		const button = wrapper.find('button');
		await button.trigger('click');
		expect(settingsStore.showArchivedCards).toBe(true);
		await button.trigger('click');
		expect(settingsStore.showArchivedCards).toBe(false);
	});
});
