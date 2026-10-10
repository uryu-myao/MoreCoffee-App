# Design brief — group A (2026-10-10)

For Design. Read with `design-system.md` (the values in force), `components.md`, `drift.md` and `gaps.md`. Take values from those four files only.

**Apply every change below to your source files, not to the exported HTML.** An earlier export restored captions that had been fixed only in the HTML (3b, 3c, 3d, 3g). Wording and captions must be changed at the source, or the next export undoes them.

Group B is not included yet; its scope is decided after group A.

---

## A-1 用語の統一（完了済み — 残り 1 件のみ）

完了済み:
- 3c 標注「Add beans」→「Add a bag」
- 5a の入力項「Beans」→「Bag」
- 8e「Add bag to my shelf」→「Add bag to my beans」
- 8o「I'll add beans later」→「I'll add a bag later」
- 3b 標注「My gear / Tap a row to edit (→ 3e)」
- 3d 標注「My beans / Tap a card to edit (→ 3g)」
- 3g 標注「Edit bag」

**残り（未実施）**:
- 2c の「Beans」→「Bag」（「from my shelf」は変更しない）

用語の定義は `design-system.md` §1 Words（bag / beans / shelf）。

## A-2 構造変更

- 3b: ⋮ ボタンとメニューを廃止。行全体をタップ可にし、行末に chevron。棕色の行も廃止
- 3d: カード内の既存の破線を境界に二分する。
  - 上（情報区）= タップで 3g へ、右端に chevron。Edit ボタンを削除。
  - 下（ボタン区）= Finish bag のみ、全幅
- 2a: 筛选アイコンボタンを棕色から通常のアイコンボタンへ（カード色底、墨色アイコン）
- 3d: Finish bag を Edit と同じ secondary ボタンへ
- 7a: 通知リストの行に chevron を追加
- 8f: 4 本の横条を AxisReadout に置き換える
- 8f: 等級詞（High / Light 等）を AxisReadout 下の段名注記にし、棕色から中性色へ
- 8f: 最初の語「juicy 9」の 2px 墨枠を外す。最頻であることは並び順だけで表す

## A-3 Taste axis slider (5b): redraw to the current spec

- Draw only from `design-system.md` §9 **Taste axis slider**, the one place it is specified. Its "Superseded — do not draw" list names every earlier version.
- **Two states only: `empty` and `entered`.** No lit colour, no dragging state, no pole-label change. Pressed is the handle scaled to 0.88; no need to draw it.
- **Track**: 260 × 34, centred in the card, 2px `text.secondary` frame on `surface.raised`, the same in both states.
  - **Dots**: 6pt `border.subtle` at the 5 stops, 15 inside the frame, 56.5 apart.
- **Handle**: a 26 square, inset 2. It is opaque and covers its dot. It has a 2 × 8 white grip.
  - `empty`: `surface.muted` fill, 2px `border.muted`, resting at the middle stop.
  - `entered`: `icon.accent` fill, 2px ink.
- **Labels**: pole labels in `label.caps`, `text.muted`, at the track's ends.
- **Status line**: 4 below the track, right-aligned.
  - entered → **Clear**: `meta` as written, ink, underlined.
  - empty → **"Not noted"**: `meta`, `text.muted`.
- **5b content**:
  - Acid ↔ Bitter at stop 1 (Bright);
  - Light body ↔ Full body at stop 2 (Medium-bodied);
  - Light roast ↔ Dark roast at stop 1 (Light roast);
  - Low ↔ High sweetness empty.
  - The axes stay in this fixed order, `gap.axis` (20) apart.
- The display on 1b / 4a / 4b / 5c / 8f is **AxisReadout**, a separate item (A-2). Do not draw it with this slider's parts.

## A-4 色の統一

文字だけの操作 12 箇所をすべて墨色へ。うち 9 箇所に下線:
- 6d Remove photo
- 6d Discard
- 7b Next notification
- 7b Back to list
- 8c Skip all
- 8e Add bag to my beans
- 8e Not for me
- 8f How it is built
- 8h Clean up

下線不要（位置が手がかり）: 2b Reset / 5d Keep as draft / 8l Cancel

その他:
- 3e / 3g の削除行の文字も墨色へ
- すべての addSlot 破線を #6B5D55 へ（12 用例 11 屏）。5b Search は 1.5px → 2px
- 8c のチェックボックス選択時を青 → 墨色
- 3e のスイッチを 62×34・墨色 → 52×30・青

## A-5 値のずれ

- カード内边距を 20/18 に統一
- ボトムシート内の gap: 3b 18 / 2b 22 → どちらも 12
- 3c カードの gap 18 → 12、3e の 20 → 12
- 8e「Log a cup with this plan」の影 4px → 5px
- 4b の beanFreshness の todayMarker を 3d 方式（専用の濃色）に揃える

## A-6 フォームの不足項目

- 3c / 3g に Origin / Region / Process を追加（3c は Roast level の下に省略可能な 1 行、3g は全項目）
- 袋の Roast level を 3 択 → 4 択に（Light / Medium / Medium-dark / Dark。未設定も可）

---

## Also in this round: Design's own findings (`drift.md` D-35 – D-41)

| # | screen | fix |
|---|---|---|
| D-35 | 8n | Radio markers are round (the first break of the 0-radius rule). **Propose a square radio marker**: no radius, distinct from the checkbox's tick |
| D-36 | 8n | The selected radio is blue → **ink** (a chosen option; same fix as 8c's checkbox) |
| D-37 | 8o | The optional fields' 1.5 dashed underline would be a third meaning of dashed. **Survey the other forms (3c 3e 3g 5a 6d) and report** whether there is a consistent rule for optional fields (C-2) before changing it |
| D-38 | 8o | Placeholder `#A39389` is not a token. Every other plain field's placeholder is `text.secondary` (`gaps.md` 23). Hold until the placeholder colour is decided |
| D-39 | 8c 8n 8o | Footer bottom padding 38 on all three setup screens. **Check whether the flow's footer differs for a reason** and report; it is either a setup-flow rule or drift to 34 |
| D-40 | 3g | "Remove photo": the muted-outline look → **`secondary` + `small` (36)**, as "Replace" |
| D-41 | 8n 8o | "Skip all", "I'll add a bag later": brown → **ink + underline** |
