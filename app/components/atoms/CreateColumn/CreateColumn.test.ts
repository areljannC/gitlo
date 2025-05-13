import { vi, describe, beforeEach, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
import { generateHash, getTimestamp } from '~/shared/utils';
import { MOCK_HASH, MOCK_TIMESTAMP, MOCK_BOARD, MOCK_COLUMN, MOCK_CARD } from '~/constants';
import CreateColumn from './CreateColumn.vue';

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn()
	};
});

let pinia: any;

describe('CreateColumn', () => {
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

	it('should render an input field for the name of the column', async () => {
		const wrapper = await mountSuspended(CreateColumn, {
			global: { plugins: [pinia] },
			props: { boardId: MOCK_HASH[1] }
		});
		const columnNameInput = wrapper.find('input');
		expect(columnNameInput.exists()).toBe(true);
		expect(columnNameInput.attributes('placeholder')).toBe('Enter new column name...');
		expect(columnNameInput.element.value).toBe('');
	});

	it('should update the input field value when typing', async () => {
		const wrapper = await mountSuspended(CreateColumn, {
			global: { plugins: [pinia] },
			props: { boardId: MOCK_HASH[1] }
		});

		const columnNameInput = wrapper.find('input');
		columnNameInput.trigger('focus');
		await wrapper.vm.$nextTick();

		columnNameInput.setValue('New Column');
		await wrapper.vm.$nextTick();
		expect(columnNameInput.element.value).toBe('New Column');
	});

	it('should create a column when pressing `Enter` key', async () => {
		const boardsStore = useBoardsStore();
		const columnsStore = useColumnsStore();
		const wrapper = await mountSuspended(CreateColumn, {
			global: { plugins: [pinia] },
			props: { boardId: MOCK_HASH[1] }
		});

		const columnNameInput = wrapper.find('input');
		columnNameInput.trigger('focus');
		await wrapper.vm.$nextTick();

		columnNameInput.setValue('New Column');
		await wrapper.vm.$nextTick();
		expect(columnNameInput.element.value).toBe('New Column');
		expect(boardsStore.getBoardById(MOCK_HASH[1])?.columnIds).toHaveLength(2);
		expect(columnsStore.isValidColumnId(MOCK_HASH[6])).toBe(false);

		vi.mocked(generateHash).mockReturnValueOnce(MOCK_HASH[6]);
		columnNameInput.trigger('keydown', { key: 'Enter' });
		await wrapper.vm.$nextTick();

		expect(columnNameInput.element.value).toBe('');
		expect(columnsStore.isValidColumnId(MOCK_HASH[6])).toBe(true);
		expect(columnsStore.getColumnById(MOCK_HASH[6])?.name).toBe('New Column');
		expect(columnsStore.getColumnById(MOCK_HASH[6])?.boardId).toBe(MOCK_HASH[1]);
		expect(boardsStore.getBoardById(MOCK_HASH[1])?.columnIds).toEqual([MOCK_HASH[2], MOCK_HASH[3], MOCK_HASH[6]]);
	});

	it('should create a column when input field is blurred', async () => {
		const boardsStore = useBoardsStore();
		const columnsStore = useColumnsStore();
		const wrapper = await mountSuspended(CreateColumn, {
			global: { plugins: [pinia] },
			props: { boardId: MOCK_HASH[1] }
		});

		const columnNameInput = wrapper.find('input');
		columnNameInput.trigger('focus');
		await wrapper.vm.$nextTick();

		columnNameInput.setValue('New Column');
		await wrapper.vm.$nextTick();
		expect(columnNameInput.element.value).toBe('New Column');
		expect(boardsStore.getBoardById(MOCK_HASH[1])?.columnIds).toHaveLength(2);
		expect(columnsStore.isValidColumnId(MOCK_HASH[6])).toBe(false);

		vi.mocked(generateHash).mockReturnValueOnce(MOCK_HASH[6]);
		columnNameInput.trigger('blur');
		await wrapper.vm.$nextTick();

		expect(columnNameInput.element.value).toBe('');
		expect(columnsStore.isValidColumnId(MOCK_HASH[6])).toBe(true);
		expect(columnsStore.getColumnById(MOCK_HASH[6])?.name).toBe('New Column');
		expect(columnsStore.getColumnById(MOCK_HASH[6])?.boardId).toBe(MOCK_HASH[1]);
		expect(boardsStore.getBoardById(MOCK_HASH[1])?.columnIds).toEqual([MOCK_HASH[2], MOCK_HASH[3], MOCK_HASH[6]]);
	});

	it('should not create a column when input field is empty', async () => {
		const boardsStore = useBoardsStore();
		const columnsStore = useColumnsStore();
		const wrapper = await mountSuspended(CreateColumn, {
			global: { plugins: [pinia] },
			props: { boardId: MOCK_HASH[1] }
		});

		const columnNameInput = wrapper.find('input');
		columnNameInput.trigger('focus');
		await wrapper.vm.$nextTick();

		columnNameInput.setValue('New Column');
		await wrapper.vm.$nextTick();
		expect(columnNameInput.element.value).toBe('New Column');
		expect(boardsStore.getBoardById(MOCK_HASH[1])?.columnIds).toHaveLength(2);
		expect(columnsStore.isValidColumnId(MOCK_HASH[6])).toBe(false);

		columnNameInput.setValue('');
		await wrapper.vm.$nextTick();
		expect(columnNameInput.element.value).toBe('');

		vi.mocked(generateHash).mockReturnValueOnce(MOCK_HASH[6]);
		columnNameInput.trigger('blur');
		await wrapper.vm.$nextTick();

		expect(columnNameInput.element.value).toBe('');
		expect(columnsStore.isValidColumnId(MOCK_HASH[6])).toBe(false);
		expect(boardsStore.getBoardById(MOCK_HASH[1])?.columnIds).toEqual([MOCK_HASH[2], MOCK_HASH[3]]);
	});

	it('should log an error if creating a column fails', async () => {
		const columnStore = useColumnsStore();
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(columnStore, 'createColumn').mockImplementation(() => {
			throw new Error('Failed to create column');
		});

		const wrapper = await mountSuspended(CreateColumn, {
			global: { plugins: [pinia] },
			props: { boardId: MOCK_HASH[1] }
		});

		const columnNameInput = wrapper.find('input');
		columnNameInput.trigger('focus');
		await wrapper.vm.$nextTick();

		columnNameInput.setValue('New Column');
		await wrapper.vm.$nextTick();
		expect(columnNameInput.element.value).toBe('New Column');

		vi.mocked(generateHash).mockReturnValueOnce(MOCK_HASH[6]);
		columnNameInput.trigger('keydown', { key: 'Enter' });
		await wrapper.vm.$nextTick();

		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

		consoleErrorSpy.mockRestore();
	});
});
