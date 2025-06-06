# Changelog

## [0.0.40]() - 2025-06-01
## Fixed 
- Default screen will not display demo videos if images and audios are uploaded
- Copy ID Button visibility improved on hover


## [0.0.39]() - 2025-05-27
## Added 
- Ability to upload multiple media files at once through the `Upload Media` button

## [0.0.38]() - 2025-05-16
## Improved 
- Responsiveness improvements in `<CollectionView />` 
  - Search Box 
  - Suggestion Box 

## [0.0.37]() - 2025-05-16
## Added
- `<CollectionView />` enhancements
    - Displays audio and image assets alongside videos with the new `<AudioCard />` and `<ImageCard />` components.
    - Search your collection for videos, audios, and images.
    - Filter assets in your collection by type: Videos, Audios, Images, or All files.

- Copy ID feature added for videos, images, and audio files in `<VideoCard />`, `<AudioCard />` and `<ImageCard />`  components.

## Improved
UI improvements across `<CollectionView />`


## [0.0.36]() - 2025-02-28

### Added
- Code Syntax Highlight support for python code in `<TextReponse/>` message handler


## [0.0.35]() - 2025-02-20

### Added
- Update UI Data on socket event :  `event`


## [0.0.34]() - 2025-02-10

### Added
- Config for Components
- `sidebarConfig.enabled` 
- `defaultScreenConfig.enableVideoView`

## [0.0.33]() - 2025-02-07

### Fixed

- Issues related to ChatMessage Scroll

## [0.0.32]() - 2025-02-06

### Added

- `<ChatInput/>` Enhancements:
  - Improved multiline input experience.
  - Support for image attachments in chat (one image per message):
    - Ctrl + V paste.
    - Attach via file explorer.
    - New `<ChatImagePreview/>` component to show image preview
  - Removed context capsule.
- New `<Header/>` component:
  - Persistent header across all screens.
  - Includes a hamburger menu for mobile screens.
- Update `<ChatMessage/>` to show Image Inputs
- VideoDB Hook

  - Wrapper function that calls `/videodb/collection/${collectionId}/image/${imageId}/generate_url` to director-backend to get url of uploaded image.

- Custom header support:
  - Users can pass a custom header component to `<ChatInterface/>` via the `header` slot.

### Fixed

- Chat input:
  - Loading and disabled state for action button.
- Issues related to collection and session switching.
- Turn off autocomplete on Create Collection Modal's Input
- Mobile screen improvements.

## [0.0.31]() - 2025-02-05

### Added

- Improved Error message on Delete Collection Error Modal

## [0.0.30]() - 2025-02-03

### Added

- Delete Collection feature
- Delete Video from Collection
- Create a new Collection

### Fixed

- Minor UI fixes

## [0.0.29]() - 2025-01-30

### Added

- Add optional support for Session Name in Sidebar

## [0.0.28]() - 2025-01-03

### Added

- Support for UI Config to change no of columns in `ChatVideos`

## [0.0.27]() - 2024-12-19

### Added

- Export `ChatMessageContainer` & Other message handler Components
- Dynamic height for Sidebar Sections

## [0.0.26]() - 2024-12-18

### Added

- Config to change order and visiblity of sidebar sections

### Design Changes

- improve Grid layout of QueryCards in DefaultScreen for mobile

## [0.0.25]() - 2024-12-18

### Added

- Explore `DefaultScreen` & `Sidebar` component
- Allow `DefultScreen` to accept header in slot

### Fixed

- remove unsued props from `<DefaultScreen/>`
- change `vdb-orange` to `orange` in tailwind config to avoid confusions while themeconfig

## [0.0.24]() - 2024-12-16

### Added

- Change field name from `externalUrl` to `external_url` in `ChatInterface.vue`

## [0.0.23]() - 2024-12-13

### Added

- Optional Pagination for VideoList
- Configurable columns for VideoList

### Fixed

- videoClick handler in `<ChatVideos/>` message handler

## [0.0.22]() - 2024-12-12

### Added

- New message handler support for Videos (multiple videos)
  - Message handler key : "videos"
  - Message handler : `<ChatVideos/>`

## [0.0.21]() - 2024-12-09

### Added

- Config for Header

## [0.0.20]() - 2024-12-09

### Fixed - Config for Default Screen

## [0.0.19]() - 2024-12-09

### Fixed - Config for Default Screen

### [0.0.18]() - 2024-12-04

### Added

- Agent Icon

### [0.0.17]() - 2024-12-04

### Changed

- Sidebar Alignement
- Update icons

### [0.0.16]() - 2024-12-04

### Changed

- Director Icon Replaced with Beta
- Delete Modal as seperate component
- Default Screen Improvements for mobile
- Sidebar Issues in mobile
- Query card improvements

### [0.0.15]() - 2024-12-03

### Fixed

- Hotfix collection refresh error

### [0.0.14]() - 2024-12-03

### Added

- Default Screen UX improvements

### [0.0.13]() - 2024-12-03

### Added

- Chat Input UX improvements
  - Context Icon
  - Query card copy changes
  - Sidebar design changes

### [0.0.12]() - 2024-12-03

### Added

- Query Card UX improvments

### [0.0.11]() - 2024-11-29

### Added

- Upload Notifications
- Upload Button copy changes

### [0.0.10]() - 2024-11-28

### Added

- Upload Modal

## [0.0.9]() - 2024-11-27

### Updated

- Bump `@videodb/player-vue` to `~0.0.4`

### [0.0.8]() - 2024-11-22

### Changed

- Update `@videodb/player-vue` to `~0.0.3`
- Responsiveness improvments

### [0.0.7]() - 2024-11-21

### Added

- `<DefaultScreen/>`
  - UX improvements
  - Collection Preview
  - Query Card improvments
- `<VideoCard/>` to support inline video players

### [0.0.6]()

### Fixed

- Interaction of "Upload Video" button in CollectionView when Collection is empty

### [0.0.5]() - 2024-10-23

### Added

- Setup Screen
- Delete Session
- Video View in session History
- Expose ChatInputRef & createNewSession()
- Highlight isFocused state in LoadingMessage

### Fixes

- Full Screen for <ChatVideo/> message handler
- Open Directors Log only when status is not success
- Minor tweak in Default Screen's search suggestions
- Fix Sidebar's Icon anaimation

### [0.0.4]() - 2024-09-18

### Added

- Addtional UI Components for Sidebar, VideoView, CollectionView & Default Screen
- Enhanced UX

### Changed

- Update default chat hook
- Update Message handlers to support new conversation structure

## [0.0.3]() - 2024-09-16

### Changed

- Default chat Hook : send id as string

## [0.0.2]() - 2024-09-16

### Changed

- Support for Custom Chat Hook
- Improve interface for default Chat Hook
- Cleanup Components

**✨ Initial Release**

- Component for VideoDB Chat
- Chat Interface
- Agent Handler
- Search (includes compilation video player & search results)

## [0.0.1]() - 2024-09-09

### Added

**✨ Initial Release**

- Component for VideoDB Chat
- Chat Interface
- Agent Handler
- Search (includes compilation video player & search results)
