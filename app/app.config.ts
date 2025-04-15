export default defineAppConfig({
	icon: {
		mode: 'css',
		cssLayer: 'base'
	},
	ui: {
		modal: {
			slots: {
				header: 'flex justify-center items-center gap-1.5 p-4 sm:px-6 min-h-16',
				body: 'flex-1 overflow-y-auto p-4 sm:p-6',
				footer: 'flex items-center gap-2 p-4 sm:px-6 justify-end'
			}
		}
	}
});
