import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import DeleteButton from './DeleteButton.vue';

describe('DeleteButton', () => {
  it('renders the delete button', async () => {
	const wrapper = await mountSuspended(DeleteButton);
	expect(wrapper.text()).toContain('Delete');
  });

  it('emits `delete` event when clicked', async () => {
	const wrapper = await mountSuspended(DeleteButton);
	await wrapper.find('button').trigger('click');
	expect(wrapper.emitted('delete')).toBeTruthy();
	expect(wrapper.emitted('delete')!.length).toBe(1);
  });
});
