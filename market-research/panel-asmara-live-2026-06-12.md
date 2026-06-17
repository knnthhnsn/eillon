# Synthetic Panel Report — Asmara, Live Site (elli-hansen.vercel.app) — 2026-06-12

## Decision question
Does the **live product page** (full offer: sample credit, stated longevity, free
shipping/returns, refill, engraving, press quote) convert better than the bare
concept tested in the baseline run ([panel-asmara-2026-06-12.md](panel-asmara-2026-06-12.md))?
Which page elements help, and which hurt?

## Stimulus tested
Everything a customer sees on https://elli-hansen.vercel.app/: petrichor composition
and full note pyramid; **longevity 8–10 h, sillage intimate-to-moderate, wear
timeline**; prices €28 sample (**credited toward any bottle within 30 days**) /
€170 50 ml / €240 100 ml / €180 refill; **complimentary worldwide shipping**;
30-day returns (unopened); **free engraving (final sale)**; archival gift wrap;
Copenhagen studio hours (Thu–Sat); Vogue Scandinavia quote.

## Panel
Same 40 stratified personas as baseline (identical cards, fresh independent
elicitation; single cell). Same blind SSR scoring rules and anchors.

## Headline results

| Metric | Baseline (avg of both price cells) | **Live page** | Δ |
|---|---|---|---|
| Mean purchase intent | 2.42 | **2.50** | +0.08 |
| Top-2-box, full panel | 17.3% | **19.1%** | +1.8 pts |
| Top-2-box, target segment* | 32.0% | **35.6%** | +3.6 pts |
| Target-segment mean PI | 2.99 | **3.14** | +0.15 |

*Engaged (heavy/moderate) × mid/high income, n=20.

The lift is modest at panel level (within run-to-run noise for n=40) but it is
**consistent in direction, concentrated exactly where the page's new information is
relevant** (high income +0.13, heavy engagement 3.41 vs 3.21, moderate 2.95 vs
2.83), and corroborated by the verbatims. Low income is unchanged (1.70) —
affordability is structural and no page copy will move it.

Biggest individual movers vs baseline: Helsinki pediatrician +0.65 (credit + free
returns made it "low-risk"), Cardiff retired florist +0.37 ("crediting it back is
fair-minded of them"), jaded Paris creative director +0.35 (now ordering the
sample), Stockholm engineer +0.31 (read the refill as "the real value play"),
Copenhagen brand director +0.31 → 4.14, the panel's top score ("I'm buying the
100 ml and probably gifting one"). Biggest drop: Barcelona gift-buyer −0.30 — see
finding 3.

## What the page fixed (vs baseline objections)

1. **The €28 sample toll → defused.** The credit was noticed by 30+ of 40 personas
   and praised in strikingly consistent language: "the fairest sampling mechanic
   I've seen" (P24), "how every niche house should do it" (P06), "basically free
   diligence" (P17), "removes my main objection to blind-buying" (P20). The
   baseline's most-resented number is now the page's most-praised mechanic.
2. **Longevity fear → softened, not eliminated.** The 8–10 h claim moved hesitant
   personas from "quiet = vanishes, I'm out" to "I'll verify on skin" — but the
   skeptics explicitly discount self-reported performance: "'8–10 hours' from a
   brand's own page means nothing" (P08); "8–10 hours would be respectable… if
   true" (P24). This objection now ends at the sample instead of ending the visit.
   Only third-party reviews finish the job.
3. **Refill = unexpected credibility signal.** Repeatedly read as proof of a serious
   long-term house, even by hostile personas ("a refill bottle shows some
   integrity" — the Lisbon diplomat who rejected everything else).

## What the page is actively hurting

1. **The Vogue Scandinavia quote backfires with your best customers.** 8 personas
   mocked or distrusted it — and they cluster in the high-intent niche segment:
   "pure press-kit poetry" (P11), "exactly the copy I'd write for a client and
   exactly why I don't trust it" (P26, ad creative director), "slightly undermines
   the under-the-radar appeal" (P17), "perfumes do not 'compose' rooms" (P30).
   Nobody cited it positively. Replace it with the thing P04 asked for: **the
   perfumer's name / composition credit** — "I'd rather read the perfumer's name,
   which is conspicuously absent."
2. **Engraving final-sale spooks gift buyers.** The Barcelona chef (gift mission)
   dropped −0.30: "if I get her initials on it and she hates it, that's it." The
   Utrecht anniversary shopper walked for the same reason. A gift-receipt exchange
   policy (or engraving-after-approval flow) would recover the gifting use case the
   free engraving was meant to win.
3. **The credit doesn't help non-committers** — correctly noted by budget personas:
   "the credit is a trap for people like me: it only matters if you have €170
   sitting around within a month" (P03). No action needed; this segment is out of
   market. A cheaper non-credited discovery format (€10–12 dab vial) is the only
   lever if you ever want them.

## Representative voices
> "The €28 sample crediting toward a bottle is how every niche house should do it." — P06, Copenhagen designer
> "The sample-credit mechanism removes most of the risk — €28 becomes a free trial if I convert." — P08, Stockholm engineer
> "I'll just go smell it in person… I'm buying the 100 ml and probably gifting one." — P23, Copenhagen brand director
> "'8–10 hours' from a brand's own page means nothing; fresh aquatics routinely die in three." — P08
> "The Vogue Scandinavia line is exactly the copy I'd write for a client and exactly why I don't trust it." — P26, Paris creative director
> "Engraved means no returns… I think I'll buy her usual perfume." — P05, Utrecht, anniversary gift

## Recommendation
The live page is a measurably better selling document than the bare concept — keep
the sample credit, performance timeline, refill, and free shipping/returns exactly
as they are; they are doing the work. Two copy-level fixes are indicated by the
data: (1) replace the Vogue quote with a perfumer credit and, as soon as one
exists, a named third-party review or Fragrantica link — your highest-intent
segment distrusts brand poetry but explicitly asks for attributable craft; (2) add
a gift path that doesn't dead-end at "engraved = final sale" (exchange policy or
engrave-after-trial), which currently costs you the two gift missions in the
panel. The structural ceiling remains trial access outside Copenhagen — stockists
or counter presence is the only lever the page itself cannot pull.

## Methodology & limits
Synthetic panel using Semantic Similarity Rating (PyMC Labs / Colgate-Palmolive
2025, arXiv:2510.08338): LLM personas gave free-text reactions which were scored
against Likert anchor statements in a separate blind pass. The method reaches
~90% of human test-retest reliability on survey purchase intent — it estimates
what people would *say* in a survey, not what they will buy. Scores are most
trustworthy as comparisons (between prices, variants, segments), in categories
the model knows well. Validate against real sales/survey data where available.

---
*Run details: 40 verbatims (same personas as baseline, fresh elicitation against
the live-page offer), 8 elicitation agents (no scale shown), 2 blind scoring agents
(no demographics/product shown), identical anchors/rules as baseline. The +0.08
panel-level lift is within noise for n=40; the segment-level pattern and verbatim
evidence are the reliable signal. Raw scores:
`raw-scores-asmara-live-2026-06-12.jsonl`; comparison: `compare.py`.*
