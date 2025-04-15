import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readBody } from 'h3';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { INVALID_REQUEST_ERROR, SERVER_ERROR, CREATE_BOARD_SUCCESS } from '~/constants';
import handler from './index.post';

const MOCKED_TIMESTAMP = 'MOCKED_TIMESTAMP';
const MOCKED_HASH = 'MOCKED_HASH';
const NO_OP = (): any => {};

vi.mock('h3', async () => {
	const actual = await vi.importActual<typeof import('h3')>('h3');
	return {
		...actual,
		readBody: vi.fn(),
		setResponseStatus: vi.fn()
	};
});
vi.mock('fs');
vi.mock('path');
vi.mock('~/utils', () => ({
	getTimestamp: () => MOCKED_TIMESTAMP,
	generateHash: () => MOCKED_HASH,
	updateBoardMap: vi.fn()
}));

describe('POST /api/boards', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(existsSync).mockReturnValue(false);
		vi.mocked(mkdirSync).mockImplementation(NO_OP);
		vi.mocked(writeFileSync).mockImplementation(NO_OP);
		vi.mocked(join).mockImplementation((...paths: string[]) => paths.join('/'));
	});

	it('creates a board and returns a `201` response', async () => {
		const NEW_BOARD = {
			name: 'NEW_BOARD_NAME',
			description: 'NEW_BOARD_DESCRIPTION',
			tags: ['NEW_BOARD_TAG_1', 'NEW_BOARD_TAG_2'],
			columns: 3
		};
		vi.mocked(readBody).mockResolvedValue(NEW_BOARD);
		const response = await handler({} as any);
		expect(response).toEqual({
			message: CREATE_BOARD_SUCCESS,
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns a `400` if request body is invalid', async () => {
		const NEW_BOARD = {
			name: '',
			description: 'NEW_BOARD_DESCRIPTION',
			tags: ['NEW_BOARD_TAG_1', 'NEW_BOARD_TAG_2'],
			columns: 3
		};
		vi.mocked(readBody).mockResolvedValue(NEW_BOARD);
		const response = await handler({} as any);
		expect(response).toEqual({
			message: INVALID_REQUEST_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns a `500` if `readBody` throws an error', async () => {
		vi.mocked(readBody).mockImplementation(() => {
			throw new Error('ERROR');
		});
		const response = await handler({} as any);
		expect(response).toEqual({
			message: SERVER_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});
});
