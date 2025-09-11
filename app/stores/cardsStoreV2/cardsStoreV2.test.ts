import { describe, beforeEach, it, vi, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { generateHash, getTimestamp } from '~/shared/utils';
import { BoardError, ColumnError, CardError } from '~/shared/errors';
import { useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
import { BOARD_ERROR, COLUMN_ERROR, CARD_ERROR } from '~/constants';

const MOCK_HASH = 'MOCK_HASH';
const MOCK_TIMESTAMP = 'MOCK_TIMESTAMP';
const MOCK_BOARD_ID = `${MOCK_HASH}_BOARD_ID`;
const MOCK_BOARD_NAME = 'MOCK_BOARD_NAME';
const MOCK_BOARD_DESCRIPTION = 'MOCK_BOARD_DESCRIPTION';
const MOCK_BOARD_TAGS = ['MOCK_TAG_1', 'MOCK_TAG_2'];
const MOCK_COLUMN_ID = `${MOCK_HASH}_COLUMN_ID`;
const MOCK_COLUMN_1_ID = `${MOCK_HASH}_COLUMN_1_ID`;
const MOCK_COLUMN_2_ID = `${MOCK_HASH}_COLUMN_2_ID`;
const MOCK_COLUMN_NAME = 'MOCK_COLUMN_NAME';

const MOCK_TIMESTAMP_UPDATED = 'MOCK_TIMESTAMP_UPDATED';
const MOCK_TIMESTAMP_UPDATED_1 = 'MOCK_TIMESTAMP_UPDATED_1';
const MOCK_TIMESTAMP_UPDATED_2 = 'MOCK_TIMESTAMP_UPDATED_2';
const MOCK_TIMESTAMP_UPDATED_3 = 'MOCK_TIMESTAMP_UPDATED_3';
const MOCK_CARD_1_ID = `${MOCK_HASH}_CARD_1_ID`;
const MOCK_CARD_NAME = 'MOCK_CARD_NAME';
const MOCK_CARD_DESCRIPTION = 'MOCK_CARD_DESCRIPTION';
const MOCK_CARD_NAME_UPDATED = 'MOCK_CARD_NAME_UPDATED';
const MOCK_CARD_DESCRIPTION_UPDATED = 'MOCK_CARD_DESCRIPTION_UPDATED';

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn()
	};
});

