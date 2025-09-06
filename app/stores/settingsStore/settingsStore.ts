import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
	persist: {
		pick: ['showArchivedColumns', 'showArchivedCards', 'showArchivedBoards']
	},
	state: () => ({
		showArchivedColumns: false as boolean,
		showArchivedCards: false as boolean,
		showArchivedBoards: false as boolean
	}),
	actions: {
		setShowArchivedColumns(value: boolean) {
			this.showArchivedColumns = value;
		},
		setShowArchivedCards(value: boolean) {
			this.showArchivedCards = value;
		},
		setShowArchivedBoards(value: boolean) {
			this.showArchivedBoards = value;
		}
	}
});
