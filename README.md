# Secondhand: a Video.js v10 skin that takes time seriously

Secondhand is a custom skin for the **Video.js v10** player, built for the
Video.js Skins Design Challenge on Contra (sponsored by Mux).

Most players treat time as a thin bar you drag and forget. Secondhand treats
time as the main interface:

- **The second hand**: the big play button carries a clock ring. The hand
  sweeps the whole film, not the minute, and the ring fills behind it, so one
  glance tells you how much of the story is left.
- **A ruled timeline**: the seek bar sits on a ruler, a tick every 10 seconds,
  a tall tick and a label every minute, amber dots where chapters change.
  Scrubbing shows the exact time in big mono type, with the chapter name.
- **Time, set in type**: every number is tabular mono, sized to read across
  the room. The current chapter is always named, in the top bar and the
  console.
- **Keyboard first**: Space/K play and pause, J/L skip 10s, arrows 5s, M mute,
  F fullscreen, 0 to 9 jump by tenths. Visible focus rings, reduced-motion
  support.

## How it is built

An *ejected* v10 skin: the packaged skin is deleted and the player is rebuilt
from Video.js v10's own components (`media-play-button`, `media-time-slider`,
`media-seek-button`, volume, PiP, fullscreen) in plain HTML, restyled end to
end with one CSS file. Streaming uses the v10 HLS component (HLS.js engine)
playing **Green by GawxArt**, one of the public Mux playback IDs shared in
the challenge guidelines.

- `index.html`: the skin markup and demo page
- `skin.css`: the whole visual design
- `app.js`: the ruler, chapter logic, second-hand ring and shortcuts
- `src/entry.js`: the component and icon registration that `skin.bundle.js`
  is bundled from (esbuild, `@videojs/html` 10.4)
- `chapters.vtt`: chapter track for the demo film

## Live demo

GitHub Pages serves this repo root: the demo is the `index.html` here.

Film credit: Green by GawxArt, streamed by Mux. Skin and demo by Saiyid
Mushahid (maker of minutelytimer.com).
