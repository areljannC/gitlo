import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import CloseButton from './CloseButton.vue';

describe('CloseButton', () => {
  it('renders the close button', async () => {
	const wrapper = await mountSuspended(CloseButton);
	expect(wrapper.text()).toContain('Close');
  });

  it('emits `close` event when clicked', async () => {
	const wrapper = await mountSuspended(CloseButton);
	await wrapper.find('button').trigger('click');
	expect(wrapper.emitted('close')).toBeTruthy();
	expect(wrapper.emitted('close')!.length).toBe(1);
  });
});
