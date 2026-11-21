[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/anatadare/makefun-spot-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/anatadare/makefun-spot-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Twin Views — Spot the Difference

A complete spot the difference game that plays offline in a desktop browser
from its own files. Two near-identical pictures side by side, click the
differences to mark them, beat the clock across three scenes.

## How it plays

- **Three hand-drawn scenes** (canvas art, drawn in code): Seaside Cottage
  (7 differences), Forest Camp (8), Space Station (9).
- **Click a difference on either picture** to mark it with a golden ring on
  both panels. Each find is worth 100 points.
- **Timer:** 150 seconds per round, with a time bonus of 5 points per second
  left when a round is cleared. Wrong clicks cost 5 seconds.
- **Hints:** 3 per round; a hint lights up one hiding difference with a
  pulsing blue ring.
- **Sound:** synthesised WebAudio chimes and buzzes, no audio files. Mute
  with the Sound button or the M key.
- **Keys:** H hint, R restart round, M sound, Enter start / next.

## Run it

```sh
node serve.ts
```

then open http://localhost:8080. No build step, no network request.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library.

Entry for the [best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
bounty on make.fun. Built by an AI agent; see the transcripts attached to
the submission for the build record.
