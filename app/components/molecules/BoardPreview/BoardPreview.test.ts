import { vi, describe, beforeEach, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { MOCK_HASH, MOCK_TIMESTAMP, MOCK_BOARD, MOCK_COLUMN, MOCK_CARD } from '~/constants';
import BoardPreview from './BoardPreview.vue';

describe('BoardPreview', () => {
	it('should render a board preview with a name, a description, tags and a view button', async () => {
		const wrapper = await mountSuspended(BoardPreview, {
			props: {
				name: MOCK_BOARD[1].name,
				description: MOCK_BOARD[1].description,
				tags: MOCK_BOARD[1].tags
			}
		});
		const props = wrapper.props();
		const text = wrapper.text();
		expect(props.name).toBe(MOCK_BOARD[1].name);
		expect(props.description).toBe(MOCK_BOARD[1].description);
		expect(props.tags).toEqual(MOCK_BOARD[1].tags);
		expect(text).toContain(MOCK_BOARD[1].name);
		expect(text).toContain(MOCK_BOARD[1].description);
		expect(text).toContain(MOCK_BOARD[1].tags[0]);
		expect(text).toContain(MOCK_BOARD[1].tags[1]);
		expect(text).toContain(MOCK_BOARD[1].tags[2]);
		expect(wrapper.find('button')).toBeTruthy();
	});

	it('should render a board preview with a name, a description and a view button', async () => {
		const wrapper = await mountSuspended(BoardPreview, {
			props: {
				name: MOCK_BOARD[1].name,
				description: MOCK_BOARD[1].description
			}
		});
		const props = wrapper.props();
		const text = wrapper.text();
		expect(props.name).toBe(MOCK_BOARD[1].name);
		expect(props.description).toBe(MOCK_BOARD[1].description);
		expect(props.tags).toEqual([]);
		expect(text).toContain(MOCK_BOARD[1].name);
		expect(text).toContain(MOCK_BOARD[1].description);
		expect(wrapper.find('button')).toBeTruthy();
	});

	it('should render a board preview with a name, tags and a view button', async () => {
		const wrapper = await mountSuspended(BoardPreview, {
			props: {
				name: MOCK_BOARD[1].name,
				tags: MOCK_BOARD[1].tags
			}
		});
		const props = wrapper.props();
		const text = wrapper.text();
		expect(props.name).toBe(MOCK_BOARD[1].name);
		expect(props.description).toBe('');
		expect(props.tags).toEqual(MOCK_BOARD[1].tags);
		expect(text).toContain(MOCK_BOARD[1].name);
		expect(text).toContain(MOCK_BOARD[1].tags[0]);
		expect(text).toContain(MOCK_BOARD[1].tags[1]);
		expect(text).toContain(MOCK_BOARD[1].tags[2]);
		expect(wrapper.find('button')).toBeTruthy();
	});

	it('should render a board preview with a name and a view button', async () => {
		const wrapper = await mountSuspended(BoardPreview, {
			props: { name: MOCK_BOARD[1].name }
		});
		const props = wrapper.props();
		const text = wrapper.text();
		expect(props.name).toBe(MOCK_BOARD[1].name);
		expect(props.description).toBe('');
		expect(props.tags).toEqual([]);
		expect(text).toContain(MOCK_BOARD[1].name);
		expect(wrapper.find('button')).toBeTruthy();
	});

	it('should emit `view` when the button is clicked', async () => {
		const wrapper = await mountSuspended(BoardPreview, {
			props: {
				name: MOCK_BOARD[1].name,
				description: MOCK_BOARD[1].description,
				tags: MOCK_BOARD[1].tags
			}
		});
		const props = wrapper.props();
		const text = wrapper.text();
		expect(props.name).toBe(MOCK_BOARD[1].name);
		expect(props.description).toBe(MOCK_BOARD[1].description);
		expect(props.tags).toEqual(MOCK_BOARD[1].tags);
		expect(text).toContain(MOCK_BOARD[1].name);
		expect(text).toContain(MOCK_BOARD[1].description);
		expect(text).toContain(MOCK_BOARD[1].tags[0]);
		expect(text).toContain(MOCK_BOARD[1].tags[1]);
		expect(text).toContain(MOCK_BOARD[1].tags[2]);

		const button = wrapper.find('button');
		expect(button).toBeTruthy();
		await button.trigger('click');
		expect(wrapper.emitted()).toHaveProperty('view');
	});
});
