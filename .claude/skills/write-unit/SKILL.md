---
name: write-unit
description: Write (or resume) a complete study unit for the Roadmaps_Notes catalogue — hub page plus 16–24 chapters with working interactive demos — in the house format, validate it, and register it in index.html. Use for "write the Kubernetes unit", "next unit", "continue the Rust unit", or "complete the remaining topics". Arguments - a catalogue slug, or "next" (default); add "plan" to stop after the outline.
---

# Write a study unit

One invocation = one unit, finished or checkpointed. To work through the backlog, invoke it
repeatedly (`/write-unit next`), or loop it (`/loop /write-unit next`).

Everything lives in this skill folder:

| path | what |
|---|---|
| `reference/style-guide.md` | voice, chapter anatomy, components, demo rules, manifest rules |
| `scripts/catalogue.py` | read the catalogue, pick the next unit, register a unit |
| `scripts/scaffold.py` | create a unit's assets and hub from a manifest; print chapter skeletons; edit LIVE |
| `scripts/check_unit.py` | validate a unit or chapters (static + jsdom runtime pass) |
| `templates/` | hub, chapter, CSS and engine templates the scripts fill |
| `../../agents/unit-chapter-writer.md` | the subagent that writes one chapter |

Run scripts from the repo root with `python`. The runtime pass needs jsdom once:
`npm install --prefix .claude/skills/write-unit/scripts/smoke`.

## 0 · Pick the unit

```
python .claude/skills/write-unit/scripts/catalogue.py status --remaining
python .claude/skills/write-unit/scripts/catalogue.py show <slug>
```

- Argument is a slug → that unit. `next` or nothing → whatever `catalogue.py next` prints
  (in-progress units first, then catalogue order).
