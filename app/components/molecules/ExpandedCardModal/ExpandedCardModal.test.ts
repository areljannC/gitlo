import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { DOMWrapper } from '@vue/test-utils';
import { useBoardsStore, useColumnsStore, useCardsStore } from '~/stores';
import { generateHash, getTimestamp } from '~/shared/utils';
import { MOCK_HASH, MOCK_TIMESTAMP, MOCK_PARSE_TIMESTAMP, MOCK_BOARD, MOCK_COLUMN, MOCK_CARD } from '~/constants';
import ExpandedCardModal from './ExpandedCardModal.vue';

vi.mock('~/shared/utils', async () => {
	const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');
	return {
		...actual,
		generateHash: vi.fn(),
		getTimestamp: vi.fn(),
		parseTimestamp: vi.fn(() => MOCK_PARSE_TIMESTAMP[1])
	};
});

let pinia: any;

describe('ExpandedCardModal', () => {
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

	it('should render card details', async () => {
		await mountSuspended(ExpandedCardModal, {
			global: { plugins: [pinia] }
		});
		const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
		expect(wrapper.findAll('textarea')).toHaveLength(2);
		expect(wrapper.findAll('input[type="text"]')).toHaveLength(2);

		const cardNameInput = wrapper.find('textarea[name="name"]')!;
		expect(cardNameInput.exists()).toBe(true);
		expect(cardNameInput.attributes('readonly')).toBeDefined();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].name);

		const cardDescriptionInput = wrapper.find('textarea[name="description"]');
		expect(cardDescriptionInput.exists()).toBe(true);
		expect(cardDescriptionInput.attributes('readonly')).toBeDefined();
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].description);

		const cardUpdatedAtInput = wrapper.find('input[name="updatedAt"]');
		expect(cardUpdatedAtInput.exists()).toBe(true);
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardUpdatedAtInput.element as HTMLInputElement).value).toBe(MOCK_PARSE_TIMESTAMP[1]);

		const cardCreatedAtInput = wrapper.find('input[name="createdAt"]');
		expect(cardCreatedAtInput.exists()).toBe(true);
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardCreatedAtInput.element as HTMLInputElement).value).toBe(MOCK_PARSE_TIMESTAMP[1]);

		const buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		const closeButton = buttons[0];
		expect(closeButton.exists()).toBe(true);
		expect(closeButton.text()).toBe('Close');

		const editButton = buttons[1];
		expect(editButton.exists()).toBe(true);
		expect(editButton.text()).toBe('Edit');
	});

	it('should not update card detail changes when cancel button is clicked', async () => {
		const { vm } = await mountSuspended(ExpandedCardModal, {
			global: { plugins: [pinia] }
		});
		const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
		expect(wrapper.findAll('textarea')).toHaveLength(2);
		expect(wrapper.findAll('input[type="text"]')).toHaveLength(2);

		const cardNameInput = wrapper.find('textarea[name="name"]')!;
		expect(cardNameInput.exists()).toBe(true);
		expect(cardNameInput.attributes('readonly')).toBeDefined();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].name);

		const cardDescriptionInput = wrapper.find('textarea[name="description"]');
		expect(cardDescriptionInput.exists()).toBe(true);
		expect(cardDescriptionInput.attributes('readonly')).toBeDefined();
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].description);

		const cardUpdatedAtInput = wrapper.find('input[name="updatedAt"]');
		expect(cardUpdatedAtInput.exists()).toBe(true);
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardUpdatedAtInput.element as HTMLInputElement).value).toBe(MOCK_PARSE_TIMESTAMP[1]);

		const cardCreatedAtInput = wrapper.find('input[name="createdAt"]');
		expect(cardCreatedAtInput.exists()).toBe(true);
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardCreatedAtInput.element as HTMLInputElement).value).toBe(MOCK_PARSE_TIMESTAMP[1]);

		let buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		const closeButton = buttons[0];
		expect(closeButton.exists()).toBe(true);
		expect(closeButton.text()).toBe('Close');

		const editButton = buttons[1];
		expect(editButton.exists()).toBe(true);
		expect(editButton.text()).toBe('Edit');

		await editButton.trigger('click');
		expect(cardNameInput.attributes('readonly')).toBeUndefined();
		expect(cardDescriptionInput.attributes('readonly')).toBeUndefined();
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();

		buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		await cardNameInput.trigger('focus');
		await vm.$nextTick();

		await cardNameInput.setValue('Updated name');
		await vm.$nextTick();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe('Updated name');

		await cardNameInput.trigger('blur');
		await vm.$nextTick();

		await cardDescriptionInput.trigger('focus');
		await vm.$nextTick();

		await cardDescriptionInput.setValue('Updated description');
		await vm.$nextTick();
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe('Updated description');

		await cardDescriptionInput.trigger('blur');
		await vm.$nextTick();

		const cancelButton = buttons[0];
		expect(cancelButton.exists()).toBe(true);
		expect(cancelButton.text()).toBe('Cancel');

		await cancelButton.trigger('click');
		await vm.$nextTick();
		expect(cardNameInput.attributes('readonly')).toBeDefined();
		expect(cardDescriptionInput.attributes('readonly')).toBeDefined();
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].name);
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].description);
	});

	it('should update card detail changes when update button is clicked', async () => {
		const { vm } = await mountSuspended(ExpandedCardModal, {
			global: { plugins: [pinia] }
		});
		const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
		expect(wrapper.findAll('textarea')).toHaveLength(2);
		expect(wrapper.findAll('input[type="text"]')).toHaveLength(2);

		const cardNameInput = wrapper.find('textarea[name="name"]')!;
		expect(cardNameInput.exists()).toBe(true);
		expect(cardNameInput.attributes('readonly')).toBeDefined();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].name);

		const cardDescriptionInput = wrapper.find('textarea[name="description"]');
		expect(cardDescriptionInput.exists()).toBe(true);
		expect(cardDescriptionInput.attributes('readonly')).toBeDefined();
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].description);

		const cardUpdatedAtInput = wrapper.find('input[name="updatedAt"]');
		expect(cardUpdatedAtInput.exists()).toBe(true);
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardUpdatedAtInput.element as HTMLInputElement).value).toBe(MOCK_PARSE_TIMESTAMP[1]);

		const cardCreatedAtInput = wrapper.find('input[name="createdAt"]');
		expect(cardCreatedAtInput.exists()).toBe(true);
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardCreatedAtInput.element as HTMLInputElement).value).toBe(MOCK_PARSE_TIMESTAMP[1]);

		let buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		const closeButton = buttons[0];
		expect(closeButton.exists()).toBe(true);
		expect(closeButton.text()).toBe('Close');

		const editButton = buttons[1];
		expect(editButton.exists()).toBe(true);
		expect(editButton.text()).toBe('Edit');

		await editButton.trigger('click');
		expect(cardNameInput.attributes('readonly')).toBeUndefined();
		expect(cardDescriptionInput.attributes('readonly')).toBeUndefined();
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();

		buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		await cardNameInput.trigger('focus');
		await vm.$nextTick();

		await cardNameInput.setValue('Updated name');
		await vm.$nextTick();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe('Updated name');

		await cardNameInput.trigger('blur');
		await vm.$nextTick();

		await cardDescriptionInput.trigger('focus');
		await vm.$nextTick();

		await cardDescriptionInput.setValue('Updated description');
		await vm.$nextTick();
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe('Updated description');

		await cardDescriptionInput.trigger('blur');
		await vm.$nextTick();

		const updateButton = buttons[1];
		expect(updateButton.exists()).toBe(true);
		expect(updateButton.text()).toBe('Update');

		await updateButton.trigger('click');
		await vm.$nextTick();
		expect(cardNameInput.attributes('readonly')).toBeDefined();
		expect(cardDescriptionInput.attributes('readonly')).toBeDefined();
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe('Updated name');
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe('Updated description');
	});

	it('should blur the card name input when `Enter` key is pressed', async () => {
		const { vm } = await mountSuspended(ExpandedCardModal, {
			global: { plugins: [pinia] }
		});
		const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
		expect(wrapper.findAll('textarea')).toHaveLength(2);
		expect(wrapper.findAll('input[type="text"]')).toHaveLength(2);

		const cardNameInput = wrapper.find('textarea[name="name"]')!;
		expect(cardNameInput.exists()).toBe(true);
		expect(cardNameInput.attributes('readonly')).toBeDefined();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].name);

		const cardDescriptionInput = wrapper.find('textarea[name="description"]');
		expect(cardDescriptionInput.exists()).toBe(true);
		expect(cardDescriptionInput.attributes('readonly')).toBeDefined();
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe(MOCK_CARD[1].description);

		const cardUpdatedAtInput = wrapper.find('input[name="updatedAt"]');
		expect(cardUpdatedAtInput.exists()).toBe(true);
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardUpdatedAtInput.element as HTMLInputElement).value).toBe(MOCK_PARSE_TIMESTAMP[1]);

		const cardCreatedAtInput = wrapper.find('input[name="createdAt"]');
		expect(cardCreatedAtInput.exists()).toBe(true);
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardCreatedAtInput.element as HTMLInputElement).value).toBe(MOCK_PARSE_TIMESTAMP[1]);

		let buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		const closeButton = buttons[0];
		expect(closeButton.exists()).toBe(true);
		expect(closeButton.text()).toBe('Close');

		const editButton = buttons[1];
		expect(editButton.exists()).toBe(true);
		expect(editButton.text()).toBe('Edit');

		await editButton.trigger('click');
		expect(cardNameInput.attributes('readonly')).toBeUndefined();
		expect(cardDescriptionInput.attributes('readonly')).toBeUndefined();
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();

		buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		await cardNameInput.trigger('focus');
		await vm.$nextTick();

		await cardNameInput.setValue('Updated name');
		await vm.$nextTick();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe('Updated name');

		await cardNameInput.trigger('keydown', { key: 'Enter' });
		await vm.$nextTick();

		await cardDescriptionInput.trigger('focus');
		await vm.$nextTick();

		await cardDescriptionInput.setValue('Updated description');
		await vm.$nextTick();
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe('Updated description');

		await cardDescriptionInput.trigger('blur');
		await vm.$nextTick();

		const updateButton = buttons[1];
		expect(updateButton.exists()).toBe(true);
		expect(updateButton.text()).toBe('Update');

		await updateButton.trigger('click');
		await vm.$nextTick();
		expect(cardNameInput.attributes('readonly')).toBeDefined();
		expect(cardDescriptionInput.attributes('readonly')).toBeDefined();
		expect(cardUpdatedAtInput.attributes('readonly')).toBeDefined();
		expect(cardCreatedAtInput.attributes('readonly')).toBeDefined();
		expect((cardNameInput.element as HTMLTextAreaElement).value).toBe('Updated name');
		expect((cardDescriptionInput.element as HTMLTextAreaElement).value).toBe('Updated description');
	});

	it('should close the modal when the close button is clicked', async () => {
		const cardsStore = useCardsStore();
		const { vm } = await mountSuspended(ExpandedCardModal, {
			global: { plugins: [pinia] }
		});
		const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
		expect(wrapper.findAll('textarea')).toHaveLength(2);
		expect(wrapper.findAll('input[type="text"]')).toHaveLength(2);

		const buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(2);

		const closeButton = buttons[0];
		expect(closeButton.exists()).toBe(true);
		expect(closeButton.text()).toBe('Close');

		await closeButton.trigger('click');
		await vm.$nextTick();
		expect(cardsStore.expandedCardId).toBeNull();
	});

	it('should not render the modal when there is no expanded card', async () => {
		const cardsStore = useCardsStore();
		cardsStore.collapseCard();
		await mountSuspended(ExpandedCardModal, {
			global: { plugins: [pinia] }
		});
		const wrapper = new DOMWrapper(document.querySelector('[role="dialog"]'));
		expect(wrapper.exists()).toBe(false);
	});
});
