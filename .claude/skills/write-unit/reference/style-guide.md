# House style for study units

The reference for register and density is `units/docker/ch05.html` (a chapter) and
`units/docker/index.html` (a hub). Read one before writing; do not copy their content.

## The reader and the promise

- The reader is a working practitioner who wants to *understand*, not a beginner who wants
  reassurance. They have the prerequisites the hub lists, and nothing more.
- Every chapter explains **mechanisms** — why a thing behaves as it does — and dismantles at
  least one specific, common misconception. A chapter that only lists features has failed.
- Specific beats general, every time: real commands with real flags, real numbers
  ("ten seconds, then SIGKILL, exit 137"), real failure modes, real file contents.

## Voice

- Plain, direct declaratives. Confident where the facts are settled; explicit about where
  they are not.
- **British spelling**: behaviour, optimise, catalogue, artefact, licence (noun),
  parameterised, colour.
- Spaced em dashes — like this. A non-breaking space between a number and its unit:
  `48&nbsp;MB`, `10&nbsp;s`.
- No filler. Never: "In this chapter we will…", "Let's dive in", "It's important to note",
  "simply", "just" (as a minimiser), exclamation marks, emoji, rhetorical questions as headings.
- One bold phrase per paragraph at most — the claim that matters. `<strong>` in prose,
  `<b>` in the lede, recap, readouts and table cells.
- Cross-reference by chapter number — "(ch. 6)" or "chapter 6" — and only to chapters that
  exist in this unit's manifest. Refer to other catalogue units by their catalogue title.
- Paragraphs of 2–5 sentences. Prose carries the argument; tables carry comparisons; code
  carries exact syntax. Don't restate a table in prose.

## Accuracy and currency

- Write for the current stable versions as of the date in your brief. Where behaviour changed
  in a recent version, name the version ("since Engine 25", "PostgreSQL 17 and later").
- **Never invent** a flag, option, API, default value, version number, statistic, benchmark,
  quote or source. If you are not certain and cannot verify it against the primary
  documentation (fetch the official page), leave the detail out.
- Every command must be valid for the tool and version stated. Sample output must be
  plausible and internally consistent across the chapter (same names, ports, digests, PIDs).
- Destructive commands are introduced by a `warn` callout and say what they destroy.
- Footer **Sources** name real primary documents (official docs, specifications, RFCs,
  standard texts) in prose. No URLs.

## Chapter anatomy

```
<head>        title "N · Title — Unit", meta description, favicon (identical to the hub's), fonts, assets/unit.css
<body data-ch="chNN">
#prog
header.band   a.crumb → index.html · .chno <b>Chapter N</b><span>Part name</span> · h1 (= manifest t)
              p.lede (2–3 sentences, one <b>) · .meta: "28 min" "2 demos" "8 sections" "4 self-checks"
.shell        nav.side (empty — built from the sections) + main
  main        6–8 content <section id> blocks, then <section id="recap">
footer.foot   .fi Next · .fi Try it now · .fi Sources
button.top, then <script src="assets/unit.js">, <script>initChapter();</script>, then the demo <script>
```

Use `python .claude/skills/write-unit/scripts/scaffold.py skeleton <slug> <chNN>` — it fills
everything the manifest already knows.

**Sections.** `<section id="short-kebab-id">`, then `<h2 data-nav="Rail label">Full heading</h2>`
(rail label ≤ 4 words), then `<p class="sub">…</p>` — one italic line that makes a claim
("The context is sent first, and that matters more than people expect"), not a label.

**Typical density** (Docker ch05): 8 sections including the recap; ~6 code blocks; ~6 tables;
3–5 callouts; 2 demos; recap of 8 bullets; 4 self-checks; 1,400–1,900 words of prose outside
code; 35–48 KB of HTML. The meta spans must match what the page actually contains — the
validator counts them.

**Recap.** `<div class="recap"><h2>Chapter N in eight lines</h2><ul>…</ul></div>` — the number
word matches the bullet count. Each bullet is one complete, standalone fact with its key phrase
in `<b>`. A reader who reads only the recap should get the chapter's spine.

