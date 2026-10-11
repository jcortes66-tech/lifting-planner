# Background Studies

## 1. Project overview

**Working title:** Lifting Overload Generator

**Problem statement:**  
There aren't easy to follow strength training programs for beginners, or simple apps that tell users how much they should be lifting and show their progress over time. This also affects people who want to start working out but don't know where to begin, without guidance on what to lift or how to progress, getting started can feel intimidating enough that they don't. A personal coach can solve this, but coaching is expensive and hard to stick with long-term.

**Proposed outcome:**  
A tool where users log their lifts and set their goals, with progress shown visually over time. Built in phases: logging and progress tracking first, followed by a rule-based recommendation engine that tells the user how much to progressively overload by, based on their logged performance.

**Initial scope:**

- In scope: user's current goals, target muscle group selection, progressive overload calculation and recommendations, progress tracking/display over time, built as a mobile app (React Native) tested through Expo Go.

- Out of scope: nutrition/diet tracking, social or community features.

## 2. Background and motivation

Building strength requires progressively challenging your muscles over time, but knowing exactly how to do that, how much weight to lift, when to increase it, and whether you're actually making progress, is not obvious to most people. Fitness apps generally just log workouts without telling the user what to do next, and hiring a personal coach to provide that guidance is expensive and hard to sustain long-term. This leaves a gap for people who want structured guidance but don't have access to a coach, including complete beginners who don't know where to start at all.

For a reader unfamiliar with strength training, a few terms matter here. Progressive overload is the principle that muscles only grow stronger when they're gradually challenged with more weight, reps, or difficulty over time, without it, training plateaus. RPE (Rate of Perceived Exertion) is a scale lifters use to rate how hard a set felt, commonly on a 1–10 scale, which can be used to judge how much harder or easier the next session should be. Coaches use a practice called autoregulation, adjusting a lifter's next session based on how the previous one actually went, often informed by RPE, instead of following a fixed plan regardless of performance. This project applies that same idea in a rule-based, automated way, so users get session-to-session adjustments without needing a human coach to provide them.

## 3. Research questions

Use focused questions to guide the literature search. Initial placeholders include:

General Questions:
1. What solutions currently address this problem?
2. What algorithms, architectures, tools, or design patterns do those solutions use?
3. What limitations or unresolved challenges remain?
4. How will the proposed project differ from or improve upon existing work?

Specific Questions: 

1. What existing apps or methods help lifters know how much to lift next, and do any of them adjust based on the user's actual performance rather than a fixed plan?
2. What rules do coaches and existing tools use to decide when to increase, hold, or decrease a lifter's weight or reps? 
3. What are the limitations of current fitness-tracking apps when it comes to giving users real guidance instead of just logging data?
4. How will a simple rule-based recommendation system compare to a fixed, one-size-fits-all progression plan?

## 4. Literature-search plan

**Suggested sources:**

- ACM Digital Library
- IEEE Xplore
- Google Scholar
- Relevant standards and official technical documentation

**Search terms:** strength training, progressive overload strength training, autoregulated resistance training

**Selection criteria:**

- Direct relevance to the problem or proposed technical approach
- Credible, preferably peer-reviewed or primary sources
- Recent work where the field changes quickly
- Foundational older work where appropriate

## 5. Source review

Add one entry for each important source.

### Source 1

- **Citation:** Huang Z, Sun J, Li D, Chen C, Wang D. "Autoregulated resistance training for maximal strength enhancement: A systematic review and network meta-analysis." Journal of Exercise Science & Fitness. 2025;23(4):360-369.
- **Research problem:** Which self-regulated training method (APRE, RPE-based, or velocity-based) most effectively improves maximal strength compared to fixed percentage-based training?
- **Approach or method:** Systematic review and network meta-analysis of 19 randomized controlled trials, 438 total participants.
- **Key findings:** All three autoregulation methods significantly outperformed fixed percentage-based training for strength gains; APRE ranked highest overall.
- **Limitations:** Meta-analysis quality depends on the underlying studies included; doesn't test a rule-based automated system specifically, only human-applied autoregulation methods.
- **Relevance to this project:** Strong, recent evidence across multiple studies that autoregulation outperforms fixed plans, directly supports the core premise of this project at a much larger scale than any single study.

### Source 2

- **Citation:** Kassiano W, Santos-Melo V, Manske I, et al. "Progressive Overload Affects the Magnitude of Muscle Hypertrophy." Medicine & Science in Sports & Exercise. 2026.
- **Research problem:** Does progressively increasing training load produce more muscle growth than training with constant load?
- **Approach or method:** Within-subject design, 55 untrained women, one arm trained with progressive overload, the other without, over 8 weeks.
- **Key findings:** Progressive overload produced substantially greater muscle growth (22.9%) than non-progressive training (11.6%).
- **Limitations:** Untrained young women only, single muscle group (triceps), short duration (8 weeks).
- **Relevance to this project:** Direct evidence that progressive overload itself drives results, the foundational principle my recommendation logic is built on adjusting correctly.

## 6. Comparison of existing work

| Work or system | Goal | Approach | Strengths | Limitations | Relevance |
|---|---|---|---|---|---|
| Strong (app) | Log workouts | Manual digital logbook, no automated guidance | Simple, reliable tracking | Gives no recommendation on what to do next |
| Fitbod (app) | Personalize workouts automatically | AI-driven, adjusts weight/volume based on performance and recovery | Fully automated recommendations |Subscription cost | Shows demand for adaptive guidance exists, but not as a simple or explainable free tool |
| Caliber (app) | Provide personalized coaching | Human coach reviews progress and adjusts plan weekly | Highly personalized, real human judgment | Expensive, up to $200 a month for one-on-one coaching
| JuggernautAI (app) | Adapt powerlifting programs automatically | AI adjusts training at set/day/week/block level based on feedback | Automated, detailed adaptation across multiple timescales | Powerlifting-focused, not beginner-friendly| Confirms automated adaptive coaching is a validated approach, but complex and not accessible to beginners |

## 7. Synthesis and project opportunity

The research shows that weightlifting, especially when done with progressive overload and adjusted based on how each session goes, is a big help for building muscle and getting stronger. Autoregulating training based on performance works better than just following a fixed plan (Huang, 2025), and increasing the weight over time is what actually drives muscle growth, more than just training with the same weight repeatedly (Kassiano, 2026).

The problem is that the current apps meant to help people build muscle either just log your workouts without telling you what to do next (Strong), use AI to give recommendations but don't explain how they came up with them (Fitbod, JuggernautAI), or require paying a lot of money for a human coach to do it for you (Caliber).

This project's opportunity is to build something in between, a free, simple tool that uses the same research idea these apps and coaches rely on, adjusting your next workout based on how your last one went, but in a way that's beginner-friendly and easy to understand, instead of expensive or a black box.

## 8. References

1. Huang Z, Sun J, Li D, Chen C, Wang D. Autoregulated resistance training for maximal strength enhancement: A systematic review and network meta-analysis. *Journal of Exercise Science & Fitness*. 2025;23(4):360-369.
2. Kassiano W, Santos-Melo V, Manske I, et al. Progressive Overload Affects the Magnitude of Muscle Hypertrophy. *Medicine & Science in Sports & Exercise*. 2026.
