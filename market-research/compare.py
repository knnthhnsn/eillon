import json
from collections import defaultdict
from aggregate import DEMO

def load(path):
    rows = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            r = json.loads(line)
            cell, pid = r["id"].split("-")
            exp = sum((i + 1) * p for i, p in enumerate(r["distribution"]))
            rows.append({"cell": cell, "pid": pid, "dist": r["distribution"], "expected": exp})
    return rows

rows = load("raw-scores-asmara-2026-06-12.jsonl") + load("raw-scores-asmara-live-2026-06-12.jsonl")

for cell, label in (("A", "baseline €240/100ml"), ("B", "baseline €170/50ml"), ("L", "LIVE PAGE")):
    sub = [r for r in rows if r["cell"] == cell]
    n = len(sub)
    mean = sum(r["expected"] for r in sub) / n
    hist = [sum(r["dist"][i] for r in sub) / n for i in range(5)]
    tgt = [r for r in sub if DEMO[r["pid"]][2] in ("heavy", "moderate") and DEMO[r["pid"]][1] in ("mid", "high")]
    thist = [sum(r["dist"][i] for r in tgt) / len(tgt) for i in range(5)]
    print(f"\n=== {cell} ({label}, n={n}) ===")
    print(f"mean PI: {mean:.2f}   top-2-box: {(hist[3]+hist[4])*100:.1f}%   target-segment t2b: {(thist[3]+thist[4])*100:.1f}%  (target mean {sum(r['expected'] for r in tgt)/len(tgt):.2f})")
    print("distribution: " + "  ".join(f"{i+1}:{hist[i]*100:.1f}%" for i in range(5)))
    for dim, name in ((2, "engagement"), (1, "income"), (0, "age")):
        groups = defaultdict(list)
        for r in sub:
            groups[DEMO[r["pid"]][dim]].append(r["expected"])
        print(f"by {name}: " + "  ".join(f"{k}:{sum(v)/len(v):.2f}" for k, v in sorted(groups.items())))

base = defaultdict(dict)
for r in rows:
    base[r["pid"]][r["cell"]] = r["expected"]
deltas = sorted(((pid, v["L"] - (v["A"] + v["B"]) / 2) for pid, v in base.items()), key=lambda x: x[1])
print("\n=== LIVE vs baseline mean(A,B) per persona ===")
print(f"mean delta: {sum(d for _, d in deltas)/len(deltas):+.3f}")
print("top gains: " + ", ".join(f"{p}:{d:+.2f}" for p, d in deltas[-6:]))
print("top drops: " + ", ".join(f"{p}:{d:+.2f}" for p, d in deltas[:4]))
