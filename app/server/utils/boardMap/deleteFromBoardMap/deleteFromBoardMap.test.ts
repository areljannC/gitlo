import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { stringify, parsify } from '~/shared/utils';
import { deleteFromBoardMap } from './deleteFromBoardMap';

const NO_OP = (): any => {};
const MOCK_BOARD_ID = 'MOCK_BOARD_ID';
const MOCK_BOARD_DIRECTORY_PATH = 'MOCK_BOARD_DIRECTORY_PATH';
const MOCK_DATA_DIRECTORY_PATH = '/data';
const MOCK_BOARD_MAP_JSON_PATH = `${MOCK_BOARD_DIRECTORY_PATH}/boardMap.json`;

vi.mock('fs');
vi.mock('path');
vi.mock('~/shared/utils', () => ({
	stringify: vi.fn(),
	parsify: vi.fn()
}));
vi.mock('~/server/utils', () => ({
	withLock: vi.fn()
}));

describe('deleteFromBoardMap', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(join)
			.mockImplementationOnce(() => MOCK_DATA_DIRECTORY_PATH)
			.mockImplementationOnce(() => MOCK_BOARD_MAP_JSON_PATH);
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(parsify).mockImplementation(() => ({ [MOCK_BOARD_ID]: MOCK_BOARD_DIRECTORY_PATH }));
		vi.mocked(stringify).mockImplementation(JSON.stringify);
		vi.mocked(writeFileSync).mockImplementation(NO_OP);
		vi.spyOn(console, 'warn').mockImplementation(NO_OP);
	});

	it('deletes entry from `boardMap.json` and writes updated JSON', async () => {
		const withLock = vi.mocked((await import('~/server/utils')).withLock);
		withLock.mockImplementation((_, fn) => fn());
		deleteFromBoardMap(MOCK_BOARD_ID);
		expect(writeFileSync).toHaveBeenCalledWith(MOCK_BOARD_MAP_JSON_PATH, stringify({}));
	});

	it('does nothing if `boardMap.json `does not exist', async () => {
		const withLock = vi.mocked((await import('~/server/utils')).withLock);
		withLock.mockImplementation((_, fn) => fn());
		vi.mocked(existsSync).mockReturnValue(false);
		deleteFromBoardMap(MOCK_BOARD_ID);
		expect(writeFileSync).not.toHaveBeenCalled();
	});

	it('skips write if ID is not found in `boardMap.json`', async () => {
		const withLock = vi.mocked((await import('~/server/utils')).withLock);
		withLock.mockImplementation((_, fn) => fn());
		vi.mocked(parsify).mockReturnValue({ somethingElse: 'value' });
		deleteFromBoardMap(MOCK_BOARD_ID);
		expect(writeFileSync).not.toHaveBeenCalled();
	});

	it('logs a warning and skips deletion on invalid JSON', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(NO_OP);
		const withLock = vi.mocked((await import('~/server/utils')).withLock);
		withLock.mockImplementation((_, fn) => fn());
		vi.mocked(parsify).mockImplementation(() => {
			throw new Error('Invalid JSON');
		});
		deleteFromBoardMap(MOCK_BOARD_ID);
		expect(warnSpy).toHaveBeenCalledWith('Invalid `boardMap.json` format... skipping deletion.');
		expect(writeFileSync).not.toHaveBeenCalled();
	});
});
