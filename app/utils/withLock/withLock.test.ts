import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import { withLock } from './withLock';

const NO_OP = (): any => {};
const MOCKED_TIMESTAMP = 'MOCKED_TIMESTAMP';
const MOCK_LOCK_NAME = 'TEST_LOCK_NAME';
const MOCK_DATA_DIRECTORY_PATH = '/data';
const MOCK_LOCK_FILE_PATH = `${MOCK_DATA_DIRECTORY_PATH}/${MOCK_LOCK_NAME}.lock`;

vi.mock('fs');
vi.mock('path');
vi.mock('~/utils', async () => {
	const actual = await vi.importActual<typeof import('~/utils')>('~/utils');
	return {
		...actual,
		getTimestamp: () => MOCKED_TIMESTAMP
	};
});

describe('withLock', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(existsSync).mockReturnValue(false);
		vi.mocked(mkdirSync).mockImplementation(NO_OP);
		vi.mocked(writeFileSync).mockImplementation(NO_OP);
		vi.mocked(unlinkSync).mockImplementation(NO_OP);
		vi.mocked(join).mockImplementationOnce(() => MOCK_DATA_DIRECTORY_PATH);
		vi.mocked(join).mockImplementationOnce(() => MOCK_LOCK_FILE_PATH);
	});

	it('executes the callback function and returns its value', () => {
		const result = withLock(MOCK_LOCK_NAME, () => 'success');
		expect(result).toBe('success');
		expect(writeFileSync).toHaveBeenCalledWith(MOCK_LOCK_FILE_PATH, MOCKED_TIMESTAMP, 'utf-8');
		expect(unlinkSync).toHaveBeenCalledWith(MOCK_LOCK_FILE_PATH);
	});

	it('creates the `/data` directory if it does not exist', () => {
		withLock(MOCK_LOCK_NAME, () => 'directory-check');
		expect(mkdirSync).toHaveBeenCalledWith(MOCK_DATA_DIRECTORY_PATH, { recursive: true });
	});

	it('throws an error if lock file already exists', () => {
		vi.mocked(existsSync).mockImplementation(path => path === MOCK_LOCK_FILE_PATH);
		expect(() => {
			withLock(MOCK_LOCK_NAME, () => 'should not run');
		}).toThrow(`${MOCK_LOCK_NAME} is currently locked.`);
		expect(unlinkSync).not.toHaveBeenCalled();
	});
});
