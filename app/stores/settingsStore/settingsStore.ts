import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
	persist: {
		pick: ['showArchivedCards']
	},
	state: () => ({
		showArchivedCards: false as boolean
	}),
	actions: {
		setShowArchivedCards(value: boolean) {
			this.showArchivedCards = value;
		}
	}
});
