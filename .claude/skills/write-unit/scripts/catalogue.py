#!/usr/bin/env python3
"""Read and update the unit catalogue in the repo-root index.html.

  catalogue.py status                 every unit, its state, and what to write next
  catalogue.py next                   slug of the next unit to work on
  catalogue.py show <slug>            one unit's catalogue entry, as JSON
  catalogue.py register <slug> --state written|progress|planned [--m "24 chapters, 48 demos"]

The catalogue is driven by three things in index.html: the UNITS array (one
line per unit), and the WRITTEN and IN_PROGRESS sets. A slug may only go in
either set once units/<slug>/index.html exists, or its card links nowhere.
"""
import argparse
import json
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parents[4]
INDEX = REPO / "index.html"
UNITS_DIR = REPO / "units"

FIELD = re.compile(r'(\w+):"((?:[^"\\]|\\.)*)"')
UNIT_LINE = re.compile(r'^\s*\{s:"[^"]+".*\}\s*,?\s*$')


def read_index():
    return INDEX.read_text(encoding="utf-8")


def lines_meta(html):
    """[(id, name, colour)] in catalogue order."""
    colours = dict(re.findall(r"--l-(\w+):(#[0-9A-Fa-f]{6})", html))
    out = []
    for lid, name in re.findall(r'\{id:"(\w+)",\s*name:"([^"]+)"', html):
        out.append((lid, name, colours.get(lid)))
    return out


def units(html):
    """Catalogue entries in order: dicts with s, t, l, d, k and maybe m."""
    block = html[html.index("const UNITS = ["):]
    block = block[: block.index("\n];")]
    out = []
    for line in block.splitlines():
        if UNIT_LINE.match(line):
            out.append(dict(FIELD.findall(line)))
    return out


def _set_block(html, name):
    m = re.search(r"const " + name + r" = new Set\(\[(.*?)\]\);", html, re.S)
    if not m:
        sys.exit(f"could not find the {name} set in index.html")
    return m


def written_groups(html):
    """WRITTEN as an ordered {line name: [[slugs on one row], ...]}, so that
    re-rendering leaves existing rows exactly as they were."""
    body = _set_block(html, "WRITTEN").group(1)
    groups, current = {}, None
    for raw in body.splitlines():
        line = raw.strip()
        if line.startswith("//"):
            current = line[2:].split("—")[0].strip()
            groups.setdefault(current, [])
        elif line:
            groups.setdefault(current, []).append(re.findall(r'"([a-z0-9]+)"', line))
    return groups


def slug_set(html, name):
    return re.findall(r'"([a-z0-9]+)"', _set_block(html, name).group(1))


def folder_state(slug):
    """'current' (chNN + manifest), 'legacy' (an older layout), or None."""
    d = UNITS_DIR / slug
    if not (d / "index.html").exists():
        return None
    js = d / "assets" / "unit.js"
    if js.exists():
        text = js.read_text(encoding="utf-8", errors="replace")
        if re.search(r"^var CHAPTERS = \[", text, re.M) and re.search(r"^var LIVE = new Set", text, re.M):
            return "current"
    return "legacy"


def state_of(u, written, progress):
    if u["s"] in written:
        return "written"
    if u["s"] in progress:
        return "in progress"
    fs = folder_state(u["s"])
    if fs == "current":
        return "started, unregistered"
    if fs == "legacy":
        return "legacy folder"
    return "not started"


def pick_next(html):
    us = units(html)
    written, progress = set(slug_set(html, "WRITTEN")), set(slug_set(html, "IN_PROGRESS"))
    states = [(u, state_of(u, written, progress)) for u in us]
    for wanted in ("in progress", "started, unregistered", "not started"):
        for u, st in states:
            # an in-progress unit built by an older engine can't be resumed by this skill
            if st == wanted and not (st == "in progress" and folder_state(u["s"]) != "current"):
                return u["s"]
    return None


def render_written(groups, html):
    meta = lines_meta(html)
    us = units(html)
    all_written = {s for rows in groups.values() for row in rows for s in row}
    out = []
    for lid, name, _ in meta:
        rows = [r for r in groups.get(name, []) if r]
        if not rows:
            continue
        line_units = [u["s"] for u in us if u["l"] == lid]
        done = all(s in all_written for s in line_units)
        out.append(f"  // {name}" + (" — line complete" if done else ""))
        out.extend("  " + "".join(f'"{s}",' for s in row) for row in rows)
    if out:
        out[-1] = out[-1].rstrip(",")
    return "const WRITTEN = new Set([\n" + "\n".join(out) + "\n]);"


