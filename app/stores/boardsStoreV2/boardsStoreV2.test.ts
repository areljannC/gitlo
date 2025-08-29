import { describe, beforeEach, it, vi, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { generateHash, getTimestamp } from '~/shared/utils';
import { BoardError, ColumnError } from '~/shared/errors';
import { useBoardsStore, useColumnsStore } from '~/stores';
import { BOARD_ERROR, COLUMN_ERROR } from '~/constants';

const MOCK_HASH = 'MOCK_HASH';
const MOCK_TIMESTAMP = 'MOCK_TIMESTAMP';
const MOCK_BOARD_ID = `${MOCK_HASH}_BOARD_ID`;
const MOCK_BOARD_NAME = 'MOCK_BOARD_NAME';
const MOCK_BOARD_DESCRIPTION = 'MOCK_BOARD_DESCRIPTION';
const MOCK_BOARD_TAGS = ['MOCK_TAG_1', 'MOCK_TAG_2'];
const MOCK_COLUMN_1_ID = `${MOCK_HASH}_COLUMN_1_ID`;
const MOCK_COLUMN_2_ID = `${MOCK_HASH}_COLUMN_2_ID`;
const MOCK_COLUMN_3_ID = `${MOCK_HASH}_COLUMN_3_ID`;
const MOCK_COLUMN_4_ID = `${MOCK_HASH}_COLUMN_4_ID`;
const MOCK_COLUMN_DUPLICATE_ID = `${MOCK_HASH}_COLUMN_DUPLICATE_ID`;

const MOCK_TIMESTAMP_UPDATED = 'MOCK_TIMESTAMP_UPDATED';
const MOCK_TIMESTAMP_UPDATED_1 = 'MOCK_TIMESTAMP_UPDATED_1';
const MOCK_TIMESTAMP_UPDATED_2 = 'MOCK_TIMESTAMP_UPDATED_2';
const MOCK_BOARD_NAME_UPDATED = 'MOCK_BOARD_NAME_UPDATED';
const MOCK_BOARD_DESCRIPTION_UPDATED = 'MOCK_BOARD_DESCRIPTION_UPDATED';

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn(() => MOCK_TIMESTAMP)
	};
});

