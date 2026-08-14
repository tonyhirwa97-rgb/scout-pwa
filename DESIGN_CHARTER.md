# Scout — Design & Decision Charter

This document is the operating system for every design decision made
on Scout, from here forward. Before building anything — a screen, a
sentence of copy, a flow — it gets run through this. It exists so that
speed doesn't cost us coherence, and so that anyone (human or AI)
picking up this project later thinks the way we've decided to think.

---

## 1. The Real Destination

Scout is not, ultimately, a shopping-request form. The destination is
an **everything app**: search once, see the same product across every
store that carries it, compare price, quality, and real perspective on
it side by side, try on clothing without owning it yet, and have it
delivered without ever needing to be physically present in a shop. The
same comparison experience extends to housing — searching, comparing,
and evaluating available homes through agents, the same way a product
gets compared across stores.

**What we're actually selling is not products. It's certainty** — the
confidence of having compared everything before committing money or
trust. Every future feature should be evaluated against whether it
increases that certainty or just adds noise.

---

## 2. Where We Actually Are

Right now, Scout does not yet fulfill orders. People are being
introduced to the idea, invited to register their interest, and
invited to bring their circles (family, roommates, classmates,
coworkers) in with them. A known future date is when real ordering,
sourcing, and delivery begins.

**This phase-honesty is a hard constraint, not a suggestion.** Every
screen, every sentence, must be true to *this* phase. We've already
learned this the hard way twice — once when a budget question read as
a scam pattern, and once when the copy implied active searching was
already happening. Both were the same mistake seen from different
angles: **promising a capability before it exists.** Before shipping
any copy or feature, ask: *does this claim something that isn't true
yet?*

---

## 3. Operating Principles

These aren't abstract philosophy — they're the actual questions to ask
before building anything.

**First principles.** Strip every feature request down to what it's
fundamentally solving, with assumptions removed. Don't ask "how do we
add budget filtering" — ask "what does someone actually need to feel
safe requesting something."

**Thinking in the limit.** Push every design to its extremes before
settling. If Scout had 10,000 stores integrated, would this screen
still make sense, or would it collapse under its own complexity? If
Scout had exactly one store, would this same screen feel like
overkill? The right design survives both ends.

**Multiple perspectives.** Every decision gets looked at from: the
person requesting, the store/seller eventually being compared, the
courier delivering, Scout as a business, and anyone concerned with
trust and safety. A screen that only works for one of these is
incomplete.

**Contradiction hunting.** "Rich choice" and "simple decisions" pull
against each other constantly as the catalog grows toward everything.
Don't quietly pick a side — name the tension and design the resolution
on purpose (this is exactly why progressive disclosure, not a wall of
options, is the answer — see Section 6).

**Truth maximization.** Real user reactions beat internal assumptions,
always. When someone said the budget question felt like a scam, that
observation outranked any design preference. Defend reality, not the
existing design.

**Systems thinking.** No screen is isolated. Every screen is part of a
single system whose job is building trust over time. A screen that
looks fine alone but breaks the trust arc is still wrong.

**Emergence.** Trust doesn't come from one badge or one line of
reassurance — it emerges from consistency across every touchpoint. A
single perfect screen surrounded by inconsistent ones still fails.

**Abstraction ladder.** Every concrete screen decision should trace
upward: this button exists because of this psychological principle,
which exists because of this piece of the business model. If a design
choice can't answer "why," it doesn't ship yet.

**Inversion.** Regularly ask "how would we make people distrust this
app, or make them abandon it halfway through?" — then deliberately
avoid every answer that surfaces. This has already found real
problems faster than asking the positive question directly.

**The five-step algorithm, applied to every feature before building
it:**
1. **Question the requirement.** Is this actually necessary right now,
   or just assumed necessary because a "normal" app would have it?
