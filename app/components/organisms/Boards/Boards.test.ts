import { describe, it, beforeEach, expect, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { BoardPreview, CreateBoardModal } from '#components';
import { useBoardsStore } from '~/stores';
import { MOCK_BOARD, MOCK_HASH } from '~/constants';
import Boards from './Boards.vue';

// Hoist and mock navigateTo globally for all tests using vi.hoisted
const { navigateToSpy } = vi.hoisted(() => ({
  navigateToSpy: vi.fn()
}));
mockNuxtImport('navigateTo', () => navigateToSpy);

mockNuxtImport('useColorMode', () => {
	const colorMode = ref('light');
	return () => colorMode;
});

let pinia: any;

// Helper to create boards in the store
function createBoardsInStore(count = 1) {
	const boardsStore = useBoardsStore();
	for (let i = 1; i <= count; i++) {
		boardsStore.createBoard({
			name: MOCK_BOARD[i as keyof typeof MOCK_BOARD].name,
			description: MOCK_BOARD[i as keyof typeof MOCK_BOARD].description,
			tags: MOCK_BOARD[i as keyof typeof MOCK_BOARD].tags,
			columns: 2
		});
	}
}

describe('Boards', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		pinia = createPinia();
		setActivePinia(pinia);
	});

	it('renders empty state when there are no boards', async () => {
		const wrapper = await mountSuspended(Boards, { global: { plugins: [pinia] } });
		expect(wrapper.text()).toContain('You have no boards');
		const createBtn = wrapper.find('button');
		expect(createBtn.exists()).toBe(true);
		expect(createBtn.text()).toContain('Create a board');
	});

	it('opens and closes the create board modal', async () => {
		const wrapper = await mountSuspended(Boards, { global: { plugins: [pinia] } });
		const createBtn = wrapper.find('button');
		await createBtn.trigger('click');
		await wrapper.vm.$nextTick();
		// Modal should be open
		const modal = wrapper.findComponent(CreateBoardModal);
		expect(modal.exists()).toBe(true);
		// Simulate cancel
		await modal.vm.$emit('cancel');
		await wrapper.vm.$nextTick();
		// Modal should be closed
		// (v-model:open is false, so modal should not be visible)
	});

	it('creates a board via the modal', async () => {
		const wrapper = await mountSuspended(Boards, { global: { plugins: [pinia] } });
		const createBtn = wrapper.find('button');
		await createBtn.trigger('click');
		await wrapper.vm.$nextTick();
		const modal = wrapper.findComponent(CreateBoardModal);
		const boardsStore = useBoardsStore();
		const spy = vi.spyOn(boardsStore, 'createBoard');
		const newBoard = { name: 'Test Board', description: 'desc', tags: ['tag'] };
		await modal.vm.$emit('create', newBoard);
		await wrapper.vm.$nextTick();
		expect(spy).toHaveBeenCalledWith(newBoard);
	});

	it('renders boards when present', async () => {
		createBoardsInStore(2);
		const wrapper = await mountSuspended(Boards, { global: { plugins: [pinia] } });
		// Should render BoardPreview for each board
		const previews = wrapper.findAllComponents(BoardPreview);
		expect(previews.length).toBe(2);
		// Should show board names
		for (let i = 1; i <= 2; i++) {
			expect(wrapper.text()).toContain(MOCK_BOARD[i as keyof typeof MOCK_BOARD].name);
		}
	});

	it('navigates to board on BoardPreview @view', async () => {
		createBoardsInStore(1);
		const wrapper = await mountSuspended(Boards, { global: { plugins: [pinia] } });
		const preview = wrapper.findComponent(BoardPreview);
		const boardsStore = useBoardsStore();
		const boardId = boardsStore.boardIds[0];
		await preview.vm.$emit('view', boardId);
		await wrapper.vm.$nextTick();
		expect(navigateToSpy).toHaveBeenCalledWith(`/boards/${boardId}`);
	});

	it('logs error if createBoard throws', async () => {
		const wrapper = await mountSuspended(Boards, { global: { plugins: [pinia] } });
		const createBtn = wrapper.find('button');
		await createBtn.trigger('click');
		await wrapper.vm.$nextTick();
		const modal = wrapper.findComponent(CreateBoardModal);
		const boardsStore = useBoardsStore();
		vi.spyOn(boardsStore, 'createBoard').mockImplementation(() => { throw new Error('fail'); });
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		await modal.vm.$emit('create', { name: 'fail' });
		await wrapper.vm.$nextTick();
		expect(errorSpy).toHaveBeenCalledWith('Error creating board:', expect.any(Error));
		errorSpy.mockRestore();
	});
});
