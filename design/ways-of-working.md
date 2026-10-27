# Ways of working

## Handing work to Design (decided 2026-10-14)

**Files only.** Everything Design needs is in a file in this repository. A brief that needs a spoken note is an incomplete brief: write the note into it. Six months on, the whole context must be readable from the repository.

Only three exceptions, and each is written into the brief too:
- **Overturning an earlier decision**: say why the old rule no longer holds. (First case: 2026-10-14's brief, items 2 / 6. §9's "Packaged line 2 = brand" was our analogy from bean / roaster, not drawn in any mock; the mocks show the store there, and 5e's "Brand" field holds brand and product in one value.)
- **Answering Design's questions**: put each question next to its answer.
- **Changing the hand-off itself** (like this section).

**Round numbers.** Every brief opens with one line:

> Round N · responds to design-response-next.md Round N−1

and Design numbers its reply Round N. Item numbers follow `design-missing.md`, but across rounds "item 6" can mean different things; the round says which exchange a request belongs to.

## Before sending a brief (decided 2026-10-23)

Round 12 got four items answered twice, and differently: answered and built since Round 1, they were still in `design-brief-next.md`. One of them came back wrong because our brief was wrong (it said lock-in counts "cups"; the rule counts notes). Before a brief goes out:

1. **Every item must be unanswered.** Find each one in `design-response-next.md`. If Design has answered it, it does not go in the brief; move it out of `design-brief-next.md`.
2. **Remove an item in the commit that builds its answer.** No "moved out" pointers left behind in its place: the item goes.
3. **Check every rule the brief states against the code, or the answer it was built from.** A rule written from memory is how "cups" got in.
4. **When Design's answer disagrees with an earlier decision, suspect our brief first.** Design answers from what we wrote, so a wrong brief gets a wrong answer, and it comes back looking like Design's. Before adopting the answer, read how the brief put that item. We caught notes / cups only because we knew the code; an item we don't know as well would get through.
