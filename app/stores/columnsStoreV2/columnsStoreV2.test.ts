import { describe, beforeEach, it, vi, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { generateHash, getTimestamp } from '~/shared/utils';
import { BoardError, ColumnError } from '~/shared/errors';
import { BOARD_ERROR, COLUMN_ERROR } from '~/constants';
import { useBoardsStore, useColumnsStore, useCardsStore } from '../';

const MOCK_HASH = 'MOCK_HASH';
const MOCK_TIMESTAMP = 'MOCK_TIMESTAMP';
const MOCK_BOARD_ID = `${MOCK_HASH}_BOARD_ID`;
const MOCK_BOARD_NAME = 'MOCK_BOARD_NAME';
const MOCK_BOARD_DESCRIPTION = 'MOCK_BOARD_DESCRIPTION';
const MOCK_BOARD_TAGS = ['MOCK_TAG_1', 'MOCK_TAG_2'];
const MOCK_COLUMN_ID = `${MOCK_HASH}_COLUMN_ID`;
const MOCK_COLUMN_1_ID = `${MOCK_HASH}_COLUMN_1_ID`;
const MOCK_COLUMN_2_ID = `${MOCK_HASH}_COLUMN_2_ID`;
const MOCK_COLUMN_DUPLICATE_ID = `${MOCK_HASH}_COLUMN_DUPLICATE_ID`;
const MOCK_COLUMN_NAME = 'MOCK_COLUMN_NAME';

const MOCK_TIMESTAMP_UPDATED = 'MOCK_TIMESTAMP_UPDATED';
const MOCK_TIMESTAMP_UPDATED_1 = 'MOCK_TIMESTAMP_UPDATED_1';
const MOCK_TIMESTAMP_UPDATED_2 = 'MOCK_TIMESTAMP_UPDATED_2';
const MOCK_COLUMN_NAME_UPDATED = 'MOCK_COLUMN_NAME_UPDATED';
const MOCK_CARD_1_ID = `${MOCK_HASH}_CARD_1_ID`;
const MOCK_CARD_2_ID = `${MOCK_HASH}_CARD_2_ID`;
const MOCK_CARD_3_ID = `${MOCK_HASH}_CARD_3_ID`;
const MOCK_CARD_4_ID = `${MOCK_HASH}_CARD_4_ID`;
const MOCK_CARD_5_ID = `${MOCK_HASH}_CARD_5_ID`;
const MOCK_CARD_6_ID = `${MOCK_HASH}_CARD_6_ID`;

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn(() => MOCK_TIMESTAMP)
	};
});

