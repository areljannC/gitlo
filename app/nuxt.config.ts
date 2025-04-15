import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	telemetry: false,
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	vite: {
		plugins: [tailwindcss()]
	},
	components: [
		{
			path: '~/components',
			pathPrefix: false
		}
	],
	modules: ['@nuxt/ui', '@nuxt/icon', '@nuxt/test-utils/module'],
	nitro: {
		ignore: ['**/*.test.ts']
	}
});
