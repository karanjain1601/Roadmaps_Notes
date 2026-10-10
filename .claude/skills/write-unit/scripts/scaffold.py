#!/usr/bin/env python3
"""Create and maintain a unit folder in the current house format.

  scaffold.py unit <manifest.json> [--force]   write assets/unit.css, assets/unit.js, and index.html (if absent)
  scaffold.py skeleton <slug> <chNN>           print a chapter skeleton with every known field filled in
  scaffold.py live <slug> <chNN>... [--remove] add chapters to (or take them out of) LIVE in unit.js
  scaffold.py palette                          print the accent palette for every catalogue line

The manifest is JSON:

  {
    "slug": "kubernetes",
    "description": "A 22-chapter study unit on Kubernetes: …",      <meta name=description> of the hub
    "lede": "Hub lede. May contain <b>, <code>, <em>.",
    "favicon_svg": "<svg …>…</svg>",                                 optional; default is the catalogue icon in the line colour
    "parts":    [{"id": "found", "name": "Foundations", "blurb": "…"}, …],
    "chapters": [{"n": 1, "p": "found", "mins": 26, "demos": 2, "t": "…", "d": "…"}, …]
  }

Title and line come from the catalogue entry, so they cannot drift from it.
"""
import argparse
import colorsys
import json
import pathlib
import re
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import catalogue  # noqa: E402

SKILL = pathlib.Path(__file__).resolve().parents[1]
TEMPLATES = SKILL / "templates"
UNITS_DIR = catalogue.UNITS_DIR

INK, PAPER, WHITE = "#0C1D30", "#ECEFF2", "#FFFFFF"

# The DevOps & cloud palette is the one Docker and Git & GitHub shipped with;
# keep it exact so new units on that line match them.
PALETTE_OVERRIDES = {
    "ops": {"acc": "#7C8CF8", "deep": "#3D4CC0", "mid": "#5A6BE0", "wash": "#EEF0FE",
            "line": "#C7CEFB", "light": "#A9B4FB"},
}


# ------------------------------------------------------------------ colour
def _rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def _hex(rgb):
    return "#" + "".join(f"{round(max(0, min(1, c)) * 255):02X}" for c in rgb)


