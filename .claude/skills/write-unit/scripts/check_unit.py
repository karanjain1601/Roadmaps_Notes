#!/usr/bin/env python3
"""Validate a unit against the house format.

  check_unit.py <slug>                    hub, every chapter file, LIVE, and the catalogue entry
  check_unit.py <slug> --chapter ch05 …   only the named chapters (what a chapter writer runs)
  check_unit.py <slug> --no-smoke         skip the jsdom runtime pass

Static checks: structure, counts against the manifest, links, ids the demo
scripts reach for, markup balance, placeholders, inline-script syntax (node).
Runtime pass (if jsdom is installed under scripts/smoke): loads each page,
drives every demo control, and reports exceptions and demos left empty.

Exit status is 1 if anything is an ERROR. WARNs are judgement calls.
"""
import argparse
import json
import pathlib
import re
import subprocess
import sys
from html.parser import HTMLParser

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import catalogue  # noqa: E402
import scaffold  # noqa: E402

SMOKE = pathlib.Path(__file__).resolve().parent / "smoke"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
OPTIONAL_CLOSE = {"p", "li", "td", "th", "tr", "dt", "dd", "option", "thead", "tbody", "tfoot"}
CLOSES_P = {"div", "section", "ul", "ol", "table", "pre", "h1", "h2", "h3", "h4", "h5", "h6",
            "details", "p", "dl", "blockquote", "figure", "hr", "nav", "header", "footer", "main"}
FONT_HOSTS = ("https://fonts.googleapis.com", "https://fonts.gstatic.com")
FORBIDDEN_JS = [(r"\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b", "stores state (the catalogue promises nothing is stored)"),
                (r"\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bEventSource\b|\bimport\s*\(", "makes a network call (units work offline)"),
                (r"\beval\s*\(|new\s+Function\s*\(", "evaluates strings as code")]
CH_FILE = re.compile(r"^ch\d{2}$")


# ------------------------------------------------------------------ parsing
class Node:
    __slots__ = ("tag", "attrs", "children", "parent", "line", "text", "seq")

    def __init__(self, tag, attrs, parent, line):
        self.tag, self.attrs, self.parent, self.line = tag, attrs, parent, line
        self.children, self.text = [], []
        self.seq = []  # text and child nodes, in document order

    def cls(self):
        return self.attrs.get("class", "").split()

    def has(self, c):
        return c in self.cls()

    def walk(self):
        for ch in self.children:
            yield ch
            yield from ch.walk()

    def find(self, pred):
        return [n for n in self.walk() if pred(n)]

    def first(self, pred):
        return next((n for n in self.walk() if pred(n)), None)

    def all_text(self, skip=("script", "style")):
        out = []
        for item in self.seq:
            if isinstance(item, str):
                out.append(item)
            elif item.tag not in skip:
                out.append(item.all_text(skip))
        return "".join(out)


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", {}, None, 0)
        self.stack = [self.root]
        self.problems = []
        self.scripts = []  # (node, code)

    def _open(self, tag, attrs, push):
        cur = self.stack[-1]
        if cur.tag == "p" and tag in CLOSES_P:
            self.stack.pop()
            cur = self.stack[-1]
        n = Node(tag, {k: (v if v is not None else "") for k, v in attrs}, cur, self.getpos()[0])
        cur.children.append(n)
        cur.seq.append(n)
        if push and tag not in VOID:
            self.stack.append(n)
        return n

    def handle_starttag(self, tag, attrs):
        self._open(tag, attrs, True)

    def handle_startendtag(self, tag, attrs):
        self._open(tag, attrs, False)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        idx = next((i for i in range(len(self.stack) - 1, 0, -1) if self.stack[i].tag == tag), None)
        if idx is None:
            self.problems.append((self.getpos()[0], f"stray </{tag}> with nothing open to close"))
            return
        for n in self.stack[idx + 1:]:
            if n.tag not in OPTIONAL_CLOSE:
                self.problems.append((n.line, f"<{n.tag}> opened here is never closed (closed implicitly by </{tag}> on line {self.getpos()[0]})"))
        node = self.stack[idx]
        del self.stack[idx:]
        if tag == "script":
            self.scripts.append((node, "".join(node.text)))

    def handle_data(self, data):
        self.stack[-1].text.append(data)
        self.stack[-1].seq.append(data)

    def close(self):
        super().close()
        for n in self.stack[1:]:
            if n.tag not in OPTIONAL_CLOSE | {"html", "body", "head"}:
                self.problems.append((n.line, f"<{n.tag}> is never closed"))


