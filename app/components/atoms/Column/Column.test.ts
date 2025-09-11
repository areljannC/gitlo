import { vi, describe, beforeEach, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
import { generateHash, getTimestamp } from '~/shared/utils';
import { MOCK_HASH, MOCK_TIMESTAMP, MOCK_BOARD, MOCK_COLUMN, MOCK_CARD } from '~/constants';
import Column from './Column.vue';

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn()
	};
});

let pinia: any;

describe('Column', () => {
	beforeEach(() => {
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

		// create a card for column 2
		const newCardId2 = cardsStore.createCard(MOCK_COLUMN_2!.id, {
			name: MOCK_CARD[2].name,
			description: MOCK_CARD[2].description
		});
		expect(newCardId2).toBe(MOCK_HASH[5]);
		expect(cardsStore.isValidCardId(newCardId2!)).toBe(true);

		const MOCK_CARD_2 = cardsStore.getCardById(newCardId2!);
		expect(MOCK_CARD_2?.columnId).toBe(MOCK_HASH[3]);
		expect(MOCK_CARD_2?.name).toBe(MOCK_CARD[2].name);
		expect(MOCK_CARD_2?.description).toBe(MOCK_CARD[2].description);
		expect(MOCK_CARD_2?.createdAt).toBe(MOCK_TIMESTAMP[5]);
		expect(MOCK_CARD_2?.updatedAt).toBe(MOCK_TIMESTAMP[5]);

		const MOCK_COLUMN_1_UPDATED = columnsStore.getColumnById(MOCK_HASH[2]);
		expect(MOCK_COLUMN_1_UPDATED?.name).toBe(MOCK_COLUMN[1].name);
		expect(MOCK_COLUMN_1_UPDATED?.boardId).toBe(newBoardId);
		expect(MOCK_COLUMN_1_UPDATED?.createdAt).toBe(MOCK_TIMESTAMP[1]);
		expect(MOCK_COLUMN_1_UPDATED?.updatedAt).toBe(MOCK_TIMESTAMP[4]);

		const MOCK_COLUMN_2_UPDATED = columnsStore.getColumnById(MOCK_HASH[3]);
		expect(MOCK_COLUMN_2_UPDATED?.name).toBe(MOCK_COLUMN[2].name);
		expect(MOCK_COLUMN_2_UPDATED?.boardId).toBe(newBoardId);
		expect(MOCK_COLUMN_2_UPDATED?.createdAt).toBe(MOCK_TIMESTAMP[1]);
		expect(MOCK_COLUMN_2_UPDATED?.updatedAt).toBe(MOCK_TIMESTAMP[5]);

		const MOCK_BOARD_UPDATED = boardsStore.getBoardById(newBoardId!);
		expect(MOCK_BOARD_UPDATED?.name).toBe(MOCK_BOARD[1].name);
		expect(MOCK_BOARD_UPDATED?.description).toBe(MOCK_BOARD[1].description);
		expect(MOCK_BOARD_UPDATED?.tags).toEqual(MOCK_BOARD[1].tags);
		expect(MOCK_BOARD_UPDATED?.columnIds).toEqual([MOCK_HASH[2], MOCK_HASH[3]]);
		expect(MOCK_BOARD_UPDATED?.createdAt).toBe(MOCK_TIMESTAMP[1]);
		expect(MOCK_BOARD_UPDATED?.updatedAt).toBe(MOCK_TIMESTAMP[5]);
	});

	it('should render a column with a name', async () => {
		const wrapper = await mountSuspended(Column, {
			global: { plugins: [pinia] },
			props: { columnId: MOCK_HASH[2] }
		});

		const columnNameInput = wrapper.get('input[type="text"]');
		expect((columnNameInput.element as HTMLInputElement).value).toBe(MOCK_COLUMN[1].name);
	});

	it('should render a card with a name in the column', async () => {
		const wrapper = await mountSuspended(Column, {
			global: { plugins: [pinia] },
			props: { columnId: MOCK_HASH[2] }
		});

		const columnNameInput = wrapper.get('input[type="text"]');
		expect((columnNameInput.element as HTMLInputElement).value).toBe(MOCK_COLUMN[1].name);

		const cardNameInput = wrapper.get('textarea');
		expect(cardNameInput.element.value).toBe(MOCK_CARD[1].name);
	});

	it('should update the column name', async () => {
		const columnsStore = useColumnsStore();
		const wrapper = await mountSuspended(Column, {
			global: { plugins: [pinia] },
			props: { columnId: MOCK_HASH[2] }
		});

		const columnNameInput = wrapper.get('input[type="text"]');
		expect((columnNameInput.element as HTMLInputElement).value).toBe(MOCK_COLUMN[1].name);

		await columnNameInput.trigger('focus');
		await wrapper.vm.$nextTick();

		await columnNameInput.setValue('Updated Column Name');
		await wrapper.vm.$nextTick();

		await columnNameInput.trigger('blur');
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();

		expect((columnNameInput.element as HTMLInputElement).value).toBe('Updated Column Name');
		expect(columnsStore.getColumnById(MOCK_HASH[2])?.name).toBe('Updated Column Name');
	});

	it('should update the column name when `Enter` is pressed', async () => {
		const columnsStore = useColumnsStore();
		const wrapper = await mountSuspended(Column, {
			global: { plugins: [pinia] },
			props: { columnId: MOCK_HASH[2] }
		});

		const columnNameInput = wrapper.get('input[type="text"]');
		expect((columnNameInput.element as HTMLInputElement).value).toBe(MOCK_COLUMN[1].name);

		await columnNameInput.trigger('focus');
		await wrapper.vm.$nextTick();

		await columnNameInput.setValue('Updated Column Name');
		await wrapper.vm.$nextTick();

		await columnNameInput.trigger('keydown', { key: 'Enter' });
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();

		expect((columnNameInput.element as HTMLInputElement).value).toBe('Updated Column Name');
		expect(columnsStore.getColumnById(MOCK_HASH[2])?.name).toBe('Updated Column Name');
	});

	it('should archive the column when the archive button is clicked', async () => {
		const columnsStore = useColumnsStore();
		const wrapper = await mountSuspended(Column, {
			global: { plugins: [pinia] },
			props: { columnId: MOCK_HASH[2] }
		});

		const columnNameInput = wrapper.get('input[type="text"]');
		expect((columnNameInput.element as HTMLInputElement).value).toBe(MOCK_COLUMN[1].name);

		const cardNameInput = wrapper.get('textarea');
		expect(cardNameInput.element.value).toBe(MOCK_CARD[1].name);

		let buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		const archiveButton = buttons[1];
		expect(archiveButton.exists()).toBe(true);
		expect(archiveButton.text()).toBe('Archive');

		await archiveButton.trigger('click');
		await wrapper.vm.$nextTick();
		expect(columnsStore.getColumnById(MOCK_HASH[2])?.archived).toBe(true);

		buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(3);

		const unarchiveButton = buttons[1];
		expect(unarchiveButton.exists()).toBe(true);
		expect(unarchiveButton.text()).toBe('Unarchive');
	});

	it('should unarchive the column when the unarchive button is clicked', async () => {
		const columnsStore = useColumnsStore();
		const wrapper = await mountSuspended(Column, {
			global: { plugins: [pinia] },
			props: { columnId: MOCK_HASH[2] }
		});

		const columnNameInput = wrapper.get('input[type="text"]');
		expect((columnNameInput.element as HTMLInputElement).value).toBe(MOCK_COLUMN[1].name);

		const cardNameInput = wrapper.get('textarea');
		expect(cardNameInput.element.value).toBe(MOCK_CARD[1].name);

		let buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		const archiveButton = buttons[1];
		expect(archiveButton.exists()).toBe(true);
		expect(archiveButton.text()).toBe('Archive');

		await archiveButton.trigger('click');
		await wrapper.vm.$nextTick();
		expect(columnsStore.getColumnById(MOCK_HASH[2])?.archived).toBe(true);

		buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(3);

		const unarchiveButton = buttons[1];
		expect(unarchiveButton.exists()).toBe(true);
		expect(unarchiveButton.text()).toBe('Unarchive');

		await unarchiveButton.trigger('click');
		await wrapper.vm.$nextTick();
		expect(columnsStore.getColumnById(MOCK_HASH[2])?.archived).toBe(false);

		buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);
		expect(archiveButton.exists()).toBe(true);
		expect(archiveButton.text()).toBe('Archive');
	});

	it('should delete the column when the delete button is clicked', async () => {
		const columnsStore = useColumnsStore();
		const wrapper = await mountSuspended(Column, {
			global: { plugins: [pinia] },
			props: { columnId: MOCK_HASH[2] }
		});

		const columnNameInput = wrapper.get('input[type="text"]');
		expect((columnNameInput.element as HTMLInputElement).value).toBe(MOCK_COLUMN[1].name);

		const cardNameInput = wrapper.get('textarea');
		expect(cardNameInput.element.value).toBe(MOCK_CARD[1].name);

		let buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		const archiveButton = buttons[1];
		expect(archiveButton.exists()).toBe(true);
		expect(archiveButton.text()).toBe('Archive');

		await archiveButton.trigger('click');
		await wrapper.vm.$nextTick();
		expect(columnsStore.getColumnById(MOCK_HASH[2])?.archived).toBe(true);

		buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(3);

		const deleteButton = buttons[2];
		expect(deleteButton.exists()).toBe(true);
		expect(deleteButton.text()).toBe('Delete');

		await deleteButton.trigger('click');
		await wrapper.vm.$nextTick();
		expect(columnsStore.isValidColumnId(MOCK_HASH[2])).toBe(false);
		expect(columnsStore.getColumnById(MOCK_HASH[2])).toBeUndefined();
	});

	it('should log an error if updating the column name fails', async () => {
		const columnsStore = useColumnsStore();
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(columnsStore, 'updateColumn').mockImplementation(() => {
			throw new Error('Update failed');
		});

		const wrapper = await mountSuspended(Column, {
			global: { plugins: [pinia] },
			props: { columnId: MOCK_HASH[2] }
		});

		const columnNameInput = wrapper.get('input[type="text"]');
		expect((columnNameInput.element as HTMLInputElement).value).toBe(MOCK_COLUMN[1].name);

		await columnNameInput.trigger('focus');
		await wrapper.vm.$nextTick();

		await columnNameInput.setValue('Updated Column Name');
		await wrapper.vm.$nextTick();

		await columnNameInput.trigger('blur');
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();

		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

		consoleErrorSpy.mockRestore();
	});
});