**Check yourself.** 3–5 `<details class="chk">`. Questions are scenarios, not definitions:
a symptom to diagnose, a colleague's claim to evaluate, an output to predict, a design to
critique. Answers are full paragraphs: the answer first, then the mechanism, then the fix or
the related rule. Never "see above". At least one should be answerable only by having
understood a demo.

**Footer.** *Next*: one or two sentences previewing the next chapter's specific content.
*Try it now*: three `<li>`, each doable in a few minutes, usually with a `<code>`.
*Sources*: the primary documents, by name. The last chapter's first two headings may differ
("Where next", "Keep to hand").

## Components

Code block — `<pre>` starts at column 0 because whitespace inside it is literal; escape `<`,
`>` and `&`:

```html
      <div class="code">
        <div class="code-top"><span class="tag">what <code>docker build .</code> does</span><button class="copy">Copy</button></div>
<pre data-lang="sh">$ docker build -t my-app:dev .
 => [internal] load build context      2.1s      &lt;- the tarball</pre>
      </div>
```

- `data-lang`: `sh`, `yaml` and `diff` are syntax-coloured by the engine; any other value
  (`js`, `python`, `sql`, `json`, `hcl`, `dockerfile`, `text`, `md`…) renders plain.
- Shell: `$ ` before commands, output without it, `# ` comments aligned in a column.
- The tag is a lower-case description of what the block shows, and may contain `<code>`.
- Every block is correct as shown; mark excerpts with `…`.

Table — `<td class="yes">` / `<td class="no">` for boolean cells; ideally ≤ 4 columns:

```html
      <div class="tw">
        <table class="tbl">
          <thead><tr><th>Instruction</th><th>Does</th><th>Watch out for</th></tr></thead>
          <tbody>
            <tr><td><code>EXPOSE</code></td><td>Documents a port</td><td><b>Publishes nothing.</b> Purely metadata (ch. 12)</td></tr>
          </tbody>
        </table>
      </div>
```

Callouts — the label is a **statement**, never a bare word like "Note":

```html
      <div class="key">
        <span class="lbl">PID 1 ignores signals it has no handler for</span>
        <p>…</p>
      </div>
```

| class | meaning | colour |
|---|---|---|
| `key` | a fact worth remembering | accent |
| `trap` | something that will bite you | red |
| `warn` | destructive or irreversible | amber |
| `tip` | a shortcut worth adopting | green |

3–5 per chapter. Not one per section.

Definition list for terms: `<dl class="dl"><dt>term</dt><dd>meaning</dd></dl>`.

## Demos

Demos are why these units are worth reading. Each one is a small, honest instrument.

1. **Real logic.** The demo computes its answer from its inputs by implementing the actual
   rule, algorithm or specification — the ENTRYPOINT/CMD combination matrix, a cache
   invalidation rule, SHA-256, a B-tree split, a TCP congestion window, a RICE score, a query
   planner's cost comparison. Never canned outputs keyed by which button was pressed; never an
   animation of a process that is not actually being computed.
2. **It targets the chapter's misconception.** The default state shows the correct or
   healthy configuration; one or two clicks away is the failure the chapter warns about, and
   the readout explains it.
3. **Three outputs.** A `.term` showing the concrete artefact the reader would see (the file,
   the command, its output); a `.rgrid` of 3–4 tiles with the key numbers (mark the good one
   `.hi`); a `.readout` explaining *why* — 2–4 sentences that change with the state, cause in bold.
4. **Meaningful on load.** Call `render()` once at the end of the IIFE. Empty outputs on load
   are a validator error.
5. **Honest models.** If it approximates (latency, cost, probability), say so under it, list the
   assumptions, and label numbers as estimates.

Markup:

