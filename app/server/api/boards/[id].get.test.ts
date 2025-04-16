import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { BOARD_ID_REQUIRED_ERROR, NO_BOARDS_FOUND_ERROR, NO_BOARD_FOUND_ERROR, SERVER_ERROR } from '~/constants';
import handler from './[id].get';

const MOCKED_TIMESTAMP = 'MOCKED_TIMESTAMP';
const MOCKED_BOARD_ID = 'MOCKED_BOARD_ID';
const MOCKED_BOARD_NAME = 'MOCKED_BOARD_NAME';
const MOCKED_BOARD_DESCRIPTION = 'MOCKED_BOARD_DESCRIPTION';
const MOCKED_TAG_1 = 'MOCKED_TAG_1';
const MOCKED_TAG_2 = 'MOCKED_TAG_2';
const MOCKED_TAG_3 = 'MOCKED_TAG_3';
const MOCKED_BOARD_DIRECTORY_PATH = 'MOCKED_BOARD_DIRECTORY_PATH';
const MOCKED_BOARD = {
	id: MOCKED_BOARD_ID,
	name: MOCKED_BOARD_NAME,
	description: MOCKED_BOARD_DESCRIPTION,
	tags: [MOCKED_TAG_1, MOCKED_TAG_2, MOCKED_TAG_3],
	archived: false,
	createdAt: MOCKED_TIMESTAMP,
	updatedAt: MOCKED_TIMESTAMP
};

vi.mock('fs');
vi.mock('path');
vi.mock('~/utils', () => ({ getTimestamp: () => MOCKED_TIMESTAMP }));

describe('GET /api/boards/:id', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(join).mockImplementation((...paths: string[]) => paths.join('/'));
		vi.mocked(statSync).mockReturnValue({ isDirectory: () => true } as any); // Mock `statSync` to return `isDirectory`
	});

	it('returns a `400` if no ID is provided', () => {
		const response = handler({ context: { params: {} } } as any);
		expect(response).toEqual({
			message: BOARD_ID_REQUIRED_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns a `404` if `/data` does not exist', () => {
		vi.mocked(existsSync).mockReturnValue(false);
		const response = handler({ context: { params: { id: MOCKED_BOARD_ID } } } as any);
		expect(mkdirSync).toBeCalled();
		expect(response).toEqual({
			message: NO_BOARDS_FOUND_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns a `404` if no boards are found', () => {
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readdirSync).mockReturnValue([]);
		const response = handler({ context: { params: { id: MOCKED_BOARD_ID } } } as any);
		expect(response).toEqual({
			message: NO_BOARDS_FOUND_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns a `404` if the board is not found in the board map', () => {
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readdirSync).mockReturnValue([MOCKED_BOARD_ID] as any);
		vi.mocked(readFileSync).mockReturnValueOnce(JSON.stringify({}, null, '\t'));
		const response = handler({ context: { params: { id: 'NON_EXISTENT_ID' } } } as any);
		expect(response).toEqual({
			message: NO_BOARD_FOUND_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns a `404` if `boardMap.json` does not exist', () => {
		vi.mocked(readdirSync).mockReturnValue([MOCKED_BOARD_ID] as any);
		vi.mocked(existsSync).mockImplementation(path => {
			if (String(path).includes('boardMap.json')) return false; // Convert path to string
			return true;
		});
		const response = handler({ context: { params: { id: MOCKED_BOARD_ID } } } as any);
		expect(response).toEqual({
			message: NO_BOARDS_FOUND_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns a `404` if `board.json` does not exist', () => {
		vi.mocked(readdirSync).mockReturnValue([MOCKED_BOARD_ID] as any);
		vi.mocked(existsSync).mockImplementation(path => {
			if (String(path).includes('board.json')) return false; // Convert path to string
			return true;
		});
		vi.mocked(readFileSync).mockReturnValueOnce(JSON.stringify({ MOCKED_BOARD_ID: MOCKED_BOARD_DIRECTORY_PATH }, null, '\t'));
		const response = handler({ context: { params: { id: MOCKED_BOARD_ID } } } as any);
		expect(response).toEqual({
			message: NO_BOARD_FOUND_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns the board if it exists', () => {
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readdirSync).mockReturnValue([MOCKED_BOARD_ID] as any);
		vi.mocked(readFileSync)
			.mockReturnValueOnce(JSON.stringify({ MOCKED_BOARD_ID: MOCKED_BOARD_DIRECTORY_PATH }, null, '\t'))
			.mockReturnValueOnce(JSON.stringify(MOCKED_BOARD, null, '\t'));
		const response = handler({ context: { params: { id: MOCKED_BOARD_ID } } } as any);
		expect(response).toEqual({
			board: MOCKED_BOARD,
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns a `500` if an error occurs', () => {
		vi.mocked(existsSync).mockImplementation(() => {
			throw new Error('ERROR');
		});
		const response = handler({ context: { params: { id: MOCKED_BOARD_ID } } } as any);
		expect(response).toEqual({
			message: SERVER_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});
});
