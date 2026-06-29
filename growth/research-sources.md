# EILLON Research Sources

**Rules:** Cite source + date. Transform language — do not copy user comments into public copy.

## In-repo sources

| Source | Path | Use |
|---|---|---|
| Demand sprint | `market-research/beles-demand-sprint.md` | Funnel, UTM examples, analytics checklist |
| Asmara panel | `market-research/panel-asmara-2026-06-12.md` | Persona language |
| Live panel | `market-research/panel-asmara-live-2026-06-12.md` | Page-specific reactions |
| Raw scores | `market-research/raw-scores-*.jsonl` | Quantitative SSR |
| Product catalog | `data/products.js` | Truth for names, notes, status |
| llms.txt | `llms.txt` | Brand summary for agents |
| Implementation plan | `eillon_composer_implementation_plan.md` | Architecture reference |

## External research (when Agent-Reach configured)

| Platform | Query clusters | Log to |
|---|---|---|
| Reddit | r/fragrance, niche perfume, prickly pear | insights.md + run log |
| YouTube | prickly pear perfume, skin scent | insights.md |
| X/Twitter | niche perfume Copenhagen | insights.md |
| Pinterest | cactus fruit perfume mood | campaign docs |
| XiaohongShu / Bilibili | optional cross-market notes | research only — adapt carefully |

## Search Console / Analytics (manual export)

When available, export to `growth/runs/` as dated markdown summary — **no PII**.

## Citation format

```markdown
- **2026-06-28** · Reddit r/fragrance · thread topic · Insight: [transformed finding] · [URL if public]
```

## Forbidden

- Pasting verbatim reviews as site testimonials
- Storing user emails or names from research
- Presenting panel SSR scores as real customer reviews
