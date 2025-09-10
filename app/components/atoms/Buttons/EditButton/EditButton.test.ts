import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import EditButton from './EditButton.vue';

describe('EditButton', () => {
  it('renders the edit button', async () => {
	const wrapper = await mountSuspended(EditButton);
	expect(wrapper.text()).toContain('Edit');
  });

  it('emits `edit` event when clicked', async () => {
	const wrapper = await mountSuspended(EditButton);
	await wrapper.find('button').trigger('click');
	expect(wrapper.emitted('edit')).toBeTruthy();
	expect(wrapper.emitted('edit')!.length).toBe(1);
  });
});