def _lum(h):
    def lin(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (lin(c) for c in _rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = sorted((_lum(a), _lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def _mix(a, b, t):
    return _hex(tuple(x + (y - x) * t for x, y in zip(_rgb(a), _rgb(b))))


def _darken_until(base, test):
    h, l, s = colorsys.rgb_to_hls(*_rgb(base))
    while l > 0.05:
        c = _hex(colorsys.hls_to_rgb(h, l, s))
        if test(c):
            return c
        l -= 0.005
    return _hex(colorsys.hls_to_rgb(h, l, s))


def palette(line_id, base):
    if line_id in PALETTE_OVERRIDES:
        return dict(PALETTE_OVERRIDES[line_id])
    wash = _mix(base, WHITE, 0.87)
    # deep carries link text, labels and highlighted values on paper, card and wash
    deep = _darken_until(base, lambda c: contrast(c, PAPER) >= 6.0 and contrast(c, wash) >= 6.0)
    # mid is the link hover colour: still has to read as text
    mid = _darken_until(_mix(base, deep, 0.45), lambda c: contrast(c, PAPER) >= 4.5)
    return {"acc": base.upper(), "deep": deep, "mid": mid, "wash": wash,
            "line": _mix(base, WHITE, 0.57), "light": _mix(base, WHITE, 0.34)}


# ---------------------------------------------------------------- manifest
def load_unit_js(slug):
    """Evaluate units/<slug>/assets/unit.js in node and return PARTS, CHAPTERS, LIVE."""
    path = UNITS_DIR / slug / "assets" / "unit.js"
    if not path.exists():
        sys.exit(f"{path} does not exist")
    code = (
        "const fs=require('fs'),vm=require('vm');"
        "const src=fs.readFileSync(process.argv[1],'utf8');"
        "const ctx={};vm.createContext(ctx);"
        "vm.runInContext(src+';this.__m={PARTS:PARTS,CHAPTERS:CHAPTERS,LIVE:Array.from(LIVE)};',ctx,{filename:'unit.js'});"
        "process.stdout.write(JSON.stringify(ctx.__m));"
    )
    r = subprocess.run(["node", "-e", code, str(path)], capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        sys.exit(f"unit.js failed to evaluate:\n{r.stderr.strip()}")
    return json.loads(r.stdout)


def check_manifest(m, entry):
    errs = []
    for k in ("slug", "description", "lede", "parts", "chapters"):
        if not m.get(k):
            errs.append(f"missing {k}")
    if errs:
        return errs
    part_ids = [p.get("id") for p in m["parts"]]
    if len(set(part_ids)) != len(part_ids):
        errs.append("duplicate part ids")
    for p in m["parts"]:
        for k in ("id", "name", "blurb"):
            if not p.get(k):
                errs.append(f"part {p.get('id', '?')}: missing {k}")
    chs = m["chapters"]
    if not 12 <= len(chs) <= 30:
        errs.append(f"{len(chs)} chapters; expected 12–30 (16–24 is typical)")
    for i, c in enumerate(chs, 1):
        tag = f"chapter {c.get('n', '?')}"
        if c.get("n") != i:
            errs.append(f"{tag}: n should be {i} (chapters are numbered 1..N in order)")
        if c.get("p") not in part_ids:
            errs.append(f"{tag}: part {c.get('p')!r} is not in parts")
        if not isinstance(c.get("mins"), int) or not 10 <= c["mins"] <= 45:
            errs.append(f"{tag}: mins must be an integer 10–45")
        if not isinstance(c.get("demos"), int) or not 0 <= c["demos"] <= 4:
            errs.append(f"{tag}: demos must be an integer 0–4")
        for k in ("t", "d"):
            if not c.get(k):
                errs.append(f"{tag}: missing {k}")
    order = [c.get("p") for c in chs]
    seen = []
    for p in order:
        if not seen or seen[-1] != p:
            if p in seen:
                errs.append(f"part {p!r} is split: its chapters must be contiguous")
            seen.append(p)
    for p in part_ids:
        if p not in order:
            errs.append(f"part {p!r} has no chapters")
    if m["slug"] != entry["s"]:
        errs.append("slug mismatch")
    return errs


def favicon(m, acc):
    svg = m.get("favicon_svg") or (
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>"
        f"<rect width='32' height='32' rx='6' fill='{INK}'/>"
        f"<path d='M6 16h20' stroke='{acc}' stroke-width='4' stroke-linecap='round'/>"
        f"<circle cx='11' cy='16' r='3.4' fill='{INK}' stroke='#fff' stroke-width='2'/>"
        f"<circle cx='21' cy='16' r='3.4' fill='{INK}' stroke='#fff' stroke-width='2'/></svg>"
    )
    svg = svg.replace('"', "'")
    return "data:image/svg+xml," + svg.replace("<", "%3C").replace(">", "%3E").replace("#", "%23")


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def render_unit_js(title, m, live, middle):
    parts = ",\n".join(
        f"  {{ id: {js_str(p['id'])}, name: {js_str(p['name'])}, blurb: {js_str(p['blurb'])} }}" for p in m["parts"])
    chs = []
    for c in m["chapters"]:
        cid = f"ch{c['n']:02d}"
        chs.append(
            f"  {{ id: \"{cid}\", n: {c['n']},{' ' * (3 - len(str(c['n'])))}p: {js_str(c['p'])}, "
            f"mins: {c['mins']}, demos: {c['demos']},\n"
            f"    t: {js_str(c['t'])},\n"
            f"    d: {js_str(c['d'])} }}")
    engine = (TEMPLATES / "engine.js").read_text(encoding="utf-8")
    chapters = ",\n".join(chs)
    return (
        "/* ============================================================\n"
        f"   {title} — shared manifest, helpers and chapter scaffolding.\n"
        "   Self-contained: this unit has no dependency on any parent\n"
        "   directory except the optional catalogue link.\n"
        "\n"
        "   ONE manifest drives everything: the hub listing, the pager and\n"
        "   the counts. A chapter goes in LIVE only once its file exists\n"
        "   and passes check_unit.py.\n"
        "   ============================================================ */\n\n"
        f"var PARTS = [\n{parts}\n];\n\n"
        f"var CHAPTERS = [\n{chapters}\n];\n\n"
        f"var LIVE = new Set([{', '.join(js_str(x) for x in live)}]);\n"
        f"{middle}"
        f"{engine}"
    )


DEFAULT_MIDDLE = "\n/* Helpers shared by several chapters' demos go here, above the engine. */\n\n"


def cmd_unit(args):
    m = json.loads(pathlib.Path(args.manifest).read_text(encoding="utf-8"))
    html = catalogue.read_index()
    entry = next((u for u in catalogue.units(html) if u["s"] == m.get("slug")), None)
    if not entry:
        sys.exit(f"{m.get('slug')!r} is not in the catalogue")
    errs = check_manifest(m, entry)
    if errs:
        sys.exit("manifest problems:\n  " + "\n  ".join(errs))

    lines = {lid: (name, col) for lid, name, col in catalogue.lines_meta(html)}
    line_name, base = lines[entry["l"]]
    pal = palette(entry["l"], base)
    title = entry["t"]

    d = UNITS_DIR / m["slug"]
    js_path = d / "assets" / "unit.js"
    live, middle = [], DEFAULT_MIDDLE
    if js_path.exists():
        if not args.force:
            sys.exit(f"{js_path} exists; pass --force to regenerate it (LIVE and shared helpers are kept)")
        old = js_path.read_text(encoding="utf-8")
        ids = {f"ch{c['n']:02d}" for c in m["chapters"]}
        live = [x for x in load_unit_js(m["slug"])["LIVE"] if x in ids]
        mm = re.search(r"^var LIVE = new Set\(.*?\);\n(.*?)^function escapeHtml\(s\) \{", old, re.S | re.M)
        if mm:
            middle = mm.group(1)
    (d / "assets").mkdir(parents=True, exist_ok=True)

    css = (TEMPLATES / "unit.css").read_text(encoding="utf-8")
    for k, v in {"UNIT_TITLE": title, "LINE_NAME": line_name, "ACC": pal["acc"], "ACC_DEEP": pal["deep"],
                 "ACC_MID": pal["mid"], "ACC_WASH": pal["wash"], "ACC_LINE": pal["line"],
                 "ACC_LIGHT": pal["light"]}.items():
        css = css.replace("{{" + k + "}}", v)
    (d / "assets" / "unit.css").write_text(css, encoding="utf-8", newline="\n")
    js_path.write_text(render_unit_js(title, m, live, middle), encoding="utf-8", newline="\n")
    load_unit_js(m["slug"])  # proves it evaluates

    hub = d / "index.html"
    if not hub.exists():
        t = (TEMPLATES / "hub.html").read_text(encoding="utf-8")
        for k, v in {"UNIT_TITLE": title, "META_DESCRIPTION": m["description"].replace('"', "&quot;"),
                     "FAVICON": favicon(m, pal["acc"]), "LEDE": m["lede"],
                     "LAST_N": str(len(m["chapters"]))}.items():
            t = t.replace("{{" + k + "}}", v)
        hub.write_text(t, encoding="utf-8", newline="\n")
        print(f"wrote units/{m['slug']}/index.html — fill every {{{{WRITE: …}}}} marker")
    print(f"wrote units/{m['slug']}/assets/unit.css ({line_name}, {pal['acc']}) and unit.js "
          f"({len(m['chapters'])} chapters, {sum(c['demos'] for c in m['chapters'])} demos, LIVE: {len(live)})")


def number_word(n):
    words = "zero one two three four five six seven eight nine ten eleven twelve".split()
    return words[n] if n < len(words) else str(n)


def cmd_skeleton(args):
    man = load_unit_js(args.slug)
    chs = man["CHAPTERS"]
    c = next((x for x in chs if x["id"] == args.ch), None)
    if not c:
        sys.exit(f"{args.ch} is not in the manifest")
    part = next(p for p in man["PARTS"] if p["id"] == c["p"])
    hub = (UNITS_DIR / args.slug / "index.html").read_text(encoding="utf-8")
    fav = re.search(r'<link rel="icon" href="([^"]+)">', hub).group(1)
    title = re.search(r"<h1>(.*?)</h1>", hub, re.S).group(1).strip()
    nxt = next((x for x in chs if x["n"] == c["n"] + 1), None)
    if nxt:
        next_head = "Next"
        next_hint = (f"{{{{WRITE: one or two sentences previewing chapter {nxt['n']}, "
                     f"\"{nxt['t']}\": {nxt['d']}}}}}")
    else:
        next_head = "Where next"
        next_hint = "{{WRITE: the end of the unit — point to the related catalogue units and what to build}}"
    t = (TEMPLATES / "chapter.html").read_text(encoding="utf-8")
    demos_label = f"{c['demos']} demo" + ("" if c["demos"] == 1 else "s")
    for k, v in {"N": str(c["n"]), "T": c["t"], "UNIT_TITLE": title, "FAVICON": fav, "CH": c["id"],
                 "PART_NAME": part["name"], "MINS": str(c["mins"]), "DEMOS_LABEL": demos_label,
                 "NEXT_HEAD": next_head, "NEXT_HINT": next_hint}.items():
        t = t.replace("{{" + k + "}}", v)
    if c["demos"] == 0:
        t = t.replace("<script>\n{{WRITE: one IIFE per demo — see the style guide}}\n</script>\n", "")
    sys.stdout.write(t)


def cmd_live(args):
    path = UNITS_DIR / args.slug / "assets" / "unit.js"
    man = load_unit_js(args.slug)
    order = [c["id"] for c in man["CHAPTERS"]]
    live = set(man["LIVE"])
    for ch in args.chapters:
        if ch not in order:
            sys.exit(f"{ch} is not in the manifest")
        if args.remove:
            live.discard(ch)
        else:
            if not (UNITS_DIR / args.slug / f"{ch}.html").exists():
                sys.exit(f"units/{args.slug}/{ch}.html does not exist")
            live.add(ch)
    text = path.read_text(encoding="utf-8")
    new = "var LIVE = new Set([" + ", ".join(f'"{x}"' for x in order if x in live) + "]);"
    text = re.sub(r"^var LIVE = new Set\(\[.*?\]\);", lambda _: new, text, count=1, flags=re.M | re.S)
    path.write_text(text, encoding="utf-8", newline="\n")
    print(f"LIVE: {len(live)} of {len(order)}")


def cmd_palette(args):
    html = catalogue.read_index()
    for lid, name, base in catalogue.lines_meta(html):
        p = palette(lid, base)
        print(f"{lid:<7}{name:<22}" + " ".join(f"{k}={v}" for k, v in p.items()) +
              f"   deep/paper {contrast(p['deep'], PAPER):.1f}  deep/wash {contrast(p['deep'], p['wash']):.1f}"
              f"  mid/paper {contrast(p['mid'], PAPER):.1f}  acc/ink {contrast(p['acc'], INK):.1f}")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("unit"); p.add_argument("manifest"); p.add_argument("--force", action="store_true"); p.set_defaults(fn=cmd_unit)
    p = sub.add_parser("skeleton"); p.add_argument("slug"); p.add_argument("ch"); p.set_defaults(fn=cmd_skeleton)
    p = sub.add_parser("live"); p.add_argument("slug"); p.add_argument("chapters", nargs="+")
    p.add_argument("--remove", action="store_true"); p.set_defaults(fn=cmd_live)
    p = sub.add_parser("palette"); p.set_defaults(fn=cmd_palette)
    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
