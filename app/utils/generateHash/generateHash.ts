// TODO: use `crypto` for a more stable hash generation
export const generateHash = (isUnsynced = false): string => {
	const hash = Math.random().toString(36).substring(2, 10);
	return isUnsynced ? `__${hash}` : hash;
};
