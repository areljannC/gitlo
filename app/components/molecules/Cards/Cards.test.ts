import { vi, describe, beforeEach, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import draggable from 'vuedraggable';
import { Card, CreateCard } from '#components';
import { generateHash, getTimestamp } from '~/shared/utils';
import { useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
import { MOCK_HASH, MOCK_TIMESTAMP, MOCK_BOARD, MOCK_COLUMN, MOCK_CARD } from '~/constants';
import Cards from './Cards.vue';

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn()
	};
});

let pinia: any;

describe('Cards', () => {
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
	});

	it('should trigger `change` event and move the card to another column', async () => {
		const columnsStore = useColumnsStore();
		const column1 = columnsStore.getColumnById(MOCK_HASH[2])!;
		const column2 = columnsStore.getColumnById(MOCK_HASH[3])!;
		const wrapper = await mountSuspended(Cards, {
			global: { plugins: [pinia] },
			props: {
				columnId: column2.id,
				cardIds: column1.cardIds
			}
		});
		expect(column1.cardIds).toEqual([MOCK_HASH[4], MOCK_HASH[5]]);

		wrapper.findComponent(draggable).vm.$emit('change', { added: { element: MOCK_HASH[4] } });
		await wrapper.vm.$nextTick();

		expect(columnsStore.getColumnById(MOCK_HASH[2])?.cardIds).toEqual([MOCK_HASH[5]]);
		expect(columnsStore.getColumnById(MOCK_HASH[3])?.cardIds).toEqual([MOCK_HASH[4]]);
	});

	it('should trigger `change` event and not do anything', async () => {
		const columnsStore = useColumnsStore();
		const column1 = columnsStore.getColumnById(MOCK_HASH[2])!;
		const column2 = columnsStore.getColumnById(MOCK_HASH[3])!;
		const wrapper = await mountSuspended(Cards, {
			global: { plugins: [pinia] },
			props: {
				columnId: column2.id,
				cardIds: column1.cardIds
			}
		});
		expect(column1.cardIds).toEqual([MOCK_HASH[4], MOCK_HASH[5]]);

		wrapper.findComponent(draggable).vm.$emit('nothing', { added: { element: MOCK_HASH[4] } });
		await wrapper.vm.$nextTick();

		expect(columnsStore.getColumnById(MOCK_HASH[2])?.cardIds).toEqual([MOCK_HASH[4], MOCK_HASH[5]]);
		expect(columnsStore.getColumnById(MOCK_HASH[3])?.cardIds).toEqual([]);
	});

	it('should render `Card` components', async () => {
		const columnsStore = useColumnsStore();
		const column = columnsStore.getColumnById(MOCK_HASH[2])!;
		const wrapper = await mountSuspended(Cards, {
			global: { plugins: [pinia] },
			props: {
				columnId: column.id,
				cardIds: column.cardIds
			}
		});
		expect(wrapper.findAllComponents(Card)).toHaveLength(2);
	});

	it('should render the `CreateCard` component', async () => {
		const columnsStore = useColumnsStore();
		const column = columnsStore.getColumnById(MOCK_HASH[2])!;
		const wrapper = await mountSuspended(Cards, {
			global: { plugins: [pinia] },
			props: {
				columnId: column.id,
				cardIds: column.cardIds
			}
		});
		expect(wrapper.findComponent(CreateCard).exists()).toBe(true);
	});

	it('should render only non-archived cards when `showArchivedCards` is `false`', async () => {
		const columnsStore = useColumnsStore();
		const cardsStore = useCardsStore();
		const column = columnsStore.getColumnById(MOCK_HASH[2])!;
		// Archive one card
		cardsStore.cardMap[MOCK_HASH[4]].archived = true;
		const wrapper = await mountSuspended(Cards, {
			global: { plugins: [pinia] },
			props: {
				columnId: column.id,
				cardIds: column.cardIds
			}
		});
		// Only one card should be rendered
		const cardComponents = wrapper.findAllComponents(Card);
		expect(cardComponents).toHaveLength(1);
		// The visible card should be the non-archived one
		expect(cardComponents[0].props('cardId')).toBe(MOCK_HASH[5]);
	});

	it('should render all cards when `showArchivedCards` is `true`', async () => {
		const columnsStore = useColumnsStore();
		const cardsStore = useCardsStore();
		const settingsStore = useSettingsStore();
		const column = columnsStore.getColumnById(MOCK_HASH[2])!;
		// Archive one card
		cardsStore.cardMap[MOCK_HASH[4]].archived = true;
		settingsStore.setShowArchivedCards(true);
		const wrapper = await mountSuspended(Cards, {
			global: { plugins: [pinia] },
			props: {
				columnId: column.id,
				cardIds: column.cardIds
			}
		});
		// Both cards should be rendered
		const cardComponents = wrapper.findAllComponents(Card);
		expect(cardComponents).toHaveLength(2);
	});
});
