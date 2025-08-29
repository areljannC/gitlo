import { describe, it, beforeEach, expect, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { DOMWrapper } from '@vue/test-utils';
import { Columns, ActionMenu, EditBoardButton, ToggleArchivedCardsButton } from '#components';
import { generateHash } from '~/shared/utils';
import { useSettingsStore, useBoardsStore } from '~/stores';
import { MOCK_HASH, MOCK_BOARD } from '~/constants';
import Board from './Board.vue';

// Mock navigateTo and useRoute
const { navigateToSpy } = vi.hoisted(() => ({ navigateToSpy: vi.fn() }));
mockNuxtImport('navigateTo', () => navigateToSpy);
mockNuxtImport('useRoute', () => () => ({ params: { id: MOCK_HASH[1] } }));
mockNuxtImport('useColorMode', () => {
	const colorMode = ref('light');
	return () => colorMode;
});

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn()
	};
});

let pinia: any;

describe('Board', () => {
	let boardId: string | void;

	beforeEach(() => {
		document.body.innerHTML = '';
		vi.resetAllMocks();
		pinia = createPinia();
		setActivePinia(pinia);
		// mock the generated hash for the board and the two columns
		vi.mocked(generateHash)
			.mockReturnValueOnce(MOCK_HASH[1]) // board
			.mockReturnValueOnce(MOCK_HASH[2]) // column 1
			.mockReturnValueOnce(MOCK_HASH[3]); // column 2
		const boardsStore = useBoardsStore();
		boardId = boardsStore.createBoard({
			name: MOCK_BOARD[1].name,
			description: MOCK_BOARD[1].description,
			tags: MOCK_BOARD[1].tags,
			columns: 2
		});
	});

	it('renders the board name and columns', async () => {
		const wrapper = await mountSuspended(Board, { global: { plugins: [pinia] } });
		const boardNameInput = wrapper.find('input');
		expect(boardNameInput.exists()).toBe(true);
		expect((boardNameInput.element as HTMLInputElement).value).toBe(MOCK_BOARD[1].name);
		expect(wrapper.findComponent(Columns).exists()).toBe(true);
	});

	it('updates the board name via input and form submit', async () => {
		const wrapper = await mountSuspended(Board, { global: { plugins: [pinia] } });
		const input = wrapper.find('input');
		await input.setValue('New Board Name');
		await input.trigger('blur'); // triggers form submit
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();
		const boardsStore = useBoardsStore();
		expect(boardsStore.getBoardById(boardId ?? MOCK_HASH[1])?.name).toBe('New Board Name');
	});

	it('reactively updates the input value if the board name changes in the store', async () => {
		const wrapper = await mountSuspended(Board, { global: { plugins: [pinia] } });
		const boardsStore = useBoardsStore();
		boardsStore.updateBoard(boardId ?? MOCK_HASH[1], { name: 'Changed Name' });
		await wrapper.vm.$nextTick();
		const input = wrapper.find('input');
		expect((input.element as HTMLInputElement).value).toBe('Changed Name');
	});

	it('opens and closes the `ActionMenu`', async () => {
		const wrapper = await mountSuspended(Board, { global: { plugins: [pinia] } });
		// Open ActionMenu first
		const actionMenu = wrapper.findComponent(ActionMenu);
		expect(actionMenu).toBeTruthy();
		await actionMenu.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		// Now EditBoardButton should be visible
		const editBoardButton = wrapper.findComponent(EditBoardButton);
		expect(editBoardButton).toBeTruthy();
		await editBoardButton.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		// Modal should be open
		let editBoardModal = new DOMWrapper(document.querySelector('[role="dialog"]'));
		expect(editBoardModal.exists()).toBe(true);
		// Close modal via Cancel button
		const editBoardModalCancelButton = editBoardModal.findAll('button').find(btn => btn.text() === 'Cancel');
		expect(editBoardModalCancelButton!.exists()).toBe(true);
		await editBoardModalCancelButton!.trigger('click');
		await wrapper.vm.$nextTick();
		// Modal should be closed open
		editBoardModal = new DOMWrapper(document.querySelector('[role="dialog"]'));
		expect(editBoardModal.exists()).toBe(false);
	});

	it('updates the board name via `EditBoardModal`', async () => {
		const wrapper = await mountSuspended(Board, { global: { plugins: [pinia] } });
		// Open ActionMenu
		const actionMenu = wrapper.findComponent(ActionMenu);
		expect(actionMenu.exists()).toBe(true);
		await actionMenu.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		// Open EditBoardModal
		const editBoardButton = wrapper.findComponent(EditBoardButton);
		expect(editBoardButton.exists()).toBe(true);
		await editBoardButton.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		// Modal should be open
		let editBoardModal = new DOMWrapper(document.querySelector('[role="dialog"]'));
		expect(editBoardModal.exists()).toBe(true);
		// Find the name input inside the modal (should have label 'Name')
		const editBoardModalBoardNameInput = wrapper.find('input[name="name"]');
		expect(editBoardModalBoardNameInput.exists()).toBe(true);
		expect((editBoardModalBoardNameInput.element as HTMLInputElement).value).toBe(MOCK_BOARD[1].name);
		editBoardModalBoardNameInput.trigger('focus');
		await wrapper.vm.$nextTick();
		editBoardModalBoardNameInput.setValue('New board name');
		await wrapper.vm.$nextTick();
		editBoardModalBoardNameInput.trigger('blur');
		await wrapper.vm.$nextTick();
		expect((editBoardModalBoardNameInput.element as HTMLInputElement).value).toBe('New board name');
		// Click the Update button
		const updateButton = editBoardModal.findAll('button').find(btn => btn.text() === 'Update');
		expect(updateButton).toBeTruthy();
		await updateButton!.trigger('click');
		await wrapper.vm.$nextTick();
		const boardsStore = useBoardsStore();
		expect(boardsStore.getBoardById(boardId ?? MOCK_HASH[1])?.name).toBe('New board name');
		// Board name input should also be updated
		const boardNameInput = wrapper.find('input');
		expect(boardNameInput.exists()).toBe(true);
		expect((boardNameInput.element as HTMLInputElement).value).toBe('New board name');
	});

	it('navigates away if `boardId` is invalid', async () => {
		// Mock boardsStore.isValidBoardId to always return false
		const boardsStore = useBoardsStore();
		Object.defineProperty(boardsStore, 'isValidBoardId', {
			value: () => false,
			configurable: true
		});
		await mountSuspended(Board, { global: { plugins: [pinia] } });
		expect(navigateToSpy).toHaveBeenCalledWith('/boards');
	});

	it('shows and toggles the `ToggleArchivedCardsButton` via `ActionMenu`', async () => {
		const wrapper = await mountSuspended(Board, { global: { plugins: [pinia] } });
		const settingsStore = useSettingsStore();
		// Open ActionMenu
		const actionMenu = wrapper.findComponent(ActionMenu);
		expect(actionMenu.exists()).toBe(true);
		await actionMenu.find('button').trigger('click');
		await wrapper.vm.$nextTick();
		// ToggleArchivedCardsButton should now be visible
		const toggleButton = wrapper.findComponent(ToggleArchivedCardsButton);
		expect(toggleButton.exists()).toBe(true);
		// Initially false
		expect(settingsStore.showArchivedCards).toBe(false);
		await toggleButton.find('button').trigger('click');
		expect(settingsStore.showArchivedCards).toBe(true);
		await toggleButton.find('button').trigger('click');
		expect(settingsStore.showArchivedCards).toBe(false);
	});

	// TODO: Add more test cases that simulate user interactions with a board.
});
