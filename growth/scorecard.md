# EILLON Qualified Growth Scorecard

**Metric:** `qualified_growth_score` (primary keep/discard signal)

## Formula

```
qualified_growth_score =
  intent_score
+ brand_fit_score
+ conversion_score
+ discoverability_score
+ measurement_score
+ technical_quality_score
- complexity_penalty
- brand_risk_penalty
```

Each component is **0–3** unless noted.

## Component definitions

### intent_score
| Score | Meaning |
|---|---|
| 0 | Vague audience |
| 1 | General perfume audience |
| 2 | Niche fragrance buyer intent |
| 3 | High-intent tied to Beles, prickly pear, Fico d'India, oil-rich parfum, skin scent, Copenhagen niche perfume, sample-first, restock, or appointments |

### brand_fit_score
| Score | Meaning |
|---|---|
| 0 | Off-brand |
| 1 | Acceptable but generic |
| 2 | Recognizably EILLON |
| 3 | Deeply EILLON: quiet, sensory, memory-led, precise, commercial without shouting |

### conversion_score
| Score | Meaning |
|---|---|
| 0 | No path to action |
| 1 | Weak CTA |
| 2 | Clear CTA |
| 3 | Strong low-friction CTA + trust copy + clear expectation |

### discoverability_score
| Score | Meaning |
|---|---|
| 0 | No acquisition value |
| 1 | Small internal improvement |
| 2 | Meaningful SEO/social/referral value |
| 3 | Strong repeatable acquisition asset |

### measurement_score
| Score | Meaning |
|---|---|
| 0 | Cannot measure |
| 1 | Basic page exists |
| 2 | Event or UTM plan exists |
| 3 | Events + UTM + review instructions documented |

### technical_quality_score
| Score | Meaning |
|---|---|
| 0 | Broken |
| 1 | Works but rough |
| 2 | Solid |
| 3 | Accessible, fast, semantic, maintainable, tested |

### complexity_penalty (0–3)
| Score | Meaning |
|---|---|
| 0 | Simple |
| 1 | Moderate |
| 2 | Complex |
| 3 | Too complex for expected gain |

### brand_risk_penalty (0–3)
| Score | Meaning |
|---|---|
| 0 | Safe |
| 1 | Slightly risky |
| 2 | Needs AI hard review re-run |
| 3 | Unacceptable: misleading, culturally flattening, legally risky, false claims, fake urgency |

## Decision rules

### Keep
- `qualified_growth_score >= 13`
- `brand_risk_penalty <= 1`
- All minimum QA gates pass
- Meaningfully better than baseline (document why in run log)

### Rework
- Score 10–12 with clear fix path
- QA failed but fixable in one follow-up run

### Discard
- Score < 10
- `brand_risk_penalty >= 2` without human approval
- Unsupported claims or generic DTC copy
- No measurable acquisition/conversion path

### Blocked
- Missing tools/secrets
- Lock held by another run
- CI failing on main (for scheduled code automations)

## Scoring command

```bash
npm run growth:score -- --intent 2 --brand 3 --conversion 2 --discoverability 2 --measurement 2 --technical 3 --complexity 1 --risk 0
```

## Post-launch metrics (when analytics available)

Weight experiment review with:
- Qualified sessions (UTM-tagged)
- Organic impressions/clicks (Search Console)
- `restock_form_submitted` rate by chapter/source
- Newsletter (`product_slug=all`) submit rate
- `studio_appointment_click` rate
- Journal → Beles click-through
- Campaign landing CTA rate

Review rhythm: **7d** signal check, **30d** decision, **90d** scale or discard pattern.