describe('Cards Store', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		setActivePinia(createPinia());
	});

	describe('state', () => {
		it('should initialize with default values', () => {
			const cardsStore = useCardsStore();
			expect(cardsStore.cardMap).toEqual({});
			expect(cardsStore.expandedCardId).toBeNull();
		});
	});

	describe('actions', () => {
		describe('createCard', () => {
			it('should create a new card and return its ID', () => {
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

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED);

				const cardsStore = useCardsStore();
				const newCardId = cardsStore.createCard(MOCK_COLUMN_ID, {
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION
				});
				expect(newCardId).toBe(MOCK_CARD_1_ID);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(true);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED,
					updatedAt: MOCK_TIMESTAMP_UPDATED
				});

				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);
			});

			it('should throw an error if column ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const cardsStore = useCardsStore();
				expect(() => cardsStore.createCard(MOCK_COLUMN_ID)).toThrowError(new ColumnError(COLUMN_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.CREATE_CARD);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const columnsStore = useColumnsStore();
				columnsStore.columnMap[MOCK_COLUMN_ID] = {
					boardId: 'INVALID_BOARD_ID',
					id: MOCK_COLUMN_ID,
					name: MOCK_COLUMN_NAME,
					cardIds: [],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const cardsStore = useCardsStore();
				expect(() => cardsStore.createCard(MOCK_COLUMN_ID)).toThrowError(new BoardError(BOARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.CREATE_CARD);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if card ID already exists', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const boardsStore = useBoardsStore();
				boardsStore.boardMap[MOCK_BOARD_ID] = {
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const columnsStore = useColumnsStore();
				columnsStore.columnMap[MOCK_COLUMN_ID] = {
					boardId: MOCK_BOARD_ID,
					id: MOCK_COLUMN_ID,
					name: MOCK_COLUMN_NAME,
					cardIds: [MOCK_CARD_1_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const cardsStore = useCardsStore();
				cardsStore.cardMap[MOCK_CARD_1_ID] = {
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID);
				expect(() => cardsStore.createCard(MOCK_COLUMN_ID)).toThrowError(new CardError(CARD_ERROR.ID_ALREADY_EXISTS));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.CREATE_CARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('updateCard', () => {
			it('should update an existing card', () => {
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

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_1);

				const cardsStore = useCardsStore();
				const newCardId = cardsStore.createCard(MOCK_COLUMN_ID, {
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION
				});
				expect(newCardId).toBe(MOCK_CARD_1_ID);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(true);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_1
				});

				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_2);
				cardsStore.updateCard(MOCK_CARD_1_ID, {
					name: MOCK_CARD_NAME_UPDATED,
					description: MOCK_CARD_DESCRIPTION_UPDATED
				});

				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME_UPDATED,
					description: MOCK_CARD_DESCRIPTION_UPDATED,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_2
				});
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
			});

			it('should throw an error if card ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const cardsStore = useCardsStore();
				expect(() => cardsStore.updateCard(MOCK_CARD_1_ID, {})).toThrowError(new CardError(CARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.UPDATE_CARD);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if column ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const boardsStore = useBoardsStore();
				boardsStore.boardMap[MOCK_BOARD_ID] = {
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const columnsStore = useColumnsStore();
				columnsStore.columnMap[MOCK_COLUMN_ID] = {
					boardId: MOCK_BOARD_ID,
					id: MOCK_COLUMN_ID,
					name: MOCK_COLUMN_NAME,
					cardIds: [MOCK_CARD_1_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const cardsStore = useCardsStore();
				cardsStore.cardMap[MOCK_CARD_1_ID] = {
					columnId: 'INVALID_COLUMN_ID',
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				expect(() => cardsStore.updateCard(MOCK_CARD_1_ID, {})).toThrowError(new ColumnError(COLUMN_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.UPDATE_CARD);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const boardsStore = useBoardsStore();
				boardsStore.boardMap[MOCK_BOARD_ID] = {
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const columnsStore = useColumnsStore();
				columnsStore.columnMap[MOCK_COLUMN_ID] = {
					boardId: 'INVALID_BOARD_ID',
					id: MOCK_COLUMN_ID,
					name: MOCK_COLUMN_NAME,
					cardIds: [MOCK_CARD_1_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const cardsStore = useCardsStore();
				cardsStore.cardMap[MOCK_CARD_1_ID] = {
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				expect(() => cardsStore.updateCard(MOCK_CARD_1_ID, {})).toThrowError(new BoardError(BOARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.UPDATE_CARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('archiveCard', () => {
			it('should archive an existing card', () => {
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

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_1);

				const cardsStore = useCardsStore();
				const newCardId = cardsStore.createCard(MOCK_COLUMN_ID, {
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION
				});
				expect(newCardId).toBe(MOCK_CARD_1_ID);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(true);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_1
				});

				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_2);
				cardsStore.archiveCard(MOCK_CARD_1_ID);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: true,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_2
				});
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_2);
				cardsStore.archiveCard(MOCK_CARD_1_ID);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: true,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_2
				});
			});

			it('should throw an error if card ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const cardsStore = useCardsStore();
				expect(() => cardsStore.archiveCard(MOCK_CARD_1_ID)).toThrowError(new CardError(CARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.ARCHIVE_CARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('unarchiveCard', () => {
			it('should unarchive an existing card', () => {
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

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_1);

				const cardsStore = useCardsStore();
				const newCardId = cardsStore.createCard(MOCK_COLUMN_ID, {
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION
				});
				expect(newCardId).toBe(MOCK_CARD_1_ID);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(true);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_1
				});

				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_2);
				cardsStore.archiveCard(MOCK_CARD_1_ID);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: true,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_2
				});
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_2);
				cardsStore.archiveCard(MOCK_CARD_1_ID);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: true,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_2
				});

				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_3);
				cardsStore.unarchiveCard(MOCK_CARD_1_ID);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_3
				});
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_3);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_3);
			});

			it('should throw an error if card ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const cardsStore = useCardsStore();
				expect(() => cardsStore.unarchiveCard(MOCK_CARD_1_ID)).toThrowError(new CardError(CARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.UNARCHIVE_CARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('deleteCard', () => {
			it('should delete an existing card', () => {
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

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_1);

				const cardsStore = useCardsStore();
				const newCardId = cardsStore.createCard(MOCK_COLUMN_ID, {
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION
				});
				expect(newCardId).toBe(MOCK_CARD_1_ID);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(true);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_1
				});
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);
				
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_2);
				cardsStore.deleteCard(MOCK_CARD_1_ID);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(false);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toBeUndefined();
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.cardIds).not.toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
			});

			it('should throw an error if card ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const cardsStore = useCardsStore();
				expect(() => cardsStore.deleteCard(MOCK_CARD_1_ID)).toThrowError(new CardError(CARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.DELETE_CARD);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if column ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const boardsStore = useBoardsStore();
				boardsStore.boardMap[MOCK_BOARD_ID] = {
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const columnsStore = useColumnsStore();
				columnsStore.columnMap[MOCK_COLUMN_ID] = {
					boardId: MOCK_BOARD_ID,
					id: MOCK_COLUMN_ID,
					name: MOCK_COLUMN_NAME,
					cardIds: [MOCK_CARD_1_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const cardsStore = useCardsStore();
				cardsStore.cardMap[MOCK_CARD_1_ID] = {
					columnId: 'INVALID_COLUMN_ID',
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				expect(() => cardsStore.deleteCard(MOCK_CARD_1_ID)).toThrowError(new ColumnError(COLUMN_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.DELETE_CARD);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const boardsStore = useBoardsStore();
				boardsStore.boardMap[MOCK_BOARD_ID] = {
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const columnsStore = useColumnsStore();
				columnsStore.columnMap[MOCK_COLUMN_ID] = {
					boardId: 'INVALID_BOARD_ID',
					id: MOCK_COLUMN_ID,
					name: MOCK_COLUMN_NAME,
					cardIds: [MOCK_CARD_1_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const cardsStore = useCardsStore();
				cardsStore.cardMap[MOCK_CARD_1_ID] = {
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				expect(() => cardsStore.deleteCard(MOCK_CARD_1_ID)).toThrowError(new BoardError(BOARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.DELETE_CARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('moveCardToColumn', () => {
			it('should move a card to a different column', () => {
				vi.mocked(generateHash).mockReturnValueOnce(MOCK_BOARD_ID).mockReturnValueOnce(MOCK_COLUMN_1_ID).mockReturnValueOnce(MOCK_COLUMN_2_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP);

				const boardsStore = useBoardsStore();
				const newBoardId = boardsStore.createBoard({
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columns: 2
				});
				expect(newBoardId).toBe(MOCK_BOARD_ID);
				expect(boardsStore.isValidBoardId(MOCK_BOARD_ID)).toBe(true);

				const columnsStore = useColumnsStore();
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_1_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.boardId).toBe(MOCK_BOARD_ID);
				expect(columnsStore.isValidColumnId(MOCK_COLUMN_2_ID)).toBe(true);
				expect(columnsStore.getColumnById(MOCK_COLUMN_2_ID)?.boardId).toBe(MOCK_BOARD_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.cardIds).not.toContain(MOCK_CARD_1_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_2_ID)?.cardIds).not.toContain(MOCK_CARD_1_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.updatedAt).toBe(MOCK_TIMESTAMP);
				expect(columnsStore.getColumnById(MOCK_COLUMN_2_ID)?.updatedAt).toBe(MOCK_TIMESTAMP);

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_1);

				const cardsStore = useCardsStore();
				const newCardId = cardsStore.createCard(MOCK_COLUMN_1_ID, {
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION
				});
				expect(newCardId).toBe(MOCK_CARD_1_ID);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(true);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_1_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_1
				});
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_1_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_1);
				
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED_2);
				
				cardsStore.moveCardToColumn(MOCK_CARD_1_ID, MOCK_COLUMN_2_ID);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_2_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED_1,
					updatedAt: MOCK_TIMESTAMP_UPDATED_2
				});
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.cardIds).not.toContain(MOCK_CARD_1_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_2_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_2_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_1_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
				expect(columnsStore.getColumnById(MOCK_COLUMN_2_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED_2);
			});

			it('should throw an error if card ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const cardsStore = useCardsStore();
				expect(() => cardsStore.moveCardToColumn(MOCK_CARD_1_ID, MOCK_COLUMN_2_ID)).toThrowError(new CardError(CARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.MOVE_CARD);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if column ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const boardsStore = useBoardsStore();
				boardsStore.boardMap[MOCK_BOARD_ID] = {
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_1_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const columnsStore = useColumnsStore();
				columnsStore.columnMap[MOCK_COLUMN_1_ID] = {
					boardId: MOCK_BOARD_ID,
					id: MOCK_COLUMN_1_ID,
					name: MOCK_COLUMN_NAME,
					cardIds: [MOCK_CARD_1_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const cardsStore = useCardsStore();
				cardsStore.cardMap[MOCK_CARD_1_ID] = {
					columnId: MOCK_COLUMN_1_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				expect(() => cardsStore.moveCardToColumn(MOCK_CARD_1_ID, 'INVALID_COLUMN_ID')).toThrowError(new ColumnError(COLUMN_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.MOVE_CARD);
				consoleErrorSpy.mockRestore();
			});

			it('should throw an error if board ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

				const boardsStore = useBoardsStore();
				boardsStore.boardMap[MOCK_BOARD_ID] = {
					id: MOCK_BOARD_ID,
					name: MOCK_BOARD_NAME,
					description: MOCK_BOARD_DESCRIPTION,
					tags: MOCK_BOARD_TAGS,
					columnIds: [MOCK_COLUMN_1_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const columnsStore = useColumnsStore();
				columnsStore.columnMap[MOCK_COLUMN_1_ID] = {
					boardId: 'INVALID_BOARD_ID',
					id: MOCK_COLUMN_1_ID,
					name: MOCK_COLUMN_NAME,
					cardIds: [MOCK_CARD_1_ID],
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				const cardsStore = useCardsStore();
				cardsStore.cardMap[MOCK_CARD_1_ID] = {
					columnId: MOCK_COLUMN_1_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP,
					updatedAt: MOCK_TIMESTAMP
				};

				expect(() => cardsStore.moveCardToColumn(MOCK_CARD_1_ID, MOCK_COLUMN_1_ID)).toThrowError(new BoardError(BOARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.MOVE_CARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('expandCard', () => {
			it('should set the expanded card ID', () => {
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

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED);

				const cardsStore = useCardsStore();
				const newCardId = cardsStore.createCard(MOCK_COLUMN_ID, {
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION
				});
				expect(newCardId).toBe(MOCK_CARD_1_ID);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(true);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED,
					updatedAt: MOCK_TIMESTAMP_UPDATED
				});

				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);

				cardsStore.expandCard(MOCK_CARD_1_ID);
				expect(cardsStore.expandedCardId).toBe(MOCK_CARD_1_ID);
			});

			it('should throw an error if card ID does not exist', () => {
				const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const cardsStore = useCardsStore();
				expect(() => cardsStore.expandCard(MOCK_CARD_1_ID)).toThrowError(new CardError(CARD_ERROR.ID_INVALID));
				expect(consoleErrorSpy).toHaveBeenCalledWith(CARD_ERROR.EXPAND_CARD);
				consoleErrorSpy.mockRestore();
			});
		});

		describe('collapseCard', () => {
			it('should set the expanded card ID', () => {
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

				vi.mocked(generateHash).mockReturnValueOnce(MOCK_CARD_1_ID);
				vi.mocked(getTimestamp).mockReturnValueOnce(MOCK_TIMESTAMP_UPDATED);

				const cardsStore = useCardsStore();
				const newCardId = cardsStore.createCard(MOCK_COLUMN_ID, {
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION
				});
				expect(newCardId).toBe(MOCK_CARD_1_ID);
				expect(cardsStore.isValidCardId(MOCK_CARD_1_ID)).toBe(true);
				expect(cardsStore.getCardById(MOCK_CARD_1_ID)).toEqual({
					columnId: MOCK_COLUMN_ID,
					id: MOCK_CARD_1_ID,
					name: MOCK_CARD_NAME,
					description: MOCK_CARD_DESCRIPTION,
					archived: false,
					createdAt: MOCK_TIMESTAMP_UPDATED,
					updatedAt: MOCK_TIMESTAMP_UPDATED
				});
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.cardIds).toContain(MOCK_CARD_1_ID);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.columnIds).toContain(MOCK_COLUMN_ID);
				expect(columnsStore.getColumnById(MOCK_COLUMN_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);
				expect(boardsStore.getBoardById(MOCK_BOARD_ID)?.updatedAt).toBe(MOCK_TIMESTAMP_UPDATED);

				cardsStore.expandCard(MOCK_CARD_1_ID);
				expect(cardsStore.expandedCardId).toBe(MOCK_CARD_1_ID);

				cardsStore.collapseCard();
				expect(cardsStore.expandedCardId).toBe(null);
			});
		});
	});
});