2. **Delete** the step, field, or feature entirely if at all possible.
   (We already applied this — the budget question was deleted rather
   than patched, once it was clear it didn't belong in this phase.)
3. **Simplify** whatever remains after deletion.
4. **Accelerate** — make it fast to build and fast for the person
   using it to complete.
5. **Automate** last, and only once the process has been proven
   necessary and already simplified. Automating a bad process just
   makes the bad process faster.

**Bayesian thinking.** Every design is a hypothesis, not a
conclusion. Real evidence updates it immediately — no defending a
screen just because it was hard to build.

**Expected value thinking.** Prioritize whichever change most
increases *(trust × completion rate × word-of-mouth reach)* — not
whichever feature is most impressive to have built.

**Identity thinking.** Someone using Scout should start to feel like
*"a person who shops smart,"* not *"a person filling out a form."*
Copy, pacing, and visual tone all serve that identity shift.

---

## 4. Money & Decision Psychology — Concrete Rules

- **Never ask about money before trust is earned.** Any question that
  can pattern-match to "how much do you have" reads as an advance-fee
  scam signal, regardless of intent. This is now a permanent rule, not
  a one-time fix.
- **The paradox of choice is the central design risk of the "everything
  app" vision.** As the catalog grows, default to a small number of
  well-curated comparisons first, with progressive disclosure for
  someone who wants more. Never present the full breadth of options as
  a wall.
- **Real numbers build more trust than invented urgency.** Actual
  visit counts, actual circle counts, actual founding-member numbers —
  never manufactured scarcity or fake countdown pressure.
- **Never describe a capability in the present tense before it
  exists.** This applies to every future feature, not just what's
  shipped so far.
- **Circles work because they use real relationships**, not artificial
  gamification. Any future "invite" or "referral" mechanic should be
  judged against this same standard — does it lean on a real
  relationship, or does it feel like recruitment?

---

## 5. Design Thinking Loop for Every New Feature

1. **Empathize** — who exactly, and what specific fear or desire are
   we addressing? Not "users," a specific person in a specific moment.
2. **Define** — state the problem in one sentence, no feature language.
3. **Ideate** — generate genuinely different approaches, not five
   variations of the same idea.
4. **Prototype minimally** — the smallest version that can be judged
   honestly.
5. **Test against real behavior**, not opinion — real taps, real
   completions, real feedback like the scam-language catch.
6. **Return to step 1.** This loop doesn't end at launch.

---

## 6. UI/UX Execution Standards

- **Mobile-first, thumb-reachable primary actions**, always — this is
  how the founder and most users actually hold their phones.
- **One primary job per screen.** Proven already on the landing page;
  applies to every future screen, including comparison and search
  results once those exist.
- **Progressive disclosure is the answer to "everything app"
  complexity.** Never a wall of options. Show the best few, let
  someone ask for more.
- **Visual trust language (badges, receipts, real numbers) stays
  sparing and meaningful.** The moment it's everywhere, it stops
  meaning anything.
- **Motion and sound build a feeling of aliveness and trust** — never
  decoration for its own sake. Every animation or sound should be
  answering "does this make the moment feel more real and more safe,"
  not "does this look impressive."
- **Before shipping any screen: does this claim something that isn't
  true yet?** This is the single most important check in the whole
  document.

---

## 7. Roadmap Discipline

- Build only what fully and beautifully serves the current phase:
  interest capture and Circles. Resist building comparison, try-on, or
  housing search UI before there's a real backend and real inventory
  behind them.
- **Architect with the full vision in mind** — the data model,
  category structure, and multi-store abstraction should be designed
  so today's work isn't thrown away later, even though today's *UI*
  stays deliberately narrow.
- Every current feature should be understandable as "version one of
  the eventual thing" — the category picker today is version one of a
  future product search; the Circle is version one of a future shared
  cart or shared comparison session.

---

## 8. How We Work Together

- **Always research before assuming** — real data, real user
  reactions, real patterns from comparable products, not internal
  guesswork.
- **Reason explicitly, then conclude creatively.** Show the thinking
  that led to a decision, not just the finished output.
- **Phase-honesty gets flagged before anything gets built,** the
  moment a request risks implying a capability that doesn't exist yet.
- **Every new design decision runs through this charter's questions**
  before implementation — this document is meant to be reopened, not
  written once and forgotten.
