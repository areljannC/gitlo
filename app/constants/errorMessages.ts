export const BOARD_ERROR = Object.freeze({
	ID_ALREADY_EXISTS: 'Board ID already exists.',
	ID_INVALID: 'Invalid board ID.',
	CREATE_BOARD: 'Error creating a new board.',
	UPDATE_BOARD: 'Error updating board.',
	ARCHIVE_BOARD: 'Error archiving board.',
	UNARCHIVE_BOARD: 'Error unarchiving board.',
	DELETE_BOARD: 'Error deleting board.'
});

export const COLUMN_ERROR = Object.freeze({
	ID_ALREADY_EXISTS: 'Column ID already exists.',
	ID_INVALID: 'Invalid column ID.',
	CREATE_COLUMN: 'Error creating a new column.',
	UPDATE_COLUMN: 'Error updating column.',
	ARCHIVE_COLUMN: 'Error archiving column.',
	UNARCHIVE_COLUMN: 'Error unarchiving column.',
	DELETE_COLUMN: 'Error deleting column.'
});

export const CARD_ERROR = Object.freeze({
	ID_ALREADY_EXISTS: 'Card ID already exists.',
	ID_INVALID: 'Invalid card ID.',
	CREATE_CARD: 'Error creating a new card.',
	UPDATE_CARD: 'Error updating card.',
	ARCHIVE_CARD: 'Error archiving card.',
	UNARCHIVE_CARD: 'Error unarchiving card.',
	DELETE_CARD: 'Error deleting card.',
	MOVE_CARD: 'Error moving card to column.',
	EXPAND_CARD: 'Error expanding card.',
	COLLAPSE_CARD: 'Error collapsing card.'
});

export const DATA_ERROR = Object.freeze({
	SAVE: (boardId?: string) => boardId ? `Error saving board (${boardId}).` : 'Error saving board.',
	LOAD: (boardId?: string) => boardId ? `Error loading board (${boardId}).` : 'Error loading board.'
});
