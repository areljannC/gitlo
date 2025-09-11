import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import UpdateButton from './UpdateButton.vue';

describe('UpdateButton', () => {
  it('renders the update button', async () => {
	const wrapper = await mountSuspended(UpdateButton);
	expect(wrapper.text()).toContain('Update');
  });

  it('emits `update` event when clicked', async () => {
	const wrapper = await mountSuspended(UpdateButton);
	await wrapper.find('button').trigger('click');
	expect(wrapper.emitted('update')).toBeTruthy();
	expect(wrapper.emitted('update')!.length).toBe(1);
  });
});