- State **legacy folder** (a folder in an older layout that isn't registered): stop and ask
  the user whether to rebuild it in the current format. Never delete or overwrite it without
  that answer.
- **In progress in an older engine** (`status` lists them; e.g. `softwarearchitect`,
  `bianalyst`, whose `unit.js` uses `const CHAPTERS` inside an IIFE): `next` skips these. Only
  work on one when the user asks, and then finish it in that unit's own format — copy the
  structure of its existing chapters, not this skill's templates.
- State **in progress** or **started, unregistered** (current format): resume. Read `assets/unit.js` for the
  manifest and LIVE, run `check_unit.py <slug>`, and go to step 4 with the chapters not in LIVE.
  The briefs from the earlier session are gone; rebuild them from the manifest's `d` lines and
  the chapters already written.

## 1 · Research

- The catalogue entry: title, line, `d`, and `k` (the keywords are a coverage checklist).
- The roadmap.sh roadmap for the topic — the hub promises the chapter list follows it. Use
  `roadmap-topic-outlines.md` at the repo root: every one of the 82 roadmaps, extracted from the
  roadmap PDFs, under a heading whose anchor is the slug (`grep -n 'id="<slug>"'`). The
  roadmap.sh pages render client-side, so fetching them returns no topics.
- The primary documentation's table of contents, and what changed in recent major versions.
- Neighbouring units already written (`units/*/index.html`): cross-reference them rather than
  re-teach them (Kubernetes points at Docker for images; Django at Python and SQL).

## 2 · Design the manifest and the briefs

Follow "The manifest" in the style guide. Write two files to the session scratchpad:

- `manifest.json` — the format is in the docstring of `scaffold.py`. Include `description`
  (the hub's meta description: "A 22-chapter study unit on X: …"), `lede`, and optionally
  `favicon_svg` (a 32×32 SVG on an `#0C1D30` rounded square, if the subject has an obvious
  glyph; otherwise the default catalogue icon in the line colour is used).
- `briefs.md` — one block per chapter: the 6–8 section ids and headings; the misconception to
  dismantle; each demo's spec (the real rule or algorithm it implements, its inputs, the
  healthy default, the failure one click away, what the readout explains); facts that must be
  verified; cross-references.

Design the demos at this stage, across the whole unit: they should vary (resolvers, simulators,
calculators, step-throughs, visualisers) and each must compute rather than replay. If two or
more chapters need the same non-trivial logic (a hash, a parser, a planner core), plan it as a
shared helper.

If the argument included `plan`: show the user the part/chapter outline (titles and one-line
descriptions) and stop.

## 3 · Scaffold

```
python .claude/skills/write-unit/scripts/scaffold.py unit <scratchpad>/manifest.json
```

This writes `units/<slug>/assets/unit.css` (the line's accent palette, contrast-checked),
`assets/unit.js` (manifest + empty LIVE + engine) and `index.html` (from the hub template).

- Fill every `{{WRITE: …}}` in `units/<slug>/index.html` yourself, following "Hub page" in the
  style guide. Reading-path sequences must use chapter numbers that exist.
- Write shared helpers into `assets/unit.js` in the slot above `function escapeHtml`, and test
  them with node against known values before any chapter depends on them.
- `python .claude/skills/write-unit/scripts/check_unit.py <slug> --no-smoke` should now report
  only "not live" warnings.

## 4 · Write chapters in waves

Dispatch `unit-chapter-writer` subagents, **up to 6 in parallel in one message**, in chapter
order (the first wave includes ch01, which sets the unit's register). If that agent type is not
available in this session (agents load at session start), use `general-purpose` and begin the
prompt with "Read .claude/agents/unit-chapter-writer.md and follow it exactly."

Prompt for each writer:

```
Unit: <slug> (<title>), chapter <chNN> of <N>: "<t>"
Today's date: <date>

Brief:
<the chapter's block from briefs.md>

The unit's chapters (for cross-references — only these exist):
<n. t, one per line>

Next chapter (for the footer): <n+1>. <t> — <d>          (or: this is the last chapter)
Shared helpers available in assets/unit.js: <names and signatures, or "none">

Write units/<slug>/<chNN>.html following .claude/agents/unit-chapter-writer.md, validate it
with check_unit.py, and report back in the format given there.
```

## 5 · After each wave

1. For each returned chapter: `check_unit.py <slug> --chapter <chNN>`. Clean → mark it live:
   `python .claude/skills/write-unit/scripts/scaffold.py live <slug> <chNN> [<chNN> …]`.
   Errors → send them back to the same writer (SendMessage) or fix small ones yourself.
2. **Read at least one chapter per wave in full.** The validator checks structure and that
   demos run; it cannot judge whether the prose is right, the commands are valid, or the demo
   computes anything real. Check those, and correct the next wave's briefs if a pattern is off.
3. Apply writers' manifest suggestions (`scaffold.py unit <manifest> --force` keeps LIVE and
   shared helpers) and helper suggestions.
4. Checkpoint the catalogue after the first wave, and update it each wave:
   `python .claude/skills/write-unit/scripts/catalogue.py register <slug> --state progress --m "<live> of <N> chapters"`

Keep your own context lean: rely on the writers' reports and the validator rather than reading
every chapter, so the session survives a 24-chapter unit.

## 6 · Finish

```
python .claude/skills/write-unit/scripts/check_unit.py <slug>
python .claude/skills/write-unit/scripts/catalogue.py register <slug> --state written --m "<N> chapters, <M> demos"
python .claude/skills/write-unit/scripts/check_unit.py <slug>          # no catalogue warnings now
```

Report to the user: the unit, chapters / demos / reading hours, anything the writers could not
verify, any manifest changes, and the remaining-unit count from `catalogue.py status`.

Do not commit or push unless the user asks — the GitHub Pages workflow publishes whatever
reaches `main`.

## Notes

- Only the root `index.html` and `units/` are the live catalogue. Zip files dropped in the repo
  root are batches of units; compare them with `units/` before installing anything, and treat
  their own `index.html` copies as stale.
- Several units were built by older engines (`NN-name.html` chapters, `const CHAPTERS` inside an
  IIFE). `check_unit.py` only validates the current format; leave those units' structure alone.
- Docker and Git & GitHub are the reference units, but they have drift this skill must not
  reproduce: several page titles differ from their manifest titles, and some `.meta` counts
  are stale. The validator flags both.
- A slug may only be registered once `units/<slug>/index.html` exists; `catalogue.py` refuses
  otherwise.
