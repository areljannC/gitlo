import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ArchiveButton from './ArchiveButton.vue';

describe('ArchiveButton', () => {
  it('renders the `Archive` button', async () => {
    const wrapper = await mountSuspended(ArchiveButton);
    expect(wrapper.text()).toContain('Archive');
  });

  it('emits `archive` event when clicked', async () => {
    const wrapper = await mountSuspended(ArchiveButton);
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('archive')).toBeTruthy();
    expect(wrapper.emitted('archive')!.length).toBe(1);
  });
});
