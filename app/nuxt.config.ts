import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	telemetry: false,
	compatibilityDate: '2024-11-01',
	devtools: { enabled: false },
	css: ['~/assets/css/main.css'],
	vite: { plugins: [tailwindcss()] },
	components: [{ path: '~/components', pathPrefix: false }],
	modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxt/ui', '@nuxt/icon', '@nuxt/test-utils/module'],
	nitro: { ignore: ['**/*.test.ts'] }
});
