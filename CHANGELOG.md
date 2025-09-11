# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v0.2.0] - 2025-09-11
### Release
- Merged changes from [v0.1.2] to [v0.1.6].

## [v0.1.6] - 2025-09-11
### Added
- Basic document titles for pages across the application.
- Default app title configuration in Nuxt config.
- Page-specific titles using Vue's `useHead` composable.

### Changed
- Updated home page branding to match the app domain.

## [v0.1.5] - 2025-09-10
### Added
- Reusable atom button components: ArchiveButton, UnarchiveButton, CancelButton, CloseButton, DeleteButton, EditButton, UpdateButton, each with unit tests.

### Changed
- Refactored molecule and organism components to use new atom button components instead of generic UButton.
- Updated and improved unit tests to use the new button components and proper testing utilities.

## [v0.1.4] - 2025-09-10
### Added
- Board archive functionality: archived boards are now hidden from the boards page by default.
- Toggle button in the boards page action menu to show/hide archived boards.
- `showArchivedBoards` setting in the settings store to persist user preference for viewing archived boards.
- ToggleArchivedBoardsButton atom component.

### Changed
- Boards page now filters out archived boards by default and provides toggle functionality.

### Fixed
- Updated and improved unit tests for Boards and related components.

## [v0.1.3] - 2025-09-03
### Added
- Column archive functionality: archived columns are now hidden from the board by default.
- Toggle button in the board action menu to show/hide archived columns.
- `showArchivedColumns` state in the settings store with persistence and toggle functionality.
- ToggleArchivedColumnsButton atom component.

### Changed
- Columns component now filters visibility based on archive status.

### Fixed
- Updated and improved Columns component unit tests.

## [v0.1.2] - 2025-08-29
### Added
- Card archive functionality: archived cards are now hidden from columns by default.
- Toggle button in the board action menu to show/hide archived cards.
- Settings store to manage the visibility state of archived cards.
- ToggleArchivedCardsButton atom component.

### Changed
- Enhanced card modal UI to handle archive/unarchive actions in edit mode.
- Improved conditional rendering for archived cards.

### Fixed
- Hide archive/unarchive toggle button when a card is being edited.
- Updated and improved related component unit tests.

### Removed
- Removed unused Docker volume and added a script to clean up Docker resources.

## [v0.1.0] - 2025-08-05
### Release
- Merged changes from [v0.0.1] to [v0.0.6].

## [v0.0.6] - 2025-08-01
### Added
- Implemented client-side save functionality: users can now save board data as JSON files anywhere on their system.
- Implemented client-side load functionality: users can now load board data from any selected JSON file.
- Added dedicated save and load board buttons.

### Changed
- Migrated away from Nuxt's server-side API features by removing the `/server` directory and all server-side endpoints.
- Replaced the generic save changes button with board-specific save/load buttons.
- Updated error messages to include board IDs.
- Renamed `/data` directory to `/boards`.

### Removed
- Removed the entire `/server` directory and associated server-side API endpoints.
- Removed unused atom component button and types.
- Removed board JSON file used for testing.

## [v0.0.5] - 2025-07-15
### Added
- Implemented functionality to save board data by creating JSON files in a directory structure.
- Added file system operations to create and update board directories with board, column, and card data.
- Introduced helper functions for extracting board-related data and handling directory creation/updates.

### Changed
- Changed request body structure from `{boards, columns, cards}` to `{boardMap, columnMap, cardMap}` in the save API.

## [v0.0.4] - 2025-06-13
### Added
- Implemented column deletion functionality.

## [v0.0.3] - 2025-06-12
### Added
- Implemented card deletion functionality via the `<ExpandedCardModal>` component.

### Fixed
- Resolved hydration mismatch issues on Firefox.
- Blur board name input field when pressing Enter.

### Changed
- Minor styling changes to buttons (e.g., updated unarchive button color).

## [v0.0.2] - 2025-05-31
### Added
- Wrapped `<UInput>` components in `Card.vue` and `CreateCard.vue` with `<UForm>` and `<UFormField>` to support schema validation for card names.
- Created a reusable schema for cards.

### Changed
- Updated and improved unit tests for card and create card components.
- Used `keydown` instead of `keyup` for input handling.
- Formatted files for consistency.

### Fixed
- Added support for displaying validation error messages in card-related input fields.
- Blur input fields when pressing Enter key.

## [v0.0.1] - 2025-05-22
### Added
- Wrapped `<UInput>` components in `Column.vue` and `CreateColumn.vue` with `<UForm>` and `<UFormField>` to support schema validation for column names.
- Created a reusable schema for columns.

### Changed
- Improved variable naming for clarity in column-related components.
- Updated and improved unit tests for column and create column components.
- Formatted files for consistency.

### Fixed
- Added support for displaying validation error messages in column-related input fields.

## [v0.0.0] - 2025-05-22
### Added
- Initial MVP feature.