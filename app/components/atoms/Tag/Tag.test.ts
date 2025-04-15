import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Tag from './Tag.vue';

describe('Tag', () => {
	it('renders with a label', () => {
		const LABEL = 'TEST_LABEL';
		const wrapper = mount(Tag, {
			props: { label: LABEL }
		});
		expect(wrapper.text()).toContain(LABEL);
	});
});
