# MusicPlayer
Page that displays subfolders of music for easy playback

### Motivation
Don't you hate it when you pop a usb drive or sd card full of music into a workstation only to find that the available media player is all different?
This is a nice lightweight static html page that can live alongside your music filestructure - play it on anything that can open a local html page.

### Usage
1. Clone this project (or grab a release).
2. Open MusicPlayer.html with your favorite browser.
3. "upload" the folder with all the music using the TBD button.
  * "upload" is in scare quotes because the files don't actually move at all when uploaded to a local page like this.
4. Start listening to your music.

### Features
- [ ] Discovers mp3 files from a chosen directory and organizes them into tabs within the page.
- [ ] Next mp3 behavior (Loop Single, Loop Tab or None) settable with a single click and readable without having to hover or click.
- [ ] Infer artist and track name from file names like "[Artist] - [Track].mp3" otherwise use the complete filename as both artist and track.
- [ ] Sort by artist, track or file modification date.
- [ ] Filter tab or collection.
- [ ] When selecting the next random mp3 from a tab, only select from the mp3s shown by the filter (if any).
- [ ] Queue up mp3s.
- [ ] Create playset. (Queued songs played before playset songs, only if both are empty will the player select something from the tab)

### Libraries
* jquery
* vue
