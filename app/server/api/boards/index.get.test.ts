import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, mkdirSync, readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import { SERVER_ERROR } from '~/constants';
import handler from './index.get';

const MOCKED_TIMESTAMP = 'MOCKED_TIMESTAMP';
const BOARDS = [
	{
		id: 'rtbhpfe6',
		name: 'Frontend KT',
		description: 'Track frontend knowledge transfer efforts.',
		tags: ['frontend', 'kt', 'knowledge', 'transfer'],
		columnIds: ['t4auoihl', '9o2lujgg', 'ynvvyuv7'],
		archived: false,
		createdAt: '2025-04-13T05:48:02.684Z',
		updatedAt: '2025-04-13T05:48:02.684Z'
	},
	{
		id: 'okydi8g9',
		name: 'Backend KT',
		description: 'Track backend knowledge transfer efforts.',
		tags: ['backend', 'kt'],
		columnIds: ['soab1465', 'd86w3x0t', '8sn3kt4t'],
		archived: false,
		createdAt: '2025-04-13T05:51:00.526Z',
		updatedAt: '2025-04-13T05:51:00.526Z'
	},
	{
		id: 'uoxilgre',
		name: 'Database KT',
		tags: [],
		columnIds: ['b0emi5it', 'rhsyak6s', '627zierr'],
		archived: false,
		createdAt: '2025-04-14T20:10:08.967Z',
		updatedAt: '2025-04-14T20:10:08.967Z'
	}
];

vi.mock('fs');
vi.mock('path');
vi.mock('~/utils', () => ({ getTimestamp: () => MOCKED_TIMESTAMP }));

describe('GET /api/boards', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(join).mockImplementation((...paths: string[]) => paths.join('/'));
	});

	it('return a `404` if `/data` does not exist', () => {
		vi.mocked(existsSync).mockReturnValue(false);
		const response = handler({} as any);
		expect(mkdirSync).toBeCalled();
		expect(response).toEqual({
			boards: [],
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns an array of boards if directories exist', () => {
		// mock board directories
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readdirSync).mockReturnValue(BOARDS.map(board => board.id) as any);
		vi.mocked(statSync).mockReturnValue({ isDirectory: () => true } as any);

		// mock board data
		for (const board of BOARDS) {
			vi.mocked(readFileSync).mockReturnValueOnce(JSON.stringify(board) as any);
		}

		const response = handler({} as any);
		expect(response).toEqual({
			boards: BOARDS.map(({ columnIds, ...rest }) => rest),
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('return a message if no board directories exist', () => {
		// mock board directories
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readdirSync).mockReturnValue([]);
		const response = handler({} as any);
		expect(response).toEqual({
			boards: [],
			timestamp: MOCKED_TIMESTAMP
		});
	});

	it('returns a `404` if `readFileSync` throws an error', () => {
		// mock board directories
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readdirSync).mockReturnValue(BOARDS.map(board => board.id) as any);
		vi.mocked(statSync).mockReturnValue({ isDirectory: () => true } as any);

		// mock error
		vi.mocked(readFileSync).mockImplementation(() => {
			throw new Error('ERROR');
		});

		const response = handler({} as any);
		expect(response).toEqual({
			message: SERVER_ERROR,
			timestamp: MOCKED_TIMESTAMP
		});
	});
});
