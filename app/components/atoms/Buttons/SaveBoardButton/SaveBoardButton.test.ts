import { vi, describe, beforeEach, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { UButton } from '#components';
import { useDataStore } from '~/stores';
import { MOCK_HASH } from '~/constants';
import SaveBoardButton from './SaveBoardButton.vue';

mockNuxtImport('useColorMode', () => {
	const colorMode = ref('light');
	return () => colorMode;
});

let pinia: any;
const BOARD_ID = MOCK_HASH[1];

describe('SaveBoardButton', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		pinia = createPinia();
		setActivePinia(pinia);
	});

	it('should render a button with the correct label', async () => {
		const wrapper = await mountSuspended(SaveBoardButton, {
			props: { boardId: BOARD_ID },
			global: { plugins: [pinia] }
		});
		expect(wrapper.text()).toContain('Save board');
	});

	it('should call dataStore.saveBoard with boardId when clicked', async () => {
		const wrapper = await mountSuspended(SaveBoardButton, {
			props: { boardId: BOARD_ID },
			global: { plugins: [pinia] }
		});
		const dataStore = useDataStore();
		const saveBoardSpy = vi.spyOn(dataStore, 'saveBoard').mockResolvedValue();
		const button = wrapper.findComponent(UButton);
		await button.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		expect(saveBoardSpy).toHaveBeenCalledWith(BOARD_ID);
	});

	it('should set isSavingBoard true while saving and false after', async () => {
		const wrapper = await mountSuspended(SaveBoardButton, {
			props: { boardId: BOARD_ID },
			global: { plugins: [pinia] }
		});
		const dataStore = useDataStore();
		vi.spyOn(dataStore, 'saveBoard').mockImplementation(async () => {
			await new Promise(r => setTimeout(r, 10));
		});
		const button = wrapper.findComponent(UButton);
		await button.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		// Should be loading after click
		expect(button.props('loading')).toBe(true);
		await new Promise(r => setTimeout(r, 15));
		await wrapper.vm.$nextTick();
		// Should be false after async handler finishes
		expect(button.props('loading')).toBe(false);
	});

	it('should log error if saveBoard throws', async () => {
		const wrapper = await mountSuspended(SaveBoardButton, {
			props: { boardId: BOARD_ID },
			global: { plugins: [pinia] }
		});
		const dataStore = useDataStore();
		const error = new Error('fail');
		vi.spyOn(dataStore, 'saveBoard').mockRejectedValue(error);
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const button = wrapper.findComponent(UButton);
		await button.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		await new Promise(r => setTimeout(r, 5));
		await wrapper.vm.$nextTick();
		expect(errorSpy).toHaveBeenCalledWith('Failed to save board:', error);
		errorSpy.mockRestore();
	});
});
