export interface Board {
	id: string;
	name: string;
	description?: string;
	tags?: string[];
	columnIds?: string[];
	columns?: number;
	archived: boolean;
	createdAt: string;
	updatedAt: string;
}