```html
      <div class="demo">
        <div class="demo-top">
          <h3>ENTRYPOINT / CMD resolver</h3>
          <span class="hint">The exact argv, who becomes PID 1, and whether <code>docker stop</code> is graceful</span>
        </div>
        <div class="demo-body">
          <div class="ctrl tight">
            <span style="font-size:12.5px;color:var(--text-2);min-width:88px">ENTRYPOINT</span>
            <span id="e-ep" style="display:flex;gap:8px;flex-wrap:wrap"></span>
          </div>
          <div class="ctrl">
            <button class="btn mono" id="e-init">--init</button>
          </div>
          <div class="term" id="e-term"></div>
          <div class="rgrid" id="e-out"></div>
          <p class="readout" id="e-note"></p>
        </div>
      </div>
```

- Controls: `.ctrl` rows of `button.btn` (`.mono` for code-like labels, `.on` for the selected
  state — in an exclusive group, clear `.on` on the siblings), `select`, `input[type=range]`
  (show its value next to it), `textarea.field` for free text, `.sep` between groups.
- `.term` spans: `p` prompt, `g` good, `r` bad, `y` highlight, `d` dim aside.
- `.rgrid` tile: `<div class="r [hi]"><span class="k">Label</span><span class="v">42<small> unit</small></span></div>`
  — build with `textContent`, as Docker ch05's `tile()` does.

Script rules (the validator enforces most of these):

- One IIFE per demo, all in a single `<script>` after `<script>initChapter();</script>`, each
  under a banner comment naming the demo and what it implements.
- ES5 style to match the existing units: `var`, function declarations, no modules or imports.
- No network (`fetch`, XHR, WebSocket), no storage (`localStorage`, `sessionStorage`,
  IndexedDB), no `eval`/`new Function`, no timers that run forever — an animation stops on its
  own or is user-toggled.
- A unique id prefix per demo (`e-`, `a-`, `c-`…). Every id looked up must exist in the markup.
- Escape anything inserted through `innerHTML` with a local `esc()`.
- Keep each demo under ~200 lines. Logic needed by several chapters belongs in the unit's
  shared helpers (`assets/unit.js`, above the engine) — ask the orchestrator rather than
  duplicating it.

### Subjects without much code

Roles & craft units (engineering manager, product manager, technical writer, DevRel, QA,
product design) follow the same rules. Their demos are calculators, decision tools and
simulators implementing real frameworks: RICE/ICE prioritisation, capacity planning with a
focus factor, Little's law for WIP and lead time, hiring-funnel conversion, Flesch–Kincaid
readability (implemented, not looked up), OKR scoring, A/B-test sample size, burndown with
scope creep. Their code blocks hold templates and documents (`data-lang="text"` or `"md"`):
a 1:1 agenda, a PRD skeleton, an incident review, a style-guide excerpt.

## Hub page

- **Lede**: the unit's thesis in 2–3 sentences, one `<b>`.
- **Before you start**: what it assumes (concretely), how to read it, what to have open.
- **Reading paths**: three goal-shaped paths in the reader's words ("My images are enormous
  and slow") plus "I need to understand it properly"; sequences use chapter numbers that exist.
- **Where the demos come from**: an honest account of what is real and how it was checked.
- **Source material**: Structure (the roadmap.sh roadmap, expanded), Authority (primary
  sources by name), Related units (catalogue units by title, and which chapters connect).
- **Start here**: chapter 1 and the chapter most readers come for.

## The manifest

- 16–24 chapters in 4–6 parts of 3–6 chapters each.
- Chapter 1 is orientation: what the thing is, the mental model, where it sits among its
  neighbours. The last chapter is "Practice and reference": the model in five sentences, a
  task-indexed reference, recipes for when something is broken, a glossary, a quiz.
- Use the roadmap.sh roadmap and the catalogue keywords as a coverage checklist, but order for
  understanding: mechanisms before tools, fundamentals before frameworks, normal operation
  before failure.
- `t`: ≤ 45 characters and specific ("Namespaces, cgroups and capabilities", never "Advanced
  topics"). `d`: 1–2 concrete sentences naming the payoff or the misconception.
- `mins` 20–32 typically; `demos` 2 typically, 1 for reference-heavy chapters, 0 rarely.
- If a chapter's title changes while writing, change the manifest too
  (`scaffold.py unit … --force`). Page titles and the manifest must agree.
