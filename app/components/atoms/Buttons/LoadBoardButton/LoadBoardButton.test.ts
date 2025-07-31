import { describe, it, expect } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import LoadBoardButton from './LoadBoardButton.vue';

mockNuxtImport('useColorMode', () => {
	const colorMode = ref('light');
	return () => colorMode
});

describe.skip('LoadBoardButton', () => {});
