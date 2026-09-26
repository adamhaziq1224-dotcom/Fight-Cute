# Trust Nothing — Challenge Mode

Challenge Mode now uses ten authored troll trails. Its progress is stored separately from the retired adventure campaign. Free Mode and versus combat keep their own gameplay.

Levels 1–3 introduce one deception each. Levels 4–7 pair two mechanics. Levels 8–10 chain six, eight and ten sections, respectively. The final advertised boss gate returns to the start; an unlabelled side exit completes the level.

Movement: A/D or arrows, W/S for ladders, Space to jump, Shift to dash. Existing touch controls and portrait shell remain supported. E provides a general reminder. All seven animals use the same traversable route.

There are unlimited immediate retries. Real green flags save; pale decoys do not. Death restores collapsible floors and trap timers. Copycat choices stay deterministic. Collected bait keeps its retreat shutter closed and establishes a forward respawn, preventing a locked-out checkpoint. The shutter is a one-way collision surface.

Completion shows deaths, elapsed time and a local personal best. Stars reward finishing, ten or fewer deaths, and zero deaths. Records use browser local storage, not a public leaderboard. Retry does not delete the best record.

Implementation: src/game/troll-challenge.js replaces Challenge Mode data, trap rules, rendering and results, while reusing its movement and the shared animal renderer. challenge.js supports illusion collision and reversed ladders.

Validation: all ten trap behaviours, immediate retries, checkpoint truth/decoys, fixed copycat answer, hidden finale, pause, and 185 individual jump transitions across ten routes. Individual transitions were tested from their departure platforms; this is not a human completion-time measurement. Late-stage duration depends on discovery and retries and has not been timed with players.
