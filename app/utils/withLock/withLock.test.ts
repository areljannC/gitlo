import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import { withLock } from './withLock';

const MOCKED_TIMESTAMP = 'MOCKED_TIMESTAMP';
const NO_OP = (): any => {};
const LOCK_NAME = 'TEST_LOCK_NAME';
const DATA_DIRECTORY_PATH = '/data';
const LOCK_FILE_PATH = `${DATA_DIRECTORY_PATH}/${LOCK_NAME}.lock`;

vi.mock('fs');
vi.mock('path');
vi.mock('~/utils', () => ({ getTimestamp: () => MOCKED_TIMESTAMP }));

describe('withLock', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(existsSync).mockReturnValue(false);
		vi.mocked(mkdirSync).mockImplementation(NO_OP);
		vi.mocked(writeFileSync).mockImplementation(NO_OP);
		vi.mocked(unlinkSync).mockImplementation(NO_OP);
		vi.mocked(join).mockImplementationOnce(() => DATA_DIRECTORY_PATH);
		vi.mocked(join).mockImplementationOnce(() => LOCK_FILE_PATH);
	});

	it('executes the callback function and returns its value', () => {
		const result = withLock(LOCK_NAME, () => 'success');
		expect(result).toBe('success');
		expect(writeFileSync).toHaveBeenCalledWith(LOCK_FILE_PATH, MOCKED_TIMESTAMP, 'utf-8');
		expect(unlinkSync).toHaveBeenCalledWith(LOCK_FILE_PATH);
	});

	it('creates the `/data` directory if it does not exist', () => {
		withLock(LOCK_NAME, () => 'directory-check');
		expect(mkdirSync).toHaveBeenCalledWith(DATA_DIRECTORY_PATH, { recursive: true });
	});

	it('throws an error if lock file already exists', () => {
		vi.mocked(existsSync).mockImplementation(path => path === LOCK_FILE_PATH);
		expect(() => {
			withLock(LOCK_NAME, () => 'should not run');
		}).toThrow(`${LOCK_NAME} is currently locked.`);
		expect(unlinkSync).not.toHaveBeenCalled();
	});
});
