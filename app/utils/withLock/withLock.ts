import { join } from 'path';
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { getTimestamp } from '~/utils';

export const withLock = <T>(lockName: string, fn: () => T): T => {
	const dataDirectoryPath = join(process.cwd(), '..', 'data');
	const lockFilePath = join(dataDirectoryPath, `${lockName}.lock`);

	// check if `/data` directory exists
	if (!existsSync(dataDirectoryPath)) {
		mkdirSync(dataDirectoryPath, { recursive: true });
	}

	// check if lock file already exists
	if (existsSync(lockFilePath)) {
		throw new Error(`${lockName} is currently locked.`);
	}

	// create lock file
	writeFileSync(lockFilePath, getTimestamp(), 'utf-8');

	try {
		return fn();
	} finally {
		unlinkSync(lockFilePath);
	}
};
