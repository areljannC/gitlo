export interface Board {
	id: string;
	name: string;
	description?: string;
	tags?: string[];
	columnIds?: string[];
	archived: boolean;
	createdAt: string;
	updatedAt: string;
}
