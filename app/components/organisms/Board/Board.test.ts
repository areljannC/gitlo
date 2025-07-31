import { describe, it, expect } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import Board from './Board.vue';

mockNuxtImport('useColorMode', () => {
	const colorMode = ref('light');
	return () => colorMode
});

describe.skip('Board', () => {});
