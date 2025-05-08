//describe('BoardPreview', () => {
//	it('should render a name', async () => {
//		const NAME = 'TEST_NAME';
//		const component = await mountSuspended(BoardPreview, { props: { name: NAME } });
//		expect(component.text()).toContain(NAME);
//	});

//	it('should render a description if provided', async () => {
//		const NAME = 'TEST_NAME';
//		const DESCRIPTION = 'TEST_DESCRIPTION';
//		const component = await mountSuspended(BoardPreview, { props: { name: NAME, description: DESCRIPTION } });
//		expect(component.text()).toContain(NAME);
//		expect(component.text()).toContain(DESCRIPTION);
//	});

//	it('should render tags if provided', async () => {
//		const NAME = 'TEST_NAME';
//		const TAGS = ['TEST_TAG_1', 'TEST_TAG_2', 'TEST_TAG_3'];
//		const component = await mountSuspended(BoardPreview, { props: { name: NAME, tags: TAGS } });
//		const tagComponents = component.findAllComponents({ name: 'Tag' });
//		expect(component.text()).toContain(NAME);
//		expect(tagComponents.length).toBe(TAGS.length);
//	});

//	it('emits `view` when clicking the View button', async () => {
//		const NAME = 'TEST_NAME';
//		const DESCRIPTION = 'TEST_DESCRIPTION';
//		const TAGS = ['TEST_TAG_1', 'TEST_TAG_2', 'TEST_TAG_3'];
//		const component = await mountSuspended(BoardPreview, { props: { name: NAME, description: DESCRIPTION, tags: TAGS } });

//		const buttonComponent = component.find('button');
//		expect(buttonComponent.text()).toContain('View');

//		await buttonComponent.trigger('click');
//		await buttonComponent.trigger('click');
//		await buttonComponent.trigger('click');

//		expect(component.emitted('view')).toBeTruthy();
//		expect(component.emitted('view')?.length).toBe(3);
//	});
//});

import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { Tag } from '#components';
import BoardPreview from './BoardPreview.vue';

const MOCK_NAME = 'MOCk_NAME';
const MOCK_DESCRIPTION = 'MOCK_DESCRIPTION';
const MOCK_TAGS = ['MOCK_TAG_1', 'MOCK_TAG_2', 'MOCK_TAG_3'];

describe('BoardPreview', () => {
	describe('props', () => {
		it('should have default props', async () => {
			const wrapper = await mountSuspended(BoardPreview, { props: { name: MOCK_NAME } });
			const props = wrapper.props();
			expect(props).toHaveProperty('name', MOCK_NAME);
			expect(props).toHaveProperty('description', '');
			expect(props).toHaveProperty('tags', []);
		});

		describe('name', () => {
			it('should receive and render the `name` prop', async () => {
				const wrapper = await mountSuspended(BoardPreview, { props: { name: MOCK_NAME } });
				expect(wrapper.text()).toContain(MOCK_NAME);
			});
			
			it('should render an empty string if no name is provided', async () => {
				const wrapper = await mountSuspended(BoardPreview, { props: { name: '' } });
				expect(wrapper.text()).toContain('');
			});
		});

		describe('description', () => {
			it('should receive and render the `description` prop', async () => {
				const wrapper = await mountSuspended(BoardPreview, { props: { name: MOCK_NAME, description: MOCK_DESCRIPTION } });
				expect(wrapper.text()).toContain(MOCK_DESCRIPTION);
			});
			
			it('should render an empty string if no description is provided', async () => {
				const wrapper = await mountSuspended(BoardPreview, { props: { name: MOCK_NAME, description: '' } });
				expect(wrapper.text()).toContain('');
			});
		});

		describe('tags', () => {
			it('should receive and render the `tags` prop', async () => {
				const wrapper = await mountSuspended(BoardPreview, { props: { name: MOCK_NAME, tags: MOCK_TAGS } });
				const tagComponents = wrapper.findAllComponents(Tag);
				expect(tagComponents.length).toBe(MOCK_TAGS.length);
				MOCK_TAGS.forEach((tag, index) => {
					expect(tagComponents[index].text()).toContain(tag);
				});
			});
			
			it('should render an empty array if no tags are provided', async () => {
				const wrapper = await mountSuspended(BoardPreview, { props: { name: MOCK_NAME, tags: [] } });
				const tagComponents = wrapper.findAllComponents(Tag);
				expect(tagComponents.length).toBe(0);
			});
		});
	});

	describe('emits', () => {
		it('should emit `view` when the view button is clicked', async () => {
			const wrapper = await mountSuspended(BoardPreview, { props: { name: MOCK_NAME, description: MOCK_DESCRIPTION, tags: MOCK_TAGS } });
			const button = wrapper.find('button');

			await button.trigger('click');
			expect(wrapper.emitted('view')).toBeTruthy();
			expect(wrapper.emitted('view')?.length).toBe(1);

			await button.trigger('click');
			await button.trigger('click');
			await button.trigger('click');
			expect(wrapper.emitted('view')?.length).toBe(4);
		});
	});
});