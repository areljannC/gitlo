import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import UnarchiveButton from './UnarchiveButton.vue';

describe('UnarchiveButton', () => {
  it('renders the unarchive button', async () => {
	const wrapper = await mountSuspended(UnarchiveButton);
	expect(wrapper.text()).toContain('Unarchive');
  });

  it('emits `unarchive` event when clicked', async () => {
	const wrapper = await mountSuspended(UnarchiveButton);
	await wrapper.find('button').trigger('click');
	expect(wrapper.emitted('unarchive')).toBeTruthy();
	expect(wrapper.emitted('unarchive')!.length).toBe(1);
  });
});
