import json
from collections import defaultdict

DEMO = {  # persona -> (age bracket, income, engagement)
    "P01": ("25-34", "mid", "moderate"), "P02": ("25-34", "high", "light"),
    "P03": ("18-24", "low", "light"),   "P04": ("45-54", "high", "heavy"),
    "P05": ("55+", "mid", "nonuser"),   "P06": ("25-34", "mid", "heavy"),
    "P07": ("35-44", "mid", "light"),   "P08": ("25-34", "high", "moderate"),
    "P09": ("45-54", "high", "moderate"), "P10": ("18-24", "low", "light"),
    "P11": ("35-44", "mid", "heavy"),   "P12": ("45-54", "mid", "lapsed"),
    "P13": ("25-34", "mid", "light"),   "P14": ("55+", "high", "moderate"),
    "P15": ("25-34", "mid", "moderate"), "P16": ("35-44", "low", "light"),
    "P17": ("25-34", "high", "moderate"), "P18": ("55+", "high", "light"),
    "P19": ("18-24", "low", "nonuser"), "P20": ("35-44", "mid", "moderate"),
    "P21": ("25-34", "mid", "light"),   "P22": ("55+", "mid", "moderate"),
    "P23": ("35-44", "high", "heavy"),  "P24": ("25-34", "low", "moderate"),
    "P25": ("45-54", "mid", "light"),   "P26": ("35-44", "high", "heavy"),
    "P27": ("18-24", "mid", "light"),   "P28": ("45-54", "mid", "moderate"),
    "P29": ("25-34", "mid", "lapsed"),  "P30": ("55+", "high", "moderate"),
    "P31": ("25-34", "mid", "moderate"), "P32": ("35-44", "mid", "light"),
    "P33": ("35-44", "low", "lapsed"),  "P34": ("45-54", "high", "moderate"),
    "P35": ("18-24", "low", "light"),   "P36": ("35-44", "high", "light"),
    "P37": ("25-34", "mid", "heavy"),   "P38": ("45-54", "mid", "nonuser"),
    "P39": ("25-34", "high", "moderate"), "P40": ("55+", "mid", "moderate"),
}

rows = []
with open("raw-scores-asmara-2026-06-12.jsonl", encoding="utf-8") as f:
    for line in f:
        r = json.loads(line)
        cell, pid = r["id"].split("-")
        exp = sum((i + 1) * p for i, p in enumerate(r["distribution"]))
        rows.append({"cell": cell, "pid": pid, "dist": r["distribution"], "expected": exp})

for cell in ("A", "B"):
    sub = [r for r in rows if r["cell"] == cell]
    n = len(sub)
    mean = sum(r["expected"] for r in sub) / n
    hist = [sum(r["dist"][i] for r in sub) / n for i in range(5)]
    t2b = hist[3] + hist[4]
    print(f"\n=== Cell {cell} (n={n}) ===")
    print(f"mean PI: {mean:.2f}   top-2-box: {t2b*100:.1f}%")
    print("distribution: " + "  ".join(f"{i+1}:{hist[i]*100:.1f}%" for i in range(5)))
    for dim in range(3):
        groups = defaultdict(list)
        for r in sub:
            groups[DEMO[r["pid"]][dim]].append(r["expected"])
        name = ["age", "income", "engagement"][dim]
        cuts = "  ".join(f"{k}:{sum(v)/len(v):.2f}(n={len(v)})" for k, v in sorted(groups.items()))
        print(f"by {name}: {cuts}")

print("\n=== A vs B per persona (B - A) ===")
a = {r["pid"]: r["expected"] for r in rows if r["cell"] == "A"}
b = {r["pid"]: r["expected"] for r in rows if r["cell"] == "B"}
deltas = sorted(((pid, b[pid] - a[pid]) for pid in a), key=lambda x: x[1])
print("mean delta: {:.3f}".format(sum(d for _, d in deltas) / len(deltas)))
print("biggest B>A: " + ", ".join(f"{p}:+{d:.2f}" for p, d in deltas[-5:] if d > 0))
print("biggest A>B: " + ", ".join(f"{p}:{d:.2f}" for p, d in deltas[:5] if d < 0))
