import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	telemetry: false,
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	vite: { plugins: [tailwindcss()] },
	components: [{ path: '~/components', pathPrefix: false }],
	modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@vueuse/nuxt', '@nuxt/ui', '@nuxt/icon', '@nuxt/test-utils/module'],
	nitro: { ignore: ['**/*.test.ts'] },
	app: {
		head: {
			title: 'gitlo.app',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
			]
		}
	}
});
