import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import CancelButton from './CancelButton.vue';

describe('CancelButton', () => {
  it('renders the cancel button', async () => {
	const wrapper = await mountSuspended(CancelButton);
	expect(wrapper.text()).toContain('Cancel');
  });

  it('emits `cancel` event when clicked', async () => {
	const wrapper = await mountSuspended(CancelButton);
	await wrapper.find('button').trigger('click');
	expect(wrapper.emitted('cancel')).toBeTruthy();
	expect(wrapper.emitted('cancel')!.length).toBe(1);
  });
});
