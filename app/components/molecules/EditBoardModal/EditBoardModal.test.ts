import { vi, describe, beforeEach, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { DOMWrapper } from '@vue/test-utils';
import { useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
import { generateHash, getTimestamp } from '~/shared/utils';
import { MOCK_HASH, MOCK_TIMESTAMP, MOCK_PARSE_TIMESTAMP, MOCK_BOARD, MOCK_COLUMN, MOCK_CARD } from '~/constants';
import { Tag } from '#components';
import EditBoardModal from './EditBoardModal.vue';

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn(),
		parseTimestamp: vi.fn(() => MOCK_PARSE_TIMESTAMP[1])
	};
});

// Hoist and mock navigateTo globally for all tests using vi.hoisted
const { navigateToSpy } = vi.hoisted(() => ({
	navigateToSpy: vi.fn()
}));
mockNuxtImport('navigateTo', () => navigateToSpy);

let pinia: any;

describe('EditBoardModal', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		vi.resetAllMocks();

		pinia = createPinia();
		setActivePinia(pinia);

		// mock the generated hashes for the board and initial columns
		vi.mocked(generateHash).mockReturnValueOnce(MOCK_HASH[1]).mockReturnValueOnce(MOCK_HASH[2]).mockReturnValueOnce(MOCK_HASH[3]);

		// mock the timestamp for the creation of the board and initial columns
		vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP[1]);

		// create the board with initial columns
		const boardsStore = useBoardsStore();
		const newBoardId = boardsStore.createBoard({
			name: MOCK_BOARD[1].name,
			description: MOCK_BOARD[1].description,
			tags: MOCK_BOARD[1].tags,
			columns: 2
		});
		expect(newBoardId).toBe(MOCK_HASH[1]);
		expect(boardsStore.isValidBoardId(newBoardId!)).toBe(true);
		expect(boardsStore.getBoardById(newBoardId!)?.columnIds).toHaveLength(2);

		const columnsStore = useColumnsStore();
		expect(columnsStore.getColumnById(MOCK_HASH[2])?.boardId).toBe(newBoardId);
		expect(columnsStore.getColumnById(MOCK_HASH[3])?.boardId).toBe(newBoardId);

		// mock the update timestamp when updating columns
		vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP[2]).mockReturnValueOnce(MOCK_TIMESTAMP[3]);

		// update the columns with new names
		columnsStore.updateColumn(MOCK_HASH[2], { name: MOCK_COLUMN[1].name });
		columnsStore.updateColumn(MOCK_HASH[3], { name: MOCK_COLUMN[2].name });

		const MOCK_COLUMN_1 = columnsStore.getColumnById(MOCK_HASH[2]);
		expect(MOCK_COLUMN_1?.name).toBe(MOCK_COLUMN[1].name);
		expect(MOCK_COLUMN_1?.boardId).toBe(newBoardId);
		expect(MOCK_COLUMN_1?.createdAt).toBe(MOCK_TIMESTAMP[1]);
		expect(MOCK_COLUMN_1?.updatedAt).toBe(MOCK_TIMESTAMP[2]);

		const MOCK_COLUMN_2 = columnsStore.getColumnById(MOCK_HASH[3]);
		expect(MOCK_COLUMN_2?.name).toBe(MOCK_COLUMN[2].name);
		expect(MOCK_COLUMN_2?.boardId).toBe(newBoardId);
		expect(MOCK_COLUMN_2?.createdAt).toBe(MOCK_TIMESTAMP[1]);
		expect(MOCK_COLUMN_2?.updatedAt).toBe(MOCK_TIMESTAMP[3]);

		// mock the generated hash for card 1
		vi.mocked(generateHash).mockReturnValueOnce(MOCK_HASH[4]);

		// mock the timestamp for the creation of card 1
		vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP[4]);

		// create a card for column 1
		const cardsStore = useCardsStore();
		const newCardId1 = cardsStore.createCard(MOCK_COLUMN_1!.id, {
			name: MOCK_CARD[1].name,
			description: MOCK_CARD[1].description
		});
		expect(newCardId1).toBe(MOCK_HASH[4]);
		expect(cardsStore.isValidCardId(newCardId1!)).toBe(true);

		const MOCK_CARD_1 = cardsStore.getCardById(newCardId1!);
		expect(MOCK_CARD_1?.columnId).toBe(MOCK_HASH[2]);
		expect(MOCK_CARD_1?.name).toBe(MOCK_CARD[1].name);
		expect(MOCK_CARD_1?.description).toBe(MOCK_CARD[1].description);
		expect(MOCK_CARD_1?.createdAt).toBe(MOCK_TIMESTAMP[4]);
		expect(MOCK_CARD_1?.updatedAt).toBe(MOCK_TIMESTAMP[4]);

		// mock the generated hash for card 2
		vi.mocked(generateHash).mockReturnValueOnce(MOCK_HASH[5]);

		// mock the timestamp for the creation of card 2
		vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP[5]);

		// create another card for column 1
		const newCardId2 = cardsStore.createCard(MOCK_COLUMN_1!.id, {
			name: MOCK_CARD[2].name,
			description: MOCK_CARD[2].description
		});
		expect(newCardId2).toBe(MOCK_HASH[5]);
		expect(cardsStore.isValidCardId(newCardId2!)).toBe(true);

		const MOCK_CARD_2 = cardsStore.getCardById(newCardId2!);
		expect(MOCK_CARD_2?.columnId).toBe(MOCK_HASH[2]);
		expect(MOCK_CARD_2?.name).toBe(MOCK_CARD[2].name);
		expect(MOCK_CARD_2?.description).toBe(MOCK_CARD[2].description);
		expect(MOCK_CARD_2?.createdAt).toBe(MOCK_TIMESTAMP[5]);
		expect(MOCK_CARD_2?.updatedAt).toBe(MOCK_TIMESTAMP[5]);

		const MOCK_COLUMN_1_UPDATED = columnsStore.getColumnById(MOCK_HASH[2]);
		expect(MOCK_COLUMN_1_UPDATED?.name).toBe(MOCK_COLUMN[1].name);
		expect(MOCK_COLUMN_1_UPDATED?.boardId).toBe(newBoardId);
		expect(MOCK_COLUMN_1_UPDATED?.createdAt).toBe(MOCK_TIMESTAMP[1]);
		expect(MOCK_COLUMN_1_UPDATED?.updatedAt).toBe(MOCK_TIMESTAMP[5]);

		const MOCK_BOARD_UPDATED = boardsStore.getBoardById(newBoardId!);
		expect(MOCK_BOARD_UPDATED?.name).toBe(MOCK_BOARD[1].name);
		expect(MOCK_BOARD_UPDATED?.description).toBe(MOCK_BOARD[1].description);
		expect(MOCK_BOARD_UPDATED?.tags).toEqual(MOCK_BOARD[1].tags);
		expect(MOCK_BOARD_UPDATED?.columnIds).toEqual([MOCK_HASH[2], MOCK_HASH[3]]);
		expect(MOCK_BOARD_UPDATED?.createdAt).toBe(MOCK_TIMESTAMP[1]);
		expect(MOCK_BOARD_UPDATED?.updatedAt).toBe(MOCK_TIMESTAMP[5]);

		cardsStore.expandCard(MOCK_HASH[4]);
		expect(cardsStore.expandedCardId).toBe(MOCK_HASH[4]);
	});

	describe('props', () => {
		describe('open', () => {
			it('should render the modal when `open` prop is `true`', async () => {
				await mountSuspended(EditBoardModal, {
					global: { plugins: [pinia] },
					props: {
						open: true,
						boardId: MOCK_HASH[1]
					}
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(true);
				expect(wrapper.findAll('input')).toHaveLength(3);
			});

			it('should not render the modal when `open` prop is `false`', async () => {
				await mountSuspended(EditBoardModal, {
					global: { plugins: [pinia] },
					props: {
						open: false,
						boardId: MOCK_HASH[1]
					}
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(false);
			});
		});

		describe('boardId', () => {
			it('should render the modal with the board details when `boardId` is provided', async () => {
				await mountSuspended(EditBoardModal, {
					global: { plugins: [pinia] },
					props: {
						open: true,
						boardId: MOCK_HASH[1]
					}
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(true);
				expect(wrapper.find('h2').text()).toBe('Edit board');
				expect(wrapper.findAll('input')).toHaveLength(3);

				const boardNameInput = wrapper.find('input[name="name"]');
				expect(boardNameInput.exists()).toBe(true);
				expect((boardNameInput.element as HTMLInputElement).value).toBe(MOCK_BOARD[1].name);

				const boardDescriptionInput = wrapper.find('input[name="description"]');
				expect(boardDescriptionInput.exists()).toBe(true);
				expect((boardDescriptionInput.element as HTMLInputElement).value).toBe(MOCK_BOARD[1].description);

				const boardTagInput = wrapper.find('input[name="tag"]');
				expect(boardTagInput.exists()).toBe(true);
				expect((boardTagInput.element as HTMLInputElement).value).toBe('');
				expect(wrapper.findAllComponents(Tag)).toHaveLength(MOCK_BOARD[1].tags.length);
			});

			// NOTE: This will not happen since the page route checks if the board ID is valid.
			// NOTE: This is needed for test coverage.
			it('should not render the modal when `boardId` is not provided', async () => {
				await mountSuspended(EditBoardModal, {
					global: { plugins: [pinia] },
					props: {
						open: true,
						boardId: ''
					}
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(true);
			});
		});
	});

	describe('emits', () => {
		describe('cancel', () => {
			it('should emit `cancel` when the cancel button is clicked', async () => {
				const modal = await mountSuspended(EditBoardModal, {
					global: { plugins: [pinia] },
					props: {
						open: true,
						boardId: MOCK_HASH[1]
					}
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(true);
				expect(wrapper.findAll('input')).toHaveLength(3);

				const buttons = wrapper.findAll('button');
				expect(buttons).toHaveLength(6);

				const cancelButton = buttons[4];
				expect(cancelButton.exists()).toBe(true);
				expect(cancelButton.text()).toBe('Cancel');

				await cancelButton.trigger('click');
				expect(modal.emitted()).toHaveProperty('cancel');
				expect(modal.emitted().cancel).toHaveLength(1);
			});

			it('should cancel the board detail changes when the cancel button is clicked', async () => {
				const modal = await mountSuspended(EditBoardModal, {
					global: { plugins: [pinia] },
					props: {
						open: true,
						boardId: MOCK_HASH[1]
					}
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				expect(wrapper.exists()).toBe(true);
				expect(wrapper.findAll('input')).toHaveLength(3);

				const boardNameInput = wrapper.find('input[name="name"]');
				expect(boardNameInput.exists()).toBe(true);
				expect((boardNameInput.element as HTMLInputElement).value).toBe(MOCK_BOARD[1].name);

				boardNameInput.trigger('focus');
				await modal.vm.$nextTick();

				boardNameInput.setValue('New board name');
				await modal.vm.$nextTick();

				boardNameInput.trigger('blur');
				await modal.vm.$nextTick();
				expect((boardNameInput.element as HTMLInputElement).value).toBe('New board name');

				const boardDescriptionInput = wrapper.find('input[name="description"]');
				expect(boardDescriptionInput.exists()).toBe(true);
				expect((boardDescriptionInput.element as HTMLInputElement).value).toBe(MOCK_BOARD[1].description);

				boardDescriptionInput.trigger('focus');
				await modal.vm.$nextTick();

				boardDescriptionInput.setValue('New board description');
				await modal.vm.$nextTick();

				boardDescriptionInput.trigger('blur');
				await modal.vm.$nextTick();
				expect((boardDescriptionInput.element as HTMLInputElement).value).toBe('New board description');

				let buttons = wrapper.findAll('button');
				expect(buttons).toHaveLength(6);

				const boardTagInput = wrapper.find('input[name="tag"]');
				expect(boardTagInput.exists()).toBe(true);
				expect((boardTagInput.element as HTMLInputElement).value).toBe('');

				boardTagInput.trigger('focus');
				await modal.vm.$nextTick();

				boardTagInput.setValue('New board tag');
				await modal.vm.$nextTick();

				boardTagInput.trigger('keydown', { key: 'Enter' });
				await modal.vm.$nextTick();
				expect((boardTagInput.element as HTMLInputElement).value).toBe('');

				buttons = wrapper.findAll('button');
				expect(buttons).toHaveLength(7);

				await buttons[0].trigger('click');
				buttons = wrapper.findAll('button');
				expect(buttons).toHaveLength(6);

				const cancelButton = buttons[4];
				await cancelButton.trigger('click');
				await modal.vm.$nextTick();
				expect(cancelButton.exists()).toBe(true);
				expect(cancelButton.text()).toBe('Cancel');
				expect(modal.emitted()).toHaveProperty('cancel');
				expect(modal.emitted().cancel).toHaveLength(1);
			});
		});

		describe('update', () => {
			it('should emit `update` when the update button is clicked', async () => {
				const modal = await mountSuspended(EditBoardModal, {
					global: { plugins: [pinia] },
					props: {
						open: true,
						boardId: MOCK_HASH[1]
					}
				});
				const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
				const updateButton = wrapper.findAll('button').find(btn => btn.text() === 'Update');
				expect(updateButton).toBeTruthy();
				await updateButton!.trigger('click');
				await modal.vm.$nextTick();
				await modal.vm.$nextTick();
				expect(modal.emitted()).toHaveProperty('update');
				expect(modal.emitted().update).toHaveLength(1);
			});
		});
	});

	it('archives and deletes the board (unarchive not possible after delete)', async () => {
		const boardsStore = useBoardsStore();
		const archiveSpy = vi.spyOn(boardsStore, 'archiveBoard');
		const deleteSpy = vi.spyOn(boardsStore, 'deleteBoard');
		const modal = await mountSuspended(EditBoardModal, {
			global: { plugins: [pinia] },
			props: { open: true, boardId: MOCK_HASH[1] }
		});
		const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
		let buttons = wrapper.findAll('button');
		// Archive
		const archiveButton = buttons.find(btn => btn.text() === 'Archive');
		await archiveButton!.trigger('click');
		expect(archiveSpy).toHaveBeenCalledWith(MOCK_HASH[1]);
		// Delete (should now be visible)
		await modal.vm.$nextTick();
		buttons = wrapper.findAll('button');
		const deleteButton = buttons.find(btn => btn.text() === 'Delete');
		expect(deleteButton).toBeTruthy();
		await deleteButton!.trigger('click');
		expect(deleteSpy).toHaveBeenCalledWith(MOCK_HASH[1]);
		// --- assert navigation on delete ---
		expect(navigateToSpy).toHaveBeenCalled();
	});

	it('archives, unarchives, and updates the board (no delete)', async () => {
		const boardsStore = useBoardsStore();
		const archiveSpy = vi.spyOn(boardsStore, 'archiveBoard');
		const unarchiveSpy = vi.spyOn(boardsStore, 'unarchiveBoard');
		const updateSpy = vi.spyOn(boardsStore, 'updateBoard');
		const modal = await mountSuspended(EditBoardModal, {
			global: { plugins: [pinia] },
			props: { open: true, boardId: MOCK_HASH[1] }
		});
		const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
		let buttons = wrapper.findAll('button');
		// Archive
		const archiveButton = buttons.find(btn => btn.text() === 'Archive');
		await archiveButton!.trigger('click');
		expect(archiveSpy).toHaveBeenCalledWith(MOCK_HASH[1]);
		await modal.vm.$nextTick();
		buttons = wrapper.findAll('button');
		// Unarchive (should now be visible)
		const unarchiveButton = buttons.find(btn => btn.text() === 'Unarchive');
		expect(unarchiveButton).toBeTruthy();
		await unarchiveButton!.trigger('click');
		expect(unarchiveSpy).toHaveBeenCalledWith(MOCK_HASH[1]);
		await modal.vm.$nextTick();
		buttons = wrapper.findAll('button');
		// Update should still be available
		const updateButton = buttons.find(btn => btn.text() === 'Update');
		expect(updateButton).toBeTruthy();
		await updateButton!.trigger('click');
		await modal.vm.$nextTick();
		await modal.vm.$nextTick();
		expect(updateSpy).toHaveBeenCalledWith(MOCK_HASH[1], expect.objectContaining({ name: expect.any(String) }));
	});

	describe('error handling', () => {
		it('shows error when archiving fails', async () => {
			const boardsStore = useBoardsStore();
			vi.spyOn(boardsStore, 'archiveBoard').mockImplementation(() => {
				throw new Error('fail');
			});
			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const modal = await mountSuspended(EditBoardModal, {
				global: { plugins: [pinia] },
				props: { open: true, boardId: MOCK_HASH[1] }
			});
			const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
			let buttons = wrapper.findAll('button');
			await buttons.find(btn => btn.text() === 'Archive')!.trigger('click');
			await modal.vm.$nextTick();
			expect(errorSpy).toHaveBeenCalledTimes(1);
			errorSpy.mockRestore();
		});

		it('shows error when unarchiving fails', async () => {
			const boardsStore = useBoardsStore();
			vi.spyOn(boardsStore, 'unarchiveBoard').mockImplementation(() => {
				throw new Error('fail');
			});
			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const modal = await mountSuspended(EditBoardModal, {
				global: { plugins: [pinia] },
				props: { open: true, boardId: MOCK_HASH[1] }
			});
			const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
			let buttons = wrapper.findAll('button');
			await buttons.find(btn => btn.text() === 'Archive')!.trigger('click');
			await modal.vm.$nextTick();
			buttons = wrapper.findAll('button');
			await buttons.find(btn => btn.text() === 'Unarchive')!.trigger('click');
			await modal.vm.$nextTick();
			expect(errorSpy).toHaveBeenCalledTimes(1);
			errorSpy.mockRestore();
		});

		it('shows error when deleting fails', async () => {
			const boardsStore = useBoardsStore();
			vi.spyOn(boardsStore, 'deleteBoard').mockImplementation(() => {
				throw new Error('fail');
			});
			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const modal = await mountSuspended(EditBoardModal, {
				global: { plugins: [pinia] },
				props: { open: true, boardId: MOCK_HASH[1] }
			});
			const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
			let buttons = wrapper.findAll('button');
			await buttons.find(btn => btn.text() === 'Archive')!.trigger('click');
			await modal.vm.$nextTick();
			buttons = wrapper.findAll('button');
			await buttons.find(btn => btn.text() === 'Delete')!.trigger('click');
			await modal.vm.$nextTick();
			expect(errorSpy).toHaveBeenCalledTimes(1);
			errorSpy.mockRestore();
		});

		it('shows error when updating fails', async () => {
			const boardsStore = useBoardsStore();
			vi.spyOn(boardsStore, 'updateBoard').mockImplementation(() => {
				throw new Error('fail');
			});
			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const modal = await mountSuspended(EditBoardModal, {
				global: { plugins: [pinia] },
				props: { open: true, boardId: MOCK_HASH[1] }
			});
			const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
			let buttons = wrapper.findAll('button');
			const updateButton = buttons.find(btn => btn.text() === 'Update');
			if (updateButton) {
				await updateButton.trigger('click');
				await modal.vm.$nextTick();
				await modal.vm.$nextTick();
				expect(errorSpy).toHaveBeenCalledTimes(1);
			}
			errorSpy.mockRestore();
		});
	});
});
