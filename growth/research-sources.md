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

### Web research log (Agent-Reach fallback)

- **2026-06-29** · Fragrantica (Raw Materials) · Prickly pear / Opuntia note profile · Insight: Niche note; watery cucumber-melon freshness; few dedicated releases (Ilio cited) · https://www.fragrantica.com/news/A-Universal-Love-for-Prickly-Pear-or-Opuntia-17694.html
- **2026-06-29** · ScentVerdict · Prickly pear note glossary · Insight: Transparent modern fruitiness, desert moisture — aligns with cactus-water positioning · https://scentverdict.com/note/prickly-pear
- **2026-06-29** · Fragrantica · Ortigia Fico D'India · Insight: Competing query owner; fig-leaf/cactus powdery-green, not sugary — EILLON must avoid clone positioning · https://www.fragrantica.com/perfume/Ortigia-Sicilia/Fico-D-India-9930.html
- **2026-06-29** · Fragrantica · Heretic Cactus Abduction (2024) · Insight: Recent prickly-pear niche launch; green/citrus/woody, genderless · https://www.fragrantica.com/perfume/Heretic-Parfum/Cactus-Abduction-97332.html

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
