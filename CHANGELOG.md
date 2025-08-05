# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v0.1.0] - 2025-08-05

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