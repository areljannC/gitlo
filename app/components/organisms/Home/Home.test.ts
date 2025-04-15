import { describe, it, expect, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import HomePage from './Home.vue';

const { navigateToSpy } = vi.hoisted(() => ({
	navigateToSpy: vi.fn()
}));

describe('HomePage', () => {
	it('calls `navigateTo` when clicking `View Boards` button', async () => {
		mockNuxtImport('navigateTo', () => navigateToSpy);
		const wrapper = await mountSuspended(HomePage);
		const viewBoardsButton = wrapper.get('button');
		await viewBoardsButton.trigger('click');
		expect(navigateToSpy).toBeCalledWith('/boards');
	});
});
