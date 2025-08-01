import { vi, describe, beforeEach, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { UButton } from '#components';
import { useDataStore } from '~/stores';
import { getTimestamp } from '~/shared/utils';
import { MOCK_TIMESTAMP, MOCK_BOARD } from '~/constants';
import LoadBoardButton from './LoadBoardButton.vue';

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		getTimestamp: vi.fn()
	};
});

mockNuxtImport('useColorMode', () => {
	const colorMode = ref('light');
	return () => colorMode;
});

let pinia: any;

describe('LoadBoardButton', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		pinia = createPinia();
		setActivePinia(pinia);
		vi.mocked(getTimestamp).mockReturnValue(MOCK_TIMESTAMP[1]);
	});

	it('should render a button with the correct label', async () => {
		const wrapper = await mountSuspended(LoadBoardButton, { global: { plugins: [pinia] } });
		expect(wrapper.text()).toContain('Load board');
	});

	it('should trigger file input click when button is clicked', async () => {
		const wrapper = await mountSuspended(LoadBoardButton, { global: { plugins: [pinia] } });
		const input = wrapper.find('input[type="file"]');
		const clickSpy = vi.spyOn(input.element as HTMLInputElement, 'click');
		await wrapper.find('button').trigger('click');
		expect(clickSpy).toHaveBeenCalled();
	});

	it('should call dataStore.loadBoard with parsed JSON when a valid file is selected', async () => {
		const wrapper = await mountSuspended(LoadBoardButton, { global: { plugins: [pinia] } });
		const dataStore = useDataStore();
		const loadBoardSpy = vi.spyOn(dataStore, 'loadBoard').mockResolvedValue();
		const input = wrapper.find('input[type="file"]');
		const fileContent = JSON.stringify({ board: MOCK_BOARD[1] });
		const file = new File([fileContent], 'test.json', { type: 'application/json' });
		Object.defineProperty(input.element, 'files', { value: [file] });
		await input.trigger('change');
		await wrapper.vm.$nextTick();
		expect(loadBoardSpy).toHaveBeenCalledWith(JSON.parse(fileContent));
	});

	it('should alert on invalid JSON file', async () => {
		const wrapper = await mountSuspended(LoadBoardButton, { global: { plugins: [pinia] } });
		const input = wrapper.find('input[type="file"]');
		const file = new File(['not-json'], 'test.json', { type: 'application/json' });
		Object.defineProperty(input.element, 'files', { value: [file] });
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
		await input.trigger('change');
		await wrapper.vm.$nextTick();
		expect(alertSpy).toHaveBeenCalledWith('Invalid JSON file');
		alertSpy.mockRestore();
	});

	it('should set isLoadingBoard true while loading and false after', async () => {
		const wrapper = await mountSuspended(LoadBoardButton, { global: { plugins: [pinia] } });
		const dataStore = useDataStore();
		vi.spyOn(dataStore, 'loadBoard').mockImplementation(async () => {
			await new Promise(r => setTimeout(r, 10));
		});
		const input = wrapper.find('input[type="file"]');
		const fileContent = JSON.stringify({ board: MOCK_BOARD[1] });
		const file = new File([fileContent], 'test.json', { type: 'application/json' });
		Object.defineProperty(input.element, 'files', { value: [file] });
		const button = wrapper.findComponent(UButton);
		await button.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		expect(button.props('loading')).toBe(true);
		await input.trigger('change');
		await new Promise(r => setTimeout(r, 15));
		await wrapper.vm.$nextTick();
		expect(button.props('loading')).toBe(false);
	});

	it('should set isLoadingBoard to false and return if no files are selected', async () => {
		const wrapper = await mountSuspended(LoadBoardButton, { global: { plugins: [pinia] } });
		const input = wrapper.find('input[type="file"]');
		Object.defineProperty(input.element, 'files', { value: [] });
		const button = wrapper.findComponent(UButton);
		await button.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		await input.trigger('change');
		await wrapper.vm.$nextTick();
		expect(button.props('loading')).toBe(false);
	});

	it('should set isLoadingBoard to false and return if files is null', async () => {
		const wrapper = await mountSuspended(LoadBoardButton, { global: { plugins: [pinia] } });
		const input = wrapper.find('input[type="file"]');
		Object.defineProperty(input.element, 'files', { value: null });
		const button = wrapper.findComponent(UButton);
		await button.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		await input.trigger('change');
		await wrapper.vm.$nextTick();
		expect(button.props('loading')).toBe(false);
	});
});
