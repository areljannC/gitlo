import { describe, beforeEach, it, vi, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { getTimestamp } from '~/shared/utils';
import { useDataStore, useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
import { MOCK_HASH, MOCK_TIMESTAMP, MOCK_BOARD, MOCK_COLUMN, MOCK_CARD } from '~/constants';

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn()
	};
});

describe('Data Store', () => {
	let pinia: any;

	beforeEach(() => {
		vi.resetAllMocks();
		pinia = createPinia();
		setActivePinia(pinia);
		vi.mocked(getTimestamp).mockReturnValue(MOCK_TIMESTAMP[1]);
	});

	describe('state', () => {
		it('should have the correct initial state', () => {
			const dataStore = useDataStore();
			expect(dataStore.changes).toBe(0);
		});
	});

	describe('actions', () => {
		describe('recordChange', () => {
			it('should increment changes', () => {
				const dataStore = useDataStore();
				expect(dataStore.changes).toBe(0);
				dataStore.recordChange();
				expect(dataStore.changes).toBe(1);
				dataStore.recordChange();
				expect(dataStore.changes).toBe(2);
			});
		});

		describe('saveBoard', () => {
			it('should trigger download with correct JSON', async () => {
				const boardsStore = useBoardsStore();
				const columnsStore = useColumnsStore();
				const cardsStore = useCardsStore();
				boardsStore.$patch({
					boardMap: { [MOCK_HASH[1]]: { id: MOCK_HASH[1], name: MOCK_BOARD[1].name, archived: false, createdAt: MOCK_TIMESTAMP[1], updatedAt: MOCK_TIMESTAMP[1] } },
					boardIds: [MOCK_HASH[1]]
				});
				columnsStore.$patch({
					columnMap: {
						[MOCK_HASH[2]]: {
							id: MOCK_HASH[2],
							boardId: MOCK_HASH[1],
							name: MOCK_COLUMN[1].name,
							cardIds: [MOCK_HASH[4]],
							archived: false,
							createdAt: MOCK_TIMESTAMP[1],
							updatedAt: MOCK_TIMESTAMP[1]
						}
					}
				});
				cardsStore.$patch({
					cardMap: { [MOCK_HASH[4]]: { id: MOCK_HASH[4], columnId: MOCK_HASH[2], name: MOCK_CARD[1].name, archived: false, createdAt: MOCK_TIMESTAMP[1], updatedAt: MOCK_TIMESTAMP[1] } }
				});

				const createElementSpy = vi.spyOn(document, 'createElement');
				const appendChildSpy = vi.spyOn(document.body, 'appendChild');
				const removeChildSpy = vi.spyOn(document.body, 'removeChild');
				const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
				const clickMock = vi.fn();
				const anchorMock = {
					set href(_v: string) {},
					set download(_v: string) {},
					click: clickMock
				} as unknown as HTMLAnchorElement;
				createElementSpy.mockReturnValue(anchorMock);
				appendChildSpy.mockImplementation((_node: Node) => _node);
				removeChildSpy.mockImplementation((_node: Node) => _node);
				revokeSpy.mockImplementation(() => {});
				const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');

				const dataStore = useDataStore();
				await dataStore.saveBoard(MOCK_HASH[1]);

				expect(createObjectURLSpy).toHaveBeenCalled();
				expect(clickMock).toHaveBeenCalled();
				expect(appendChildSpy).toHaveBeenCalled();
				expect(removeChildSpy).toHaveBeenCalled();
				expect(revokeSpy).toHaveBeenCalled();
			});

			it('should log and throw on error if board does not exist', async () => {
				const boardsStore = useBoardsStore();
				boardsStore.$patch({ boardMap: {} });
				const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
				const dataStore = useDataStore();
				await expect(dataStore.saveBoard(MOCK_HASH[1])).rejects.toThrow();
				expect(errorSpy).toHaveBeenCalled();
			});
		});

		describe('loadBoard', () => {
			it('should patch boards, columns, and cards', async () => {
				const dataStore = useDataStore();
				const boardsStore = useBoardsStore();
				const columnsStore = useColumnsStore();
				const cardsStore = useCardsStore();
				boardsStore.$patch({ boardMap: {}, boardIds: [] });
				columnsStore.$patch({ columnMap: {} });
				cardsStore.$patch({ cardMap: {} });
				const json = {
					board: { id: 'new-board', name: 'Board', archived: false, createdAt: MOCK_TIMESTAMP[1], updatedAt: MOCK_TIMESTAMP[1] },
					columns: [{ id: 'new-col', boardId: 'new-board', name: 'Col', cardIds: ['new-card'], archived: false, createdAt: MOCK_TIMESTAMP[1], updatedAt: MOCK_TIMESTAMP[1] }],
					cards: [{ id: 'new-card', columnId: 'new-col', name: 'Card', archived: false, createdAt: MOCK_TIMESTAMP[1], updatedAt: MOCK_TIMESTAMP[1] }]
				};
				await dataStore.loadBoard(json);
				expect(boardsStore.boardMap['new-board']).toEqual(json.board);
				expect(boardsStore.boardIds).toContain('new-board');
				expect(columnsStore.columnMap['new-col']).toEqual(json.columns[0]);
				expect(cardsStore.cardMap['new-card']).toEqual(json.cards[0]);
			});
		});
	});
});
