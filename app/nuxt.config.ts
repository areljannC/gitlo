import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	vite: {
		plugins: [tailwindcss()]
	},
	components: [
		{
			path: '~/components/atoms',
			pathPrefix: false,
			extensions: ['.vue'],
			watch: true
		},
		{
			path: '~/components/molecules',
			pathPrefix: false,
			extensions: ['.vue'],
			watch: true
		},
		{
			path: '~/components/organisms',
			pathPrefix: false,
			extensions: ['.vue'],
			watch: true
		},
		{
			path: '~/components/layouts',
			pathPrefix: false,
			extensions: ['.vue'],
			watch: true
		}
	]
});
