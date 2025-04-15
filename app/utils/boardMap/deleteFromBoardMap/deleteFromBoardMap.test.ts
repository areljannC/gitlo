import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { deleteFromBoardMap } from './deleteFromBoardMap';

const NO_OP = (): any => {};
const MOCK_BOARD_ID = 'MOCK_BOARD_ID';
const MOCK_BOARD_DIRECTORY_PATH = 'MOCK_BOARD_DIRECTORY_PATH';
const MOCK_DATA_DIRECTORY_PATH = '/data';
const MOCK_BOARD_MAP_JSON_PATH = `${MOCK_BOARD_DIRECTORY_PATH}/boardMap.json`;

vi.mock('fs');
vi.mock('path');
vi.mock('~/utils');

describe('deleteFromBoardMap', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(join)
			.mockImplementationOnce(() => MOCK_DATA_DIRECTORY_PATH)
			.mockImplementationOnce(() => MOCK_BOARD_MAP_JSON_PATH);
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readFileSync).mockImplementation(() => JSON.stringify({ [MOCK_BOARD_ID]: MOCK_BOARD_DIRECTORY_PATH }, null, '\t'));
		vi.mocked(writeFileSync).mockImplementation(NO_OP);
		vi.spyOn(console, 'warn').mockImplementation(NO_OP);
	});

	it('deletes entry from `boardMap.json` and writes updated JSON', async () => {
		const withLock = vi.mocked((await import('~/utils')).withLock);
		withLock.mockImplementation((_, fn) => fn());
		deleteFromBoardMap(MOCK_BOARD_ID);
		expect(writeFileSync).toHaveBeenCalledWith(MOCK_BOARD_MAP_JSON_PATH, JSON.stringify({}, null, '\t'));
	});

	it('does nothing if `boardMap.json `does not exist', async () => {
		const withLock = vi.mocked((await import('~/utils')).withLock);
		withLock.mockImplementation((_, fn) => fn());
		vi.mocked(existsSync).mockReturnValue(false);
		deleteFromBoardMap(MOCK_BOARD_ID);
		expect(writeFileSync).not.toHaveBeenCalled();
	});

	it('skips write if ID is not found in `boardMap.json`', async () => {
		const withLock = vi.mocked((await import('~/utils')).withLock);
		withLock.mockImplementation((_, fn) => fn());
		vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ somethingElse: 'value' }, null, '\t'));
		deleteFromBoardMap(MOCK_BOARD_ID);
		expect(writeFileSync).not.toHaveBeenCalled();
	});

	it('logs a warning and skips deletion on invalid JSON', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(NO_OP);
		const withLock = vi.mocked((await import('~/utils')).withLock);
		withLock.mockImplementation((_, fn) => fn());
		vi.mocked(readFileSync).mockReturnValue('this is not json');
		deleteFromBoardMap(MOCK_BOARD_ID);
		expect(warnSpy).toHaveBeenCalledWith('Invalid `boardMap.json` format... skipping deletion.');
		expect(writeFileSync).not.toHaveBeenCalled();
	});
});
