import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { withLock, stringify, parsify } from '~/utils';
import { updateBoardMap } from './updateBoardMap';

const NO_OP = (): any => {};
const MOCK_BOARD_ID = 'MOCK_BOARD_ID';
const MOCK_BOARD_DIRECTORY_PATH = 'MOCK_BOARD_DIRECTORY_PATH';
const MOCK_DATA_DIRECTORY_PATH = '/data';
const MOCK_BOARD_MAP_JSON_PATH = `${MOCK_BOARD_DIRECTORY_PATH}/boardMap.json`;

vi.mock('fs');
vi.mock('path');
vi.mock('~/utils', () => ({
	withLock: vi.fn(),
	stringify: vi.fn(),
	parsify: vi.fn(),
}));

describe('updateBoardMap', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(join)
			.mockImplementationOnce(() => MOCK_DATA_DIRECTORY_PATH)
			.mockImplementationOnce(() => MOCK_BOARD_MAP_JSON_PATH);
		vi.mocked(existsSync).mockReturnValue(false);
		vi.mocked(parsify).mockImplementation(() => ({}));
		vi.mocked(stringify).mockImplementation(JSON.stringify);
		vi.mocked(writeFileSync).mockImplementation(NO_OP);
	});

	it('creates a new `boardMap.json` if none exists', () => {
		vi.mocked(withLock).mockImplementation((_, fn) => fn());
		updateBoardMap(MOCK_BOARD_ID, MOCK_BOARD_DIRECTORY_PATH);
		expect(writeFileSync).toHaveBeenCalledWith(MOCK_BOARD_MAP_JSON_PATH, stringify({ [MOCK_BOARD_ID]: MOCK_BOARD_DIRECTORY_PATH }));
	});

	it('updates an existing `boardMap.json` with new ID', () => {
		const MOCK_OLD_BOARD_ID = 'MOCK_OLD_BOARD_ID';
		const MOCK_OLD_BOARD_DIRECTORY_PATH = 'MOCK_OLD_BOARD_DIRECTORY_PATH';
		const MOCK_EXISTING_BOARD_MAP = { MOCK_OLD_BOARD_ID: MOCK_OLD_BOARD_DIRECTORY_PATH };
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(parsify).mockReturnValue(MOCK_EXISTING_BOARD_MAP);
		vi.mocked(withLock).mockImplementation((_lockName, fn) => fn());
		updateBoardMap(MOCK_BOARD_ID, MOCK_BOARD_DIRECTORY_PATH);
		expect(writeFileSync).toHaveBeenCalledWith(MOCK_BOARD_MAP_JSON_PATH, stringify({ ...MOCK_EXISTING_BOARD_MAP, [MOCK_BOARD_ID]: MOCK_BOARD_DIRECTORY_PATH }));
	});

	it('handles invalid `boardMap.json` with a warning', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(parsify).mockImplementation(() => {
			throw new Error('Invalid JSON');
		});
		vi.mocked(withLock).mockImplementation((_lockName, fn) => fn());
		updateBoardMap(MOCK_BOARD_ID, MOCK_BOARD_DIRECTORY_PATH);
		expect(warnSpy).toHaveBeenCalledWith('Invalid `boardMap.json` format.');
		expect(writeFileSync).toHaveBeenCalledWith(MOCK_BOARD_MAP_JSON_PATH, stringify({ [MOCK_BOARD_ID]: MOCK_BOARD_DIRECTORY_PATH }));
	});

	it('uses `withLock` with `boardMap` as lock name', () => {
		updateBoardMap(MOCK_BOARD_ID, MOCK_BOARD_DIRECTORY_PATH);
		expect(withLock).toHaveBeenCalledWith('boardMap', expect.any(Function));
	});
});
