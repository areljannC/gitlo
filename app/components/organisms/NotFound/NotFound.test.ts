import { describe, it, expect, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import NotFoundPage from './NotFound.vue';

const { navigateToSpy } = vi.hoisted(() => ({
	navigateToSpy: vi.fn()
}));

describe('HomePage', () => {
	it('calls `navigateTo` when clicking `View Boards` button', async () => {
		mockNuxtImport('navigateTo', () => navigateToSpy);
		await mountSuspended(NotFoundPage);
		expect(navigateToSpy).toBeCalledWith('/');
	});
});
