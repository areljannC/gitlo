import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
	persist: {
		pick: ['showArchivedColumns', 'showArchivedCards']
	},
	state: () => ({
		showArchivedColumns: false as boolean,
		showArchivedCards: false as boolean
	}),
	actions: {
		setShowArchivedColumns(value: boolean) {
			this.showArchivedColumns = value;
		},
		setShowArchivedCards(value: boolean) {
			this.showArchivedCards = value;
		}
	}
});
