import type { Board, Column, Card } from '~/types';

export interface SavePostBody {
	boardMap: Record<string, Board>;
	columnMap: Record<string, Column>;
	cardMap: Record<string, Card>;
}