describe('Boards Store', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		setActivePinia(createPinia());
	});

	describe('state', () => {
		it('should have the correct initial state', () => {
			const boardsStore = useBoardsStore();
			expect(boardsStore.boardIds).toEqual([]);
			expect(boardsStore.boardMap).toEqual({});
		});
	});

	describe('actions', () => {
		describe('createBoard', () => {
			it('should create a new board and return its ID', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID).mockReturnValueOnce(MOCK_COLUMN_2_ID).mockReturnValueOnce(MOCK_COLUMN_3_ID);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 3
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);
				expect(boardsStore.getBoardIds()).toEqual([MOCK_BOARD_ID]);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)).toEqual({
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_1_ID, MOCK_COLUMN_2_ID, MOCK_COLUMN_3_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				});

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.boardId).toBe(MOCK_BOARD_ID);

				expect(columnsStore.isValidColumnId(MOCK_COLUMN_2_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_2_ID)?.boardId).toBe(MOCK_BOARD_ID);

				expect(columnsStore.isValidColumnId(MOCK_COLUMN_3_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_3_ID)?.boardId).toBe(MOCK_BOARD_ID);

				expect(columnsStore.isValidColumnId(MOCK_COLUMN_4_ID)).toBe(false);
			});

			it('should throw an error if the board ID already exists', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID);
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const boardsStore = useBoardsStore();
				boardsStore.boardIds.push(MOCK_BOARD_ID);
				boardsStore.boardMap[MOCK_BOARD_ID] = {} as any;

				expect(() => {
					boardsStore.createBoard({
						name: 'Another Board',
						description: 'Description',
						tags: [],
						columns: 1
					});
				}).toThrow(new BoardError(BOARD_ERROR.ID_ALREADY_EXISTS));

				expect(consoleErrorSpy).toHaveBeenCalledWith(BOARD_ERROR.CREATE_BOARD);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if a column ID already exists', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_DUPLICATE_ID).mockReturnValueOnce(MOCK_COLUMN_DUPLICATE_ID);
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const boardsStore = useBoardsStore();
				expect(() => {
					const MOCK_BOARD_NAME = 'MOCK_BOARD_NAME';
					const MOCK_BOARD_DESCRIPTION = 'MOCK_BOARD_DESCRIPTION';
					const MOCK_BOARD_TAGS = ['MOCK_TAG_1', 'MOCK_TAG_2'];

					boardsStore.createBoard({
						name: MOCK_BOARD_NAME,
						description: MOCK_BOARD_DESCRIPTION,
						tags: MOCK_BOARD_TAGS,
						columns: 2
					});
				}).toThrow(new ColumnError(COLUMN_ERROR.ID_ALREADY_EXISTS));

				expect(consoleErrorSpy).toHaveBeenCalledWith(BOARD_ERROR.CREATE_BOARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('updateBoard', () => {
			it('should update an existing board', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID).mockReturnValueOnce(MOCK_COLUMN_2_ID).mockReturnValueOnce(MOCK_COLUMN_3_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 3
				});


				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED);

				boardsStore.updateBoard(MOCK_BOARD_ID, {
					name: MOCK_BOARD_NAME_UPDATED,
					description: MOCK_BOARD_DESCRIPTION_UPDATED
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)).toEqual({
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME_UPDATED,
					description: MOCK_BOARD_DESCRIPTION_UPDATED,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_1_ID, MOCK_COLUMN_2_ID, MOCK_COLUMN_3_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP_UPDATED
				});
			});

			it('should throw an error if the board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const boardsStore = useBoardsStore();

				expect(() => {
					boardsStore.updateBoard('INVALID_BOARD_ID', {
						name: 'Updated Board',
						description: 'Updated Description'
					});
				}).toThrow(new BoardError(BOARD_ERROR.ID_INVALID));

				expect(consoleErrorSpy).toHaveBeenCalledWith(BOARD_ERROR.UPDATE_BOARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('archiveBoard', () => {
			it('should archive an existing board', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID).mockReturnValueOnce(MOCK_COLUMN_2_ID).mockReturnValueOnce(MOCK_COLUMN_3_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 3
				});

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED);
				boardsStore.archiveBoard(MOCK_BOARD_ID);
				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)).toEqual({
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_1_ID, MOCK_COLUMN_2_ID, MOCK_COLUMN_3_ID],
					archived: true,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP_UPDATED
				});
			});

			it('should throw an error if the board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const boardsStore = useBoardsStore();

				expect(() => {
					boardsStore.archiveBoard('INVALID_BOARD_ID');
				}).toThrow(new BoardError(BOARD_ERROR.ID_INVALID));

				expect(consoleErrorSpy).toHaveBeenCalledWith(BOARD_ERROR.ARCHIVE_BOARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('unarchiveBoard', () => {
			it('should unarchive an existing board', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID).mockReturnValueOnce(MOCK_COLUMN_2_ID).mockReturnValueOnce(MOCK_COLUMN_3_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 3
				});

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_1);
				boardsStore.archiveBoard(MOCK_BOARD_ID);
				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)).toEqual({
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_1_ID, MOCK_COLUMN_2_ID, MOCK_COLUMN_3_ID],
					archived: true,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP_UPDATED_1
				});

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_2);
				boardsStore.unarchiveBoard(MOCK_BOARD_ID);
				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)).toEqual({
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_1_ID, MOCK_COLUMN_2_ID, MOCK_COLUMN_3_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP_UPDATED_2
				});
			});

			it('should throw an error if the board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const boardsStore = useBoardsStore();

				expect(() => {
					boardsStore.unarchiveBoard('INVALID_BOARD_ID');
				}).toThrow(new BoardError('Invalid board ID.'));

				expect(consoleErrorSpy).toHaveBeenCalledWith('Error unarchiving board.');
				consoleErrorSpy.mockRestore();
			});
		});

		describe('deleteBoard', () => {
			it('should delete an existing board', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID).mockReturnValueOnce(MOCK_COLUMN_2_ID).mockReturnValueOnce(MOCK_COLUMN_3_ID);
				
				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 3
				});

				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.getBoardIds()).toEqual([MOCK_BOARD_ID]);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)).toEqual({
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_1_ID, MOCK_COLUMN_2_ID, MOCK_COLUMN_3_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				});

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(true);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_2_ID)).toBe(true);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_3_ID)).toBe(true);

				boardsStore.deleteBoard(MOCK_BOARD_ID);
				expect(boardsStore.getBoardIds()).toEqual([]);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(false);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_2_ID)).toBe(false);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_3_ID)).toBe(false);
			});

			it('should throw an error if the board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const boardsStore = useBoardsStore();

				expect(() => {
					boardsStore.deleteBoard('INVALID_BOARD_ID');
				}).toThrow(new BoardError(BOARD_ERROR.ID_INVALID));

				expect(consoleErrorSpy).toHaveBeenCalledWith(BOARD_ERROR.DELETE_BOARD);
				consoleErrorSpy.mockRestore();
			});
		});
	});
});
