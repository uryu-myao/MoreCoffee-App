# MoreCoffee — i18n notes

Decided strings and translation constraints, recorded ahead of the ja / zh-Hans release. Only strings listed here are decided; anything else in the dev harness is a placeholder.

## Decided strings

| key | en | ja | zh-Hans | decided | note |
|---|---|---|---|---|---|
| `maker.packaged` | Packaged | 市販品 | 市售 | 2026-10-04 | Replaces "Ready-to-drink" in "Who made it?". The axis is who made the coffee, not its container — a can is not "bottled". |

## Fit checks

- **"Who made it?" maker chips** (`I made it / Barista / Packaged`): one line at 390pt and 393pt — 321px of chips in 346 / 349px of content width (web harness, Archivo). ja and zh placeholder sets also fit on one line.

## Scheduled for the V1.1 i18n pass

Both are recorded in `design-system.md` §11 (OQ-14):

- CJK bold — extend the font-face mapping to (family, weight, lang).
- `labelEyebrow` letter-spacing (1.6) is tuned for Latin capitals and reads too loose on CJK.
