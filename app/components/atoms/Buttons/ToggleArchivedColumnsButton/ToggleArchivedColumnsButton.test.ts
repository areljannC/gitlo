import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { useSettingsStore } from '~/stores';
import ToggleArchivedColumnsButton from './ToggleArchivedColumnsButton.vue';

describe('ToggleArchivedColumnsButton', () => {
	let settingsStore: ReturnType<typeof useSettingsStore>;

	beforeEach(() => {
		setActivePinia(createPinia());
		settingsStore = useSettingsStore();
		settingsStore.setShowArchivedColumns(false);
	});

	it('renders "Show archived columns" when `showArchivedColumns` is `false`', () => {
		const wrapper = mount(ToggleArchivedColumnsButton);
		expect(wrapper.text()).toContain('Show archived columns');
		expect(settingsStore.showArchivedColumns).toBe(false);
	});

	it('renders "Hide archived columns" when `showArchivedColumns` is `true`', async () => {
		settingsStore.setShowArchivedColumns(true);
		const wrapper = mount(ToggleArchivedColumnsButton);
		expect(wrapper.text()).toContain('Hide archived columns');
		expect(settingsStore.showArchivedColumns).toBe(true);
	});

	it('toggles `showArchivedColumns` on click', async () => {
		const wrapper = mount(ToggleArchivedColumnsButton);
		const button = wrapper.find('button');
		await button.trigger('click');
		expect(settingsStore.showArchivedColumns).toBe(true);
		await button.trigger('click');
		expect(settingsStore.showArchivedColumns).toBe(false);
	});
});
