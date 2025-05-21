import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
	test: {
		environment: 'nuxt',
		coverage: {
			enabled: true,
			provider: 'v8',
			reporter: ['text', 'html', 'json'],
			reportsDirectory: './coverage',
			//thresholds: {
			//	lines: 100,
			//	functions: 100,
			//	branches: 100,
			//	statements: 100,
			//	perFile: true
			//},
			all: true,
			clean: true,
			cleanOnRerun: true,
			include: ['components/**/*.{vue,ts}', 'schemas/**/*.ts', 'utils/**/*.ts', 'server/**/*.ts'],
			exclude: ['node_modules/', '.nuxt/', 'dist/', '**/*.d.ts', '**/*.test.ts', '**/*.spec.ts', '**/index.ts', '**/dev.vue']
		}
	}
});