describe('Columns Store', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		setActivePinia(createPinia());
	});

	describe('state', () => {
		it('should have the correct initial state', () => {
			const columnsStore = useColumnsStore();
			expect(columnsStore.columnMap).toEqual({});
		});
	});

	describe('actions', () => {
		describe('createColumn', () => {
			it('should create a new column and return its ID', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 1
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.boardId).toBe(MOCK_BOARD_ID);

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_COLUMN_2_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED);

				const newColumnId = columnsStore.createColumn(newBoardId!, {
					name: MOCK_COLUMN_NAME
				});

				expect(newColumnId).toBe(MOCK_COLUMN_2_ID);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_2_ID)).toBe(true);
				expect(columnsStore.getColumnById(newColumnId!)?.boardId).toBe(MOCK_BOARD_ID!);
				expect(columnsStore.getColumnById(newColumnId!)?.name).toBe(MOCK_COLUMN_NAME);
				expect(boardsStore.getBoardById(newBoardId!)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);
			});

			it('should throw an error if board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const columnsStore = useColumnsStore();
				expect(() => columnsStore.createColumn('INVALID_BOARD_ID')).toThrow(new BoardError(BOARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(COLUMN_ERROR.CREATE_COLUMN);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if column ID already exists', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_DUPLICATE_ID).mockReturnValueOnce(MOCK_COLUMN_DUPLICATE_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 1
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_DUPLICATE_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_DUPLICATE_ID)?.boardId).toBe(MOCK_BOARD_ID);

				expect(() => columnsStore.createColumn(newBoardId!, {})).toThrow(new ColumnError(COLUMN_ERROR.ID_ALREADY_EXISTS));
				expect(consoleErrorSpy).toHaveBeenCalledWith(COLUMN_ERROR.CREATE_COLUMN);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('updateColumn', () => {
			it('should update the column', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP).mockReturnValueOnce(MOCK_TIMESTAMP);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 1
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.boardId).toBe(MOCK_BOARD_ID);

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_COLUMN_2_ID);
				const newColumnId = columnsStore.createColumn(newBoardId!, {
					name: MOCK_COLUMN_NAME
				});

				expect(newColumnId).toBe(MOCK_COLUMN_2_ID);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_2_ID)).toBe(true);
				expect(columnsStore.getColumnById(newColumnId!)?.boardId).toBe(MOCK_BOARD_ID!);
				expect(columnsStore.getColumnById(newColumnId!)?.name).toBe(MOCK_COLUMN_NAME);

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED);
				columnsStore.updateColumn(newColumnId!, { name: MOCK_COLUMN_NAME_UPDATED });

				expect(columnsStore.getColumnById(newColumnId!)?.name).toBe(MOCK_COLUMN_NAME_UPDATED);
				expect(columnsStore.getColumnById(newColumnId!)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);
				expect(boardsStore.getBoardById(newBoardId!)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);
			});

			it('should throw an error if column ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const columnsStore = useColumnsStore();
				expect(() => columnsStore.updateColumn('INVALID_COLUMN_ID', {})).toThrow(new ColumnError(COLUMN_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(COLUMN_ERROR.UPDATE_COLUMN);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 1
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.boardId).toBe(MOCK_BOARD_ID);

				columnsStore.columnMap[MOCK_COLUMN_ID].boardId = 'INVALID_BOARD_ID';
				expect(() => columnsStore.updateColumn(MOCK_COLUMN_ID, {})).toThrow(new BoardError(BOARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(COLUMN_ERROR.UPDATE_COLUMN);
			});
		});

		describe('archiveColumn', () => {
			it('should archive an existing column', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 1
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.boardId).toBe(MOCK_BOARD_ID);

				columnsStore.archiveColumn(MOCK_COLUMN_1_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.archived).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);
				expect(boardsStore.getBoardById(newBoardId!)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);
			});

			it('should throw an error if column ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const columnsStore = useColumnsStore();
				expect(() => columnsStore.archiveColumn('INVALID_COLUMN_ID')).toThrow(new ColumnError(COLUMN_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(COLUMN_ERROR.ARCHIVE_COLUMN);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('unarchiveColumn', () => {
			it('should unarchive an existing column', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_1).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_2);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 1
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.boardId).toBe(MOCK_BOARD_ID);

				columnsStore.archiveColumn(MOCK_COLUMN_1_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.archived).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);
				expect(boardsStore.getBoardById(newBoardId!)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);

				columnsStore.unarchiveColumn(MOCK_COLUMN_1_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.archived).toBe(false);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
				expect(boardsStore.getBoardById(newBoardId!)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
			});

			it('should throw an error if column ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const columnsStore = useColumnsStore();
				expect(() => columnsStore.unarchiveColumn('INVALID_COLUMN_ID')).toThrow(new ColumnError(COLUMN_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(COLUMN_ERROR.UNARCHIVE_COLUMN);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('deleteColumn', () => {
			it('should delete an existing column', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 1
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.boardId).toBe(MOCK_BOARD_ID);

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_COLUMN_2_ID);
				const newColumnId = columnsStore.createColumn(newBoardId!);
				expect(newColumnId).toBe(MOCK_COLUMN_2_ID);

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID).mockReturnValueOnce(MOCK_CARD_2_ID).mockReturnValueOnce(MOCK_CARD_3_ID);
				const cardsStore = useCardsStore();
				cardsStore.createCard(MOCK_COLUMN_1_ID);
				cardsStore.createCard(MOCK_COLUMN_1_ID);
				cardsStore.createCard(MOCK_COLUMN_1_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.cardIds).toEqual([MOCK_CARD_1_ID, MOCK_CARD_2_ID, MOCK_CARD_3_ID]);

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_4_ID).mockReturnValueOnce(MOCK_CARD_5_ID).mockReturnValueOnce(MOCK_CARD_6_ID);
				cardsStore.createCard(MOCK_COLUMN_2_ID);
				cardsStore.createCard(MOCK_COLUMN_2_ID);
				cardsStore.createCard(MOCK_COLUMN_2_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_2_ID)?.cardIds).toEqual([MOCK_CARD_4_ID, MOCK_CARD_5_ID, MOCK_CARD_6_ID]);

				columnsStore.deleteColumn(MOCK_COLUMN_1_ID);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(false);
				expect(boardsStore.getBoardById(newBoardId!)?.columnIds).toEqual([MOCK_COLUMN_2_ID]);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(false);
				expect(cardsStore.isValidCardId(MOCK_CARD_2_ID)).toBe(false);
				expect(cardsStore.isValidCardId(MOCK_CARD_3_ID)).toBe(false);
				expect(cardsStore.isValidCardId(MOCK_CARD_4_ID)).toBe(true);
				expect(cardsStore.isValidCardId(MOCK_CARD_5_ID)).toBe(true);
				expect(cardsStore.isValidCardId(MOCK_CARD_6_ID)).toBe(true);

				columnsStore.deleteColumn(MOCK_COLUMN_2_ID);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_2_ID)).toBe(false);
				expect(boardsStore.getBoardById(newBoardId!)?.columnIds).toEqual([]);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(false);
				expect(cardsStore.isValidCardId(MOCK_CARD_2_ID)).toBe(false);
				expect(cardsStore.isValidCardId(MOCK_CARD_3_ID)).toBe(false);
				expect(cardsStore.isValidCardId(MOCK_CARD_4_ID)).toBe(false);
				expect(cardsStore.isValidCardId(MOCK_CARD_5_ID)).toBe(false);
				expect(cardsStore.isValidCardId(MOCK_CARD_6_ID)).toBe(false);
			});

			it('should throw an error if column ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const columnsStore = useColumnsStore();
				expect(() => columnsStore.deleteColumn('INVALID_COLUMN_ID')).toThrow(new ColumnError(COLUMN_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(COLUMN_ERROR.DELETE_COLUMN);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 1
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.boardId).toBe(MOCK_BOARD_ID);

				columnsStore.columnMap[MOCK_COLUMN_1_ID].boardId = 'INVALID_BOARD_ID';
				expect(() => columnsStore.deleteColumn(MOCK_COLUMN_1_ID)).toThrow(new BoardError(BOARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(COLUMN_ERROR.DELETE_COLUMN);
			});
		});
	});
});