def add_to_rows(rows, slug, width=78):
    """Append to the group's last row, or start a new row if it would overflow."""
    if rows and len("  " + "".join(f'"{s}",' for s in rows[-1] + [slug])) <= width:
        rows[-1].append(slug)
    else:
        rows.append([slug])


def cmd_status(args):
    html = read_index()
    us = units(html)
    written, progress = set(slug_set(html, "WRITTEN")), set(slug_set(html, "IN_PROGRESS"))
    names = {lid: name for lid, name, _ in lines_meta(html)}
    counts = {}
    current_line = None
    for u in us:
        st = state_of(u, written, progress)
        counts[st] = counts.get(st, 0) + 1
        if args.remaining and st == "written":
            continue
        if u["l"] != current_line:
            current_line = u["l"]
            print(f"\n{names.get(current_line, current_line)}")
        print(f"  {u['s']:<28} {st:<22} {u.get('m', '')}")
    print("\n" + ", ".join(f"{v} {k}" for k, v in counts.items()) + f" — {len(us)} units")
    nxt = pick_next(html)
    print(f"next: {nxt}" if nxt else "next: nothing left")
    legacy = [u["s"] for u in us if state_of(u, written, progress) == "legacy folder"]
    if legacy:
        print("legacy folders (older layout; rebuild only with the user's go-ahead): " + ", ".join(legacy))
    older = [u["s"] for u in us if u["s"] in progress and folder_state(u["s"]) != "current"]
    if older:
        print("in progress in an older engine (finish in that unit's own format, with the user's go-ahead): " + ", ".join(older))


def cmd_next(args):
    nxt = pick_next(read_index())
    print(nxt or "")


def cmd_show(args):
    html = read_index()
    for u in units(html):
        if u["s"] == args.slug:
            names = {lid: (name, col) for lid, name, col in lines_meta(html)}
            u = dict(u, line_name=names[u["l"]][0], line_colour=names[u["l"]][1],
                     state=state_of(u, set(slug_set(html, "WRITTEN")), set(slug_set(html, "IN_PROGRESS"))))
            print(json.dumps(u, indent=2, ensure_ascii=False))
            return
    sys.exit(f"{args.slug}: not in the catalogue")


def cmd_register(args):
    html = read_index()
    slug = args.slug
    if not any(u["s"] == slug for u in units(html)):
        sys.exit(f"{slug}: not in the catalogue")
    if args.state != "planned" and not (UNITS_DIR / slug / "index.html").exists():
        sys.exit(f"units/{slug}/index.html does not exist; a slug needs a real folder before it is registered")

    unit = next(u for u in units(html) if u["s"] == slug)
    line_name = {lid: name for lid, name, _ in lines_meta(html)}[unit["l"]]

    groups = written_groups(html)
    for rows in groups.values():
        for row in rows:
            if slug in row:
                row.remove(slug)
    if args.state == "written":
        add_to_rows(groups.setdefault(line_name, []), slug)
    html = html.replace(_set_block(html, "WRITTEN").group(0), render_written(groups, html))

    progress = [s for s in slug_set(html, "IN_PROGRESS") if s != slug]
    if args.state == "progress":
        progress.append(slug)
    html = html.replace(_set_block(html, "IN_PROGRESS").group(0),
                        "const IN_PROGRESS = new Set([" + ",".join(f'"{s}"' for s in progress) + "]);")

    # the m: stat on the unit's catalogue line
    pat = re.compile(r'^(\s*\{s:"' + re.escape(slug) + r'",.*)$', re.M)
    line = pat.search(html).group(1)
    new = line
    if args.state == "planned":
        new = re.sub(r', m:"(?:[^"\\]|\\.)*"', "", new)
    elif args.m is not None:
        if re.search(r', m:"', new):
            new = re.sub(r'm:"(?:[^"\\]|\\.)*"', 'm:"' + args.m + '"', new, count=1)
        else:
            new = re.sub(r'(l:"[^"]+")', r'\1, m:"' + args.m + '"', new, count=1)
    html = html.replace(line, new)

    INDEX.write_text(html, encoding="utf-8", newline="")
    print(f"{slug}: {args.state}" + (f', m:"{args.m}"' if args.m and args.state != "planned" else ""))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("status"); p.add_argument("--remaining", action="store_true", help="hide written units"); p.set_defaults(fn=cmd_status)
    p = sub.add_parser("next"); p.set_defaults(fn=cmd_next)
    p = sub.add_parser("show"); p.add_argument("slug"); p.set_defaults(fn=cmd_show)
    p = sub.add_parser("register"); p.add_argument("slug")
    p.add_argument("--state", required=True, choices=["written", "progress", "planned"])
    p.add_argument("--m", help='catalogue stat, e.g. "24 chapters, 48 demos" or "9 of 22 chapters"')
    p.set_defaults(fn=cmd_register)
    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
