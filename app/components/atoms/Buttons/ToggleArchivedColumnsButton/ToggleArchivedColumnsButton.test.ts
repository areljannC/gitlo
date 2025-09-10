import { vi, describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { useSettingsStore } from '~/stores';
import ToggleArchivedColumnsButton from './ToggleArchivedColumnsButton.vue';

describe('ToggleArchivedColumnsButton', () => {
	let pinia: any;

	beforeEach(() => {
		vi.resetAllMocks();
		pinia = createPinia();
		setActivePinia(pinia);
	});

	it('renders "Show archived columns" when `showArchivedColumns` is `false`', async () => {
		const settingsStore = useSettingsStore();
		const wrapper = await mountSuspended(ToggleArchivedColumnsButton, { global: { plugins: [pinia] } });
		expect(wrapper.text()).toContain('Show archived columns');
		expect(settingsStore.showArchivedColumns).toBe(false);
	});

	it('renders "Hide archived columns" when `showArchivedColumns` is `true`', async () => {
		const settingsStore = useSettingsStore();
		settingsStore.setShowArchivedColumns(true);
		const wrapper = await mountSuspended(ToggleArchivedColumnsButton, { global: { plugins: [pinia] } });
		expect(wrapper.text()).toContain('Hide archived columns');
		expect(settingsStore.showArchivedColumns).toBe(true);
	});

	it('toggles `showArchivedColumns` on click', async () => {
		const settingsStore = useSettingsStore();
		const wrapper = await mountSuspended(ToggleArchivedColumnsButton, { global: { plugins: [pinia] } });
		const button = wrapper.find('button');
		await button.trigger('click');
		expect(settingsStore.showArchivedColumns).toBe(true);
		await button.trigger('click');
		expect(settingsStore.showArchivedColumns).toBe(false);
	});
});
