import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import Tag from './Tag.vue';

const MOCK_LABEL = 'MOCK_LABEL';

describe('Tag', () => {
	describe('props', () => {
		it('should have default props', async () => {
			const wrapper = await mountSuspended(Tag, { props: { label: MOCK_LABEL } });
			const props = wrapper.props();
			expect(props).toHaveProperty('label', MOCK_LABEL);
			expect(props).toHaveProperty('color', 'info');
			expect(props).toHaveProperty('variant', 'soft');
			expect(props).toHaveProperty('size', 'md');
			expect(props).toHaveProperty('deleteable', false);
		});

		describe('label', () => {
			it('should receive and render the `label` prop', async () => {
				const wrapper = await mountSuspended(Tag, {
					props: {
						label: MOCK_LABEL
					}
				});
				expect(wrapper.props()).toHaveProperty('label', MOCK_LABEL);
				expect(wrapper.text()).toContain(MOCK_LABEL);
			});
		});

		describe('color', () => {
			it('should receive the `color` prop', async () => {
				let MOCK_COLOR: string = '';
				let wrapper: any;

				MOCK_COLOR = 'primary';
				wrapper = await mountSuspended(Tag, {
					props: {
						label: MOCK_LABEL,
						color: MOCK_COLOR
					}
				});
				expect(wrapper.props()).toHaveProperty('color', MOCK_COLOR);
				expect(wrapper.classes().some((className: string) => className.includes(MOCK_COLOR))).toBe(true);

				MOCK_COLOR = 'secondary';
				wrapper = await mountSuspended(Tag, {
					props: {
						label: MOCK_LABEL,
						color: MOCK_COLOR
					}
				});
				expect(wrapper.props()).toHaveProperty('color', MOCK_COLOR);
				expect(wrapper.classes().some((className: string) => className.includes(MOCK_COLOR))).toBe(true);
			});
		});

		describe('variant', () => {
			it('should receive the `variant` prop', async () => {
				let MOCK_VARIANT: string = '';
				let wrapper: any;

				MOCK_VARIANT = 'soft';
				wrapper = await mountSuspended(Tag, {
					props: {
						label: MOCK_LABEL,
						variant: MOCK_VARIANT
					}
				});
				expect(wrapper.props()).toHaveProperty('variant', MOCK_VARIANT);

				MOCK_VARIANT = 'solid';
				wrapper = await mountSuspended(Tag, {
					props: {
						label: MOCK_LABEL,
						variant: MOCK_VARIANT
					}
				});
				expect(wrapper.props()).toHaveProperty('variant', MOCK_VARIANT);
			});
		});

		describe('size', () => {
			it('should receive the `size` prop', async () => {
				let MOCK_SIZE: string = '';
				let wrapper: any;

				MOCK_SIZE = 'sm';
				wrapper = await mountSuspended(Tag, {
					props: {
						label: MOCK_LABEL,
						size: MOCK_SIZE
					}
				});
				expect(wrapper.props()).toHaveProperty('size', MOCK_SIZE);
				expect(wrapper.classes().some((className: string) => className.includes(MOCK_SIZE))).toBe(true);

				MOCK_SIZE = 'md';
				wrapper = await mountSuspended(Tag, {
					props: {
						label: MOCK_LABEL,
						size: MOCK_SIZE
					}
				});
				expect(wrapper.props()).toHaveProperty('size', MOCK_SIZE);
				expect(wrapper.classes().some((className: string) => className.includes(MOCK_SIZE))).toBe(true);
			});
		});

		describe('deleteable', () => {
			it('should render a button when `deleteable` is `true`', async () => {
				const wrapper = await mountSuspended(Tag, {
					props: {
						label: MOCK_LABEL,
						deleteable: true
					}
				});
				expect(wrapper.props()).toHaveProperty('label', MOCK_LABEL);
				expect(wrapper.props()).toHaveProperty('deleteable', true);
				expect(wrapper.text()).toContain(MOCK_LABEL);
				expect(wrapper.find('button').exists()).toBe(true);
			});

			it('should not render a button when `deleteable` is `false`', async () => {
				const wrapper = await mountSuspended(Tag, {
					props: {
						label: MOCK_LABEL,
						deleteable: false
					}
				});
				expect(wrapper.props()).toHaveProperty('label', MOCK_LABEL);
				expect(wrapper.props()).toHaveProperty('deleteable', false);
				expect(wrapper.text()).toContain(MOCK_LABEL);
				expect(wrapper.find('button').exists()).toBe(false);
			});
		});
	});

	describe('emits', () => {
		it('should emit `delete` when the delete button is clicked', async () => {
			const wrapper = await mountSuspended(Tag, {
				props: {
					label: MOCK_LABEL,
					deleteable: true
				}
			});
			expect(wrapper.props()).toHaveProperty('label', MOCK_LABEL);
			expect(wrapper.props()).toHaveProperty('deleteable', true);
			expect(wrapper.text()).toContain(MOCK_LABEL);
			expect(wrapper.find('button').exists()).toBe(true);

			await wrapper.find('button').trigger('click');
			expect(wrapper.emitted()).toHaveProperty('delete');
		});
	});
});
