import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
	persist: {
		pick: ['showArchivedBoards', 'showArchivedColumns', 'showArchivedCards']
	},
	state: () => ({
		showArchivedBoards: false as boolean,
		showArchivedColumns: false as boolean,
		showArchivedCards: false as boolean
	}),
	actions: {
		setShowArchivedBoards(value: boolean) {
			this.showArchivedBoards = value;
		},
		setShowArchivedColumns(value: boolean) {
			this.showArchivedColumns = value;
		},
		setShowArchivedCards(value: boolean) {
			this.showArchivedCards = value;
		}
	}
});