def parse(path):
    b = Builder()
    raw = path.read_text(encoding="utf-8")
    b.feed(raw)
    b.close()
    return raw, b


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


# ------------------------------------------------------------------- report
class Report:
    def __init__(self):
        self.items = []

    def err(self, where, msg):
        self.items.append(("ERROR", where, msg))

    def warn(self, where, msg):
        self.items.append(("WARN", where, msg))

    @property
    def errors(self):
        return sum(1 for i in self.items if i[0] == "ERROR")

    def print(self):
        for level, where, msg in self.items:
            print(f"{level:<5} {where}: {msg}")


# ------------------------------------------------------------ shared checks
def check_common(rep, name, raw, b, fav=None):
    if not raw.startswith("<!DOCTYPE html>"):
        rep.err(name, "must start with <!DOCTYPE html>")
    for line, msg in b.problems:
        rep.err(f"{name}:{line}", msg)
    # Only the scaffold's own markers: {{WRITE…}} and {{UPPER_CASE}}. Content is
    # full of legitimate {{ }} — Go templates, GitHub Actions expressions.
    for m in re.finditer(r"\{\{(?:WRITE\b|[A-Z][A-Z_]+\}\})", raw):
        line = raw.count("\n", 0, m.start()) + 1
        snippet = raw[m.start():m.start() + 70].split("\n")[0]
        rep.err(f"{name}:{line}", f"unfilled template marker: {snippet}")
    for word in ("Lorem ipsum", "lorem ipsum", "FIXME", "XXX"):
        if word in raw:
            rep.err(name, f"placeholder text {word!r}")
    root = b.root
    html = root.first(lambda n: n.tag == "html")
    if not html or html.attrs.get("lang") != "en":
        rep.err(name, '<html lang="en"> missing')
    desc = root.first(lambda n: n.tag == "meta" and n.attrs.get("name") == "description")
    if not desc or len(desc.attrs.get("content", "")) < 40:
        rep.err(name, "meta description missing or too short")
    icon = root.first(lambda n: n.tag == "link" and n.attrs.get("rel") == "icon")
    if not icon:
        rep.err(name, "favicon <link rel=icon> missing")
    elif fav and icon.attrs.get("href") != fav:
        rep.err(name, "favicon differs from the hub's — copy it exactly")
    if not root.first(lambda n: n.tag == "link" and n.attrs.get("rel") == "stylesheet" and n.attrs.get("href") == "assets/unit.css"):
        rep.err(name, "stylesheet assets/unit.css not linked")

    ids = {}
    for n in root.walk():
        i = n.attrs.get("id")
        if i:
            if i in ids:
                rep.err(f"{name}:{n.line}", f'duplicate id "{i}" (first on line {ids[i]})')
            ids.setdefault(i, n.line)

    for n in root.walk():
        for attr in ("href", "src"):
            v = n.attrs.get(attr)
            if v is None:
                continue
            if v.startswith("/") and not v.startswith("//"):
                rep.err(f"{name}:{n.line}", f'root-absolute {attr}="{v}" breaks under /Roadmaps_Notes/ on GitHub Pages')
            elif re.match(r"https?://", v) and not v.startswith(FONT_HOSTS):
                if attr == "src":
                    rep.err(f"{name}:{n.line}", f"external resource {v} — units are offline")
                else:
                    rep.warn(f"{name}:{n.line}", f"external link {v} — name the source in text instead")
    for n in root.find(lambda n: n.tag == "script" and n.attrs.get("src") and n.attrs["src"] != "assets/unit.js"):
        rep.err(f"{name}:{n.line}", f"unexpected script {n.attrs['src']}")
    return ids


