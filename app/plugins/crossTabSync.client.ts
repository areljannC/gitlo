// TODO: use `localStorage` for cross-tab sync
import { defineNuxtPlugin } from '#app';
import type { PiniaPluginContext, Pinia } from 'pinia';

function crossTabSync({ store }: PiniaPluginContext) {
	window.addEventListener('storage', event => {
		if (event.key === store.$id && event.newValue) {
			store.$patch(JSON.parse(event.newValue));
		}
	});
}

//export default defineNuxtPlugin(nuxtApp => {
//	(nuxtApp.$pinia as Pinia).use(crossTabSync);
//});
