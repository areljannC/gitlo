import { describe, it, expect } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import Boards from './Boards.vue';

mockNuxtImport('useColorMode', () => {
	const colorMode = ref('light');
	return () => colorMode
});

describe.skip('Boards', () => {});