def check_scripts(rep, name, b, ids):
    inline = [(n, code) for n, code in b.scripts if not n.attrs.get("src")]
    for n, code in inline:
        for pat, why in FORBIDDEN_JS:
            for m in re.finditer(pat, code):
                line = n.line + code.count("\n", 0, m.start())
                rep.err(f"{name}:{line}", f"script {why}: {m.group(0)}")
        made = set(re.findall(r"""\.id\s*=\s*["']([\w-]+)["']""", code)) | \
            set(re.findall(r"""id=\\?["']([\w-]+)\\?["']""", code))
        for m in re.finditer(r"""getElementById\(\s*["']([\w-]+)["']\s*\)|querySelector(?:All)?\(\s*["']#([\w-]+)["']""", code):
            ref = m.group(1) or m.group(2)
            if ref not in ids and ref not in made:
                line = n.line + code.count("\n", 0, m.start())
                rep.err(f"{name}:{line}", f'script looks up #{ref}, which does not exist in the page')
    return [(f"{name}:{n.line}", code) for n, code in inline]


def js_syntax(rep, scripts):
    """Compile every inline script in one node process."""
    if not scripts:
        return
    code = (
        "const vm=require('vm');let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{"
        "const out=[];for(const s of JSON.parse(d)){try{new vm.Script(s.code,{filename:s.name});}"
        "catch(e){const m=/:(\\d+)\\n/.exec(e.stack||'');out.push({name:s.name,line:m?+m[1]:0,msg:e.message});}}"
        "process.stdout.write(JSON.stringify(out));});"
    )
    payload = json.dumps([{"name": n, "code": c} for n, c in scripts])
    r = subprocess.run(["node", "-e", code], input=payload, capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        rep.err("node", r.stderr.strip()[:400])
        return
    for e in json.loads(r.stdout or "[]"):
        base, _, start = e["name"].rpartition(":")
        line = int(start) + max(e["line"] - 1, 0)
        rep.err(f"{base}:{line}", f"script syntax error: {e['msg']}")


# ----------------------------------------------------------------- chapter
def check_chapter(rep, d, ch, man, unit_title, fav, live):
    name = f"{ch}.html"
    path = d / name
    if not path.exists():
        rep.err(name, "file does not exist")
        return []
    raw, b = parse(path)
    root = b.root
    ids = check_common(rep, name, raw, b, fav)
    c = next((x for x in man["CHAPTERS"] if x["id"] == ch), None)
    if not c:
        rep.err(name, "not in the manifest (CHAPTERS in assets/unit.js)")
        return []
    part = next((p for p in man["PARTS"] if p["id"] == c["p"]), {"name": "?"})

    title = root.first(lambda n: n.tag == "title")
    want = f"{c['n']} · {c['t']} — {unit_title}"
    if not title or norm(title.all_text()) != want:
        rep.err(name, f"<title> should be {want!r}")
    body = root.first(lambda n: n.tag == "body")
    if not body or body.attrs.get("data-ch") != ch:
        rep.err(name, f'<body data-ch="{ch}"> missing — the pager depends on it')
    crumb = root.first(lambda n: n.tag == "a" and n.has("crumb"))
    if not crumb or crumb.attrs.get("href") != "index.html":
        rep.err(name, 'a.crumb must link to "index.html"')
    chno = root.first(lambda n: n.has("chno"))
    if not chno:
        rep.err(name, ".chno missing")
    else:
        bb = chno.first(lambda n: n.tag == "b")
        sp = chno.first(lambda n: n.tag == "span")
        if not bb or norm(bb.all_text()) != f"Chapter {c['n']}":
            rep.err(name, f'.chno <b> should read "Chapter {c["n"]}"')
        if not sp or norm(sp.all_text()) != part["name"]:
            rep.err(name, f'.chno <span> should be the part name "{part["name"]}"')
    h1 = root.first(lambda n: n.tag == "h1")
    if h1 and norm(h1.all_text()) != c["t"]:
        rep.warn(name, f"<h1> {norm(h1.all_text())!r} differs from the manifest title {c['t']!r}")
    if not root.first(lambda n: n.has("lede")):
        rep.err(name, "p.lede missing")

    main = root.first(lambda n: n.tag == "main")
    if not main:
        rep.err(name, "<main> missing")
        return []
    side = root.first(lambda n: n.tag == "nav" and n.has("side"))
    if not side or side.children:
        rep.err(name, "nav.side must exist and be empty — the rail is built from the sections")
    sections = [n for n in main.children if n.tag == "section"]
    for s in sections:
        h2 = next((x for x in s.children if x.tag == "h2"), None)
        if not s.attrs.get("id"):
            rep.err(f"{name}:{s.line}", "section without an id")
        if not h2:
            rep.err(f"{name}:{s.line}", "section must start with an <h2>")
        elif not h2.attrs.get("data-nav"):
            rep.err(f"{name}:{h2.line}", "section <h2> needs data-nav (the rail label)")
    if not sections or sections[-1].attrs.get("id") != "recap":
        rep.err(name, 'the last section must be <section id="recap">')
    content = len([s for s in sections if s.attrs.get("id") != "recap"])
    if content < 5:
        rep.warn(name, f"only {content} content sections; chapters usually have 6–8")

    recap = root.first(lambda n: n.has("recap"))
    if not recap:
        rep.err(name, "div.recap missing")
    else:
        lis = recap.find(lambda n: n.tag == "li")
        if len(lis) < 5:
            rep.err(name, f"recap has {len(lis)} bullets; write 6–8")
        rh2 = recap.first(lambda n: n.tag == "h2")
        if not rh2 or not norm(rh2.all_text()).startswith(f"Chapter {c['n']} in "):
            rep.warn(name, f'recap heading should read "Chapter {c["n"]} in … lines"')
    checks = root.find(lambda n: n.tag == "details" and n.has("chk"))
    if len(checks) < 3:
        rep.err(name, f"{len(checks)} self-checks; write 3–5")
    for chk in checks:
        if not chk.first(lambda n: n.tag == "summary") or not chk.first(lambda n: n.has("ans")):
            rep.err(f"{name}:{chk.line}", "details.chk needs a <summary> and a div.ans")

    demos = root.find(lambda n: n.has("demo"))
    if len(demos) != c["demos"]:
        rep.err(name, f"{len(demos)} .demo blocks but the manifest says {c['demos']} — make them agree")
    for dm in demos:
        top = next((x for x in dm.children if x.has("demo-top")), None)
        if not top or not top.first(lambda n: n.tag == "h3"):
            rep.err(f"{name}:{dm.line}", ".demo needs a .demo-top with an <h3>")
        if not next((x for x in dm.children if x.has("demo-body")), None):
            rep.err(f"{name}:{dm.line}", ".demo needs a .demo-body")

    for cb in root.find(lambda n: n.has("code") and n.tag == "div"):
        top = next((x for x in cb.children if x.has("code-top")), None)
        pre = next((x for x in cb.children if x.tag == "pre"), None)
        if not top or not top.first(lambda n: n.has("tag")) or not top.first(lambda n: n.tag == "button" and n.has("copy")):
            rep.err(f"{name}:{cb.line}", ".code needs .code-top with span.tag and button.copy")
        if not pre or "data-lang" not in pre.attrs:
            rep.err(f"{name}:{cb.line}", ".code needs a <pre data-lang=…>")
    for t in root.find(lambda n: n.tag == "table"):
        if not t.has("tbl") or not (t.parent and t.parent.has("tw")):
            rep.warn(f"{name}:{t.line}", "tables are <div class=\"tw\"><table class=\"tbl\">")
    for co in root.find(lambda n: n.tag == "div" and set(n.cls()) & {"key", "trap", "warn", "tip", "note"}):
        if not co.first(lambda n: n.tag == "span" and n.has("lbl")):
            rep.warn(f"{name}:{co.line}", "callout without a span.lbl heading")

    meta = root.first(lambda n: n.has("meta") and n.tag == "div")
    spans = [norm(s.all_text()) for s in (meta.children if meta else []) if s.tag == "span"]
    def meta_num(word):
        for s in spans:
            m = re.fullmatch(r"(\d+) " + word, s)
            if m:
                return int(m.group(1))
        return None
    for word, actual in ((r"demos?", len(demos)), (r"sections?", len(sections)), (r"self-checks?", len(checks))):
        got = meta_num(word)
        label = word.split("s?")[0].replace("\\", "")
        if got is None:
            rep.err(name, f'.meta is missing the "{actual} {label}s" span')
        elif got != actual:
            rep.err(name, f".meta says {got} {label}s; the page has {actual}")
    mins = meta_num("min")
    if mins is None:
        rep.err(name, '.meta is missing the "N min" span')
    elif mins != c["mins"]:
        rep.warn(name, f".meta says {mins} min; the manifest says {c['mins']}")

    foot = root.first(lambda n: n.tag == "footer" and n.has("foot"))
    fis = foot.find(lambda n: n.has("fi")) if foot else []
    heads = [norm(f.first(lambda n: n.tag == "h2").all_text()) if f.first(lambda n: n.tag == "h2") else "" for f in fis]
    last = c["n"] == len(man["CHAPTERS"])
    if len(fis) != 3:
        rep.err(name, f"footer should have 3 .fi blocks (Next, Try it now, Sources); found {len(fis)}")
    elif heads[2] != "Sources" or (not last and heads[:2] != ["Next", "Try it now"]):
        rep.warn(name, f"footer headings are {heads}; expected Next, Try it now, Sources"
                       + (" (the last chapter may rename the first two)" if last else ""))
    if not root.first(lambda n: n.tag == "button" and n.has("top")):
        rep.err(name, "button.top missing")

    srcs = [n for n, _ in b.scripts]
    i = next((k for k, n in enumerate(srcs) if n.attrs.get("src") == "assets/unit.js"), None)
    if i is None:
        rep.err(name, '<script src="assets/unit.js"> missing')
    elif i + 1 >= len(srcs) or "initChapter()" not in "".join(srcs[i + 1].text):
        rep.err(name, "the script after assets/unit.js must call initChapter()")
    if c["demos"] and not any("".join(n.text).strip() and "initChapter()" not in "".join(n.text) for n in srcs if not n.attrs.get("src")):
        rep.err(name, "the manifest lists demos but the page has no demo script")

    for n in root.walk():
        href = n.attrs.get("href", "")
        m = re.fullmatch(r"(ch\d{2})\.html(#.*)?", href)
        if m and m.group(1) != ch:
            if not (d / f"{m.group(1)}.html").exists():
                rep.warn(f"{name}:{n.line}", f"links to {m.group(1)}.html, which is not written yet")

    words = len(re.findall(r"[A-Za-z][A-Za-z'’-]*", main.all_text(skip=("script", "style", "pre"))))
    if words < 1200:
        rep.warn(name, f"{words} words of prose outside code; chapters in this catalogue run 1,400–1,900")
    return check_scripts(rep, name, b, ids)


# --------------------------------------------------------------------- hub
def check_hub(rep, d, man, entry, live):
    path = d / "index.html"
    if not path.exists():
        rep.err("index.html", "hub page missing")
        return None, None, []
    raw, b = parse(path)
    root = b.root
    ids = check_common(rep, "index.html", raw, b)
    t = root.first(lambda n: n.tag == "title")
    if not t or norm(t.all_text()) != f"{entry['t']} — study unit":
        rep.err("index.html", f"<title> should be {entry['t'] + ' — study unit'!r}")
    h1 = root.first(lambda n: n.tag == "h1")
    if not h1 or norm(h1.all_text()) != entry["t"]:
        rep.err("index.html", f"<h1> should be the catalogue title {entry['t']!r}")
    crumb = root.first(lambda n: n.tag == "a" and n.has("crumb"))
    if not crumb or crumb.attrs.get("href") != "../../index.html":
        rep.err("index.html", 'a.crumb must link to "../../index.html"')
    for i in ("parts", "s-live", "s-parts", "s-demos", "s-mins", "start"):
        if i not in ids:
            rep.err("index.html", f"#{i} missing — initHub fills it")
    if "initHub()" not in raw:
        rep.err("index.html", "initHub() is never called")
    for n in root.walk():
        m = re.fullmatch(r"(ch\d{2})\.html", n.attrs.get("href", ""))
        if m and m.group(1) not in live:
            rep.warn(f"index.html:{n.line}", f"links to {m.group(1)}, which is not live yet")
    icon = root.first(lambda n: n.tag == "link" and n.attrs.get("rel") == "icon")
    return (icon.attrs.get("href") if icon else None), norm(h1.all_text()) if h1 else entry["t"], check_scripts(rep, "index.html", b, ids)


# ------------------------------------------------------------------ smoke
def smoke(rep, d, files, live):
    runner = SMOKE / "smoke.js"
    if not (SMOKE / "node_modules" / "jsdom").exists():
        rep.warn("smoke", f"runtime pass skipped — install once with: npm install --prefix {SMOKE.relative_to(catalogue.REPO).as_posix()}")
        return
    try:
        r = subprocess.run(["node", str(runner), "--live=" + ",".join(sorted(live)), str(d)] + files,
                           capture_output=True, text=True,
                           encoding="utf-8", timeout=60 + 10 * len(files))
    except subprocess.TimeoutExpired:
        rep.err("smoke", "runtime pass timed out — look for an unbounded loop in a demo")
        return
    if r.returncode and not r.stdout:
        rep.err("smoke", r.stderr.strip()[:600])
        return
    for item in json.loads(r.stdout):
        (rep.err if item["level"] == "error" else rep.warn)(item["file"], item["msg"])


# ------------------------------------------------------------------- main
def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug")
    ap.add_argument("--chapter", action="append", default=[], help="check only these chapters (repeatable)")
    ap.add_argument("--no-smoke", action="store_true")
    args = ap.parse_args()

    html = catalogue.read_index()
    entry = next((u for u in catalogue.units(html) if u["s"] == args.slug), None)
    if not entry:
        sys.exit(f"{args.slug}: not in the catalogue")
    d = catalogue.UNITS_DIR / args.slug
    if catalogue.folder_state(args.slug) != "current":
        sys.exit(f"units/{args.slug} is missing or not in the current format (chNN.html + var CHAPTERS/LIVE in assets/unit.js)")

    rep = Report()
    man = scaffold.load_unit_js(args.slug)
    live = set(man["LIVE"])
    order = [c["id"] for c in man["CHAPTERS"]]
    fav, unit_title, scripts = check_hub(rep, d, man, entry, live)

    if args.chapter:
        targets = args.chapter
    else:
        on_disk = sorted(p.stem for p in d.glob("ch*.html") if CH_FILE.match(p.stem))
        targets = sorted(set(on_disk) | live, key=lambda x: order.index(x) if x in order else 999)
        for x in live:
            if not (d / f"{x}.html").exists():
                rep.err("unit.js", f"{x} is in LIVE but {x}.html does not exist")
        for x in on_disk:
            if x not in order:
                rep.err(f"{x}.html", "not in the manifest")
            elif x not in live:
                rep.warn(f"{x}.html", "exists but is not in LIVE — add it once it passes")
        written = set(catalogue.slug_set(html, "WRITTEN"))
        progress = set(catalogue.slug_set(html, "IN_PROGRESS"))
        n, demos = len(order), sum(c["demos"] for c in man["CHAPTERS"])
        if len(live) == n:
            want = f"{n} chapters, {demos} demos"
            if args.slug not in written:
                rep.warn("catalogue", f'every chapter is live: catalogue.py register {args.slug} --state written --m "{want}"')
            elif entry.get("m") != want:
                rep.warn("catalogue", f'm: is {entry.get("m")!r}; expected "{want}"')
        else:
            if args.slug in written:
                rep.err("catalogue", f"registered as written but only {len(live)} of {n} chapters are live")
            elif live and args.slug not in progress:
                rep.warn("catalogue", f'chapters are live: catalogue.py register {args.slug} --state progress --m "{len(live)} of {n} chapters"')
            elif args.slug in progress and entry.get("m") != f"{len(live)} of {n} chapters":
                rep.warn("catalogue", f'm: is {entry.get("m")!r}; expected "{len(live)} of {n} chapters"')

    for ch in targets:
        scripts += check_chapter(rep, d, ch, man, unit_title or entry["t"], fav, live)
    js_syntax(rep, scripts)
    if not args.no_smoke:
        files = ([] if args.chapter else ["index.html"]) + [f"{t}.html" for t in targets if (d / f"{t}.html").exists()]
        smoke(rep, d, files, live)

    rep.print()
    checked = "hub + " + (", ".join(targets) if args.chapter else f"{len(targets)} chapters")
    print(f"\n{args.slug}: {checked} — {rep.errors} errors, {len(rep.items) - rep.errors} warnings; LIVE {len(live)}/{len(order)}")
    sys.exit(1 if rep.errors else 0)


if __name__ == "__main__":
    main()
