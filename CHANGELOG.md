<!--

Add new features here, everything will be added at the end to the changelog when a new release is made

# vX.X.X
## Added

## Changed

## Fixed

-->

# v1.5.11

## Fixed

- Uart Scroll Bug

# v1.5.10

## Added

- Refresh file on chrome browser

## Fixed

- Update core module version

## Changed

- Switched place of hard reset and reload

# v1.5.9

## Perf

- Only fetch example binary when they're accessed

# v1.5.8

## Changed

- New Bad Apple example binary

# v1.5.7

## Changed

- Minor formatting and warnings fixed and repo changes, shouldn't affect web app

# v1.5.6

## Changed

- Reset resets the io devices, important for VGA especially

# v1.5.5

## Added

- Bad Apple example

# v1.5.4

## Fixed

- Clock VGA DMA from bus and instead of VGA Buffer

## Removed

- Accidental console.log statements

# v1.5.3

## Changed

- Updated core module

# v1.5.2

## Perf

- Made the emulator a lot faster when accessing memory

# v1.5.1

## Fixed

- FPS creep where the emulator would get slower and slower

# v1.5.0

## Added

- A clock frequency counter showing current speed

## Changed

- Update core module and change names of internal modules
- The clock frequency is attempted to be set as high as possible without impacting performance

## Fixed

- Allows loading data into VGA buffer and not only sdram

# v1.4.2

## Changed

- Bug with font path

# v1.4.1

## Changed

- Lato and Ubuntu Mono as fonts

# v1.4.0

## Added

- Added a hard reset button to get a new board

## Changed

- Made it so that load and reset by default doesn't overwrite the memory
- Moved reload button into the advanced menu

## Fixed

- Allow uploading same binary multiple times

# v1.3.2

## Fixed

- Bug with safari where dialog height wasn't set

# v1.3.1

## Added

- Changelog and version button

# v1.3.0

## Added

- Upload button to upload a file into memory
- Download button to download a memory section as a file
- Soft reset, to restart the emulator without resetting memory
- Soft load, load in a new binary without writing to any memory
