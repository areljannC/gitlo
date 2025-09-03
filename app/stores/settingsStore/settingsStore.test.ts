import { describe, beforeEach, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from '~/stores';

describe('Settings Store', () => {
	let pinia: any;

	beforeEach(() => {
		pinia = createPinia();
		setActivePinia(pinia);
	});

	describe('state', () => {
		it('should have the correct initial state', () => {
			const settingsStore = useSettingsStore();
			expect(settingsStore.showArchivedColumns).toBe(false);
			expect(settingsStore.showArchivedCards).toBe(false);
		});
	});

	describe('actions', () => {
		describe('setShowArchivedColumns', () => {
			it('should set `showArchivedColumns` to `true`', () => {
				const settingsStore = useSettingsStore();
				settingsStore.setShowArchivedColumns(true);
				expect(settingsStore.showArchivedColumns).toBe(true);
			});

			it('should set `showArchivedColumns` to `false`', () => {
				const settingsStore = useSettingsStore();
				settingsStore.setShowArchivedColumns(true);
				expect(settingsStore.showArchivedColumns).toBe(true);
				settingsStore.setShowArchivedColumns(false);
				expect(settingsStore.showArchivedColumns).toBe(false);
			});
		});

		describe('setShowArchivedCards', () => {
			it('should set `showArchivedCards` to `true`', () => {
				const settingsStore = useSettingsStore();
				settingsStore.setShowArchivedCards(true);
				expect(settingsStore.showArchivedCards).toBe(true);
			});

			it('should set `showArchivedCards` to `false`', () => {
				const settingsStore = useSettingsStore();
				settingsStore.setShowArchivedCards(true);
				expect(settingsStore.showArchivedCards).toBe(true);
				settingsStore.setShowArchivedCards(false);
				expect(settingsStore.showArchivedCards).toBe(false);
			});
		});
	});
});
