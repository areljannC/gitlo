import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BoardPreview from './BoardPreview.vue';

describe('BoardPreview', () => {
	it('renders a header for name prop', () => {
		const NAME = 'TEST_NAME';
		const wrapper = mount(BoardPreview, {
			props: { name: NAME }
		});
		expect(wrapper.text()).toContain(NAME);
	});

	it('renders a description if provided', () => {
		const NAME = 'TEST_NAME';
		const DESCRIPTION = 'TEST_DESCRIPTION';
		const wrapper = mount(BoardPreview, {
			props: { name: NAME, description: DESCRIPTION }
		});
		expect(wrapper.text()).toContain(NAME);
		expect(wrapper.text()).toContain(DESCRIPTION);
	});

	it('renders tags if provided', () => {
		const NAME = 'TEST_NAME';
		const TAGS = ['TEST_TAG_1', 'TEST_TAG_2', 'TEST_TAG_3'];
		const wrapper = mount(BoardPreview, {
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
		const wrapper = mount(BoardPreview, {
			props: { name: NAME, description: DESCRIPTION, tags: TAGS }
		});

		const tagComponents = wrapper.findAllComponents({ name: 'Tag' });
		expect(wrapper.text()).toContain(NAME);
		expect(wrapper.text()).toContain(DESCRIPTION);
		expect(tagComponents.length).toBe(TAGS.length);

		const boardPreviewComponent = wrapper.getComponent({ name: 'BoardPreview' });
		await boardPreviewComponent.trigger('click');
		await boardPreviewComponent.trigger('click');
		await boardPreviewComponent.trigger('click');

		expect(wrapper.emitted('click')).toBeTruthy();
		expect(wrapper.emitted('click')!.length).toBe(3);
	});
});
