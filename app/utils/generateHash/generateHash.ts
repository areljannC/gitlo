// TODO: use `crypto` for a a more stable hash generation
export const generateHash = (): string => Math.random().toString(36).substring(2, 10);
