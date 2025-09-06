// State definition
const state = {
  archivedItems: {
    boards: [],
    columns: [],
    cards: [],
  },
  // Other state properties
};

// Action methods
const actions = {
  archiveBoard(board) {
    // Implementation
  },
  archiveColumn(column) {
    // Implementation
  },
  archiveCard(card) {
    // Implementation
  },
  // Other action methods
};

// Persist configuration
const persist = {
  pick: ['archivedItems.boards', 'archivedItems.columns', 'archivedItems.cards'],
  // Other persist options
};