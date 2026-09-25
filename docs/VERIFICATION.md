# Verification — 25 September 2026

## Campaign

Chromium automation traversed every stage from 1 to 10 through normal simulation updates with active enemies and quizzes. All gates were solved, each finish was reached, and progression unlocked the following stage. The scripted route collected all coins and achieved three stars per stage. This establishes reachability; it is not a claim of broad human difficulty playtesting.

Separate checks covered:
- New saves lock levels 2–10 and require character selection.
- Quiz opens by climbing to a gate; time freezes while answering.
- Wrong answers show hints without removing health; correct answers open the gate.
- Unsolved gates prevent completion.
- Enemy contact removes health, respawn protection, and bop defeats an enemy.
- Buffered/coyote jumping, moving platforms, crumbling platforms and restoration.
- Sentry projectiles, loss/retry, pause/resume and touch movement.
- Desktop and mobile landscape screenshots, quiz and final completion UI.
- No page errors during these checks.

The local tools/check.cjs command checks asset references and JavaScript syntax.

Both the multi-file project and standalone export passed all ten routes. Reload retained 30/30 stars and unlocked Level 10. Existing 1 vs 1 movement, jump, damage, energy, ultimate, pause and return-to-map regression checks passed.

## Free Mode

All five worlds were traversed by a scripted input driver through live physics with damage enabled: mandatory spring key, logic gate, 60-second boss trial, mint key and exit. All completed without checkpoint deaths in about 98–99 seconds with ideal input. This proves route reachability, not the stated 3–5 minute human playtime target; age-group playtesting is still needed.

Separate checks passed for wrong-answer hints and quiz freeze, pause, key-preserving checkpoint respawn, melee damage, ninja shuriken, moon gravity, ice momentum, boss-timer reset and touch jump. Desktop and mobile-landscape screens were inspected. No browser page errors were observed.

The final standalone Free Mode export passed all five routes again and retained all five completion records after reload. Music checks confirmed 64-second WAV decoding, playback time advancing after a click, embedded audio MIME, mute/resume, volume changes and persisted mute. Playback was validated technically; no claim of a human listening review.

## Expedition revision verification

The latest revision replaces all multiple-choice interactions with two relay puzzle types. A scripted driver completed ten Challenge routes and five Free routes with the faster physics, active enemies and puzzle completion through cell buttons. Scripted puzzle solving reverses known generation moves; this verifies solvability/integration, not human puzzle difficulty. Separate model tests reversed 250 generated puzzles (25 seeds × 10 tiers). UI checks covered undo, reset, hint, gate completion, frozen simulation, dash velocity/cooldown and pause. Mobile landscape puzzle and world screens were visually inspected. Broad human age-group difficulty and perceived premium quality still need playtesting.
