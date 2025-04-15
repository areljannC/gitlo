import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BoardCard from './BoardCard.vue';

describe('BoardCard', () => {
	it('renders a header for name prop', () => {
		const NAME = 'TEST_NAME';
		const wrapper = mount(BoardCard, {
			props: { name: NAME }
		});
		expect(wrapper.text()).toContain(NAME);
	});

	it('renders a description if provided', () => {
		const NAME = 'TEST_NAME';
		const DESCRIPTION = 'TEST_DESCRIPTION';
		const wrapper = mount(BoardCard, {
			props: { name: NAME, description: DESCRIPTION }
		});
		expect(wrapper.text()).toContain(NAME);
		expect(wrapper.text()).toContain(DESCRIPTION);
	});

	it('renders tags if provided', () => {
		const NAME = 'TEST_NAME';
		const TAGS = ['TEST_TAG_1', 'TEST_TAG_2', 'TEST_TAG_3'];
		const wrapper = mount(BoardCard, {
			props: { name: NAME, tags: TAGS }
		});

		const tagComponents = wrapper.findAllComponents({ name: 'Tag' });
		expect(wrapper.text()).toContain(NAME);
		expect(tagComponents.length).toBe(TAGS.length);
	});

	it('emits `click` when clicked', async () => {
		const NAME = 'TEST_NAME';
		const DESCRIPTION = 'TEST_DESCRIPTION';
		const TAGS = ['TEST_TAG_1', 'TEST_TAG_2', 'TEST_TAG_3'];
		const wrapper = mount(BoardCard, {
			props: { name: NAME, description: DESCRIPTION, tags: TAGS }
		});

		const tagComponents = wrapper.findAllComponents({ name: 'Tag' });
		expect(wrapper.text()).toContain(NAME);
		expect(wrapper.text()).toContain(DESCRIPTION);
		expect(tagComponents.length).toBe(TAGS.length);

		const boardCardComponent = wrapper.getComponent({ name: 'BoardCard' });
		await boardCardComponent.trigger('click');
		await boardCardComponent.trigger('click');
		await boardCardComponent.trigger('click');

		expect(wrapper.emitted('click')).toBeTruthy();
		expect(wrapper.emitted('click')!.length).toBe(3);
	});
});
