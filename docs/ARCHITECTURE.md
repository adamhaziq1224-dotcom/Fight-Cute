# Architecture and editing guide

## Runtime

This is a dependency-free Canvas 2D game. It uses ordered classic deferred scripts, **not ES modules**. Top-level variables share the browser global lexical scope. Keep script order in index.html: title → navigation → characters → character-select → loading → map-select → combat → hud → arenas → fighters → controls → challenge-data → challenge → free-data → free-mode → music. Event handlers may call functions defined in later scripts after all deferred scripts finish.

Canvas world coordinates are 640 × 360 for fights. The interface uses a 1280 × 720 stage scaled to the viewport. groundY is 278. Visual fighter drawing is independent from collision, damage and movement.

## Main state

- `scene`: active page; `match`: current battle or null.
- `fighters`, `randomResolved`, `playerConfirmed`: selection state.
- `selectedMap`: numeric arena ID; `loadingRun` and `matchLoad`: cancellation tokens.
- `animals`: base character stats; `moveStats`: speed and skill range.
- `arenaDefinitions`: reusable environment properties for map IDs 1–7.

## Flow

Start → modes → Player selection → confirm → NPC selection → confirm → map selection → loading → beginMatch → battle → result / rematch / choose map.

Combat update and render run in requestAnimationFrame. drawFighter uses articulated limbs and procedural gradients; animalSVG is the separate character-selection illustration. Update both when redesigning an animal. Attack damage occurs at action.windup, which also drives the animated extension pose. Hit-stop briefly freezes simulation for impact.

## Ten-level campaign

`challenge-data.js` owns ten deterministic course definitions and 20 multiple-choice questions. Each course is built from a bounded zigzag route with ladder islands and smaller jump platforms; width, number of steps, enemy count and mechanics change by level. `createCampaignCourse(level)` returns fresh mutable state for a run. No random layout generation is used.

`challenge.js` owns the campaign UI, simulation, selection, quiz gates, collision, enemies and progress. It uses the same articulated animal rig as battle. Input includes acceleration, a 110ms coyote window, a 140ms jump buffer and touch buttons. Enemies can be bopped or stomped; damage returns the player to the highest checkpoint and gives two seconds of protection. Crumbling platforms return after 2.8 seconds.

Quiz dialogs freeze simulation. Each gate has an answer index and explanation; incorrect options become disabled and show hints. Every gate must be solved before the finish can award completion. Pause is separate from quiz state. Hidden-tab focus pauses the active game.

Best stars are sanitized and persisted as ten numbers in `fight-cute-campaign-v1`; old Level 1 stars are migrated. Completed stages unlock the next. Replays keep the best score. There is no time limit. Stars reward completion, >=80% coins, and zero hits plus zero quiz retries. All 10 levels use the same movement tuning for every animal so reachability does not depend on character choice.

Edit campaignLevels, campaignQuestions and createCampaignCourse to author new content. Quiz answers and maps are local game content, not a secure online assessment. No backend is required.

## Asset editing

Map IDs match assets/maps/arena-01.webp through arena-07.webp: beach, sakura, neon city, sky, moon, library, college. Preserve paths or update index.html. Source images are local and need no network access. Canvas layers add floors/weather. The bundled expedition theme is an original synthesized 64-second instrumental. A single HTML audio element loops across scenes; music.js owns user-gesture start, mute, volume persistence and hidden-tab pause. build.cjs embeds WAV as audio/wav for the standalone export. The earlier user-provided MP3 was actually HTML and was not used.

## Manual verification

Check Player confirmation gates NPC selection; Random resolves once; all seven maps load; loading cancellation works; movement/jump/guard/attack/heavy/skill/ultimate work; health and energy update; KO/rematch/pause work; desktop and mobile landscape layouts fit. Test reduced-motion and keyboard focus. npm run check is only a static check, not a gameplay test.

## Free Mode expedition

`free-data.js` creates five 6,800-unit horizontal worlds with deterministic ground gaps, upper routes, springs, patrol enemies, checkpoints, one logic lock and a boss arena. Each has distinct scenery and movement (moving clouds, low gravity, ice momentum, ninja shuriken). All seven characters share reachability tuning.

`free-mode.js` owns free-select/free scenes and its independent input, simulation, camera and dialogs. A 120ms coyote window and 140ms jump buffer assist jumps. Springs auto-launch from grounded contact. Four hearts, checkpoint recovery and generous invulnerability make retries forgiving. Boss trial lasts 60 active seconds; six attacks stagger it for five seconds. Health supply appears every 12 seconds. Death restarts the trial, preserving the route key and solved gate. Quizzes/pause stop simulation.

An amber route key, solved gate and mint boss key are all required at exit. Completion unlocks the next world and saves best time in `fight-cute-free-v1`; refresh restarts incomplete worlds. Scenery is procedural Canvas with layered parallax, not a static image. Edit source files then rebuild the standalone export. The age 10–12 direction uses restrained expedition UI and multi-step logic clues rather than preschool arithmetic.

## Current expedition revision

Load puzzles.js before challenge.js, and premium.js after all mode scripts. The older campaignQuestions array remains unused legacy content: both gate flows now mountRelayPuzzle. The puzzle model is deterministic and scrambled by valid reversible moves; there is no multiple-choice answer path. Matrix neighbours toggle modulo 2; adjacent linked dials rotate modulo 4. Undo/reset do not penalize; campaign hints increment the existing assistance counter used for perfect stars.

Premium wraps adventure draw functions to add side faces to platforms and adds a shared optional dash. Both physics loops tick dash timers only while running and set burst velocity before normal collision resolution. Dash never teleports past collision checks. Character selection SVG and articulated rig both use expedition vests. Rendering remains Canvas 2D with simulated volume and parallax. Existing save keys are retained.

## Retro renderer

Load retro-art.js last. It supplies cached 96×96 palette sprites and replaces drawFighter, animalSVG, spriteImage, arenaImage, drawEnvironment, drawFree and drawChallenge. spriteImage returns pixel canvases directly, avoiding the legacy SVG decoder. Pose selection is quantized to four frames. Pixel transparency is binary (0 or 255); smoothing is disabled when scaling. The sky alone uses a stepped pastel colour ramp. Other objects use flat colour clusters and dithering. CSS retro overrides come last; build.cjs embeds the original TTF.

## Active final overrides

Load living-arenas.js after retro-art.js, then chibi-combat.js last. living-arenas replaces arena painting, previews and arenaImage. Its near foreground wrapper draws after the fighters; decorative props do not change the ground collision line (278). All layers have explicit .10/.35/.78 camera offsets. Reduced-motion preferences freeze ambient timelines. Loading prepares the procedural canvas, so the retired map images are no longer required to enter combat.

chibi-combat replaces retroSprite/drawFighter with one 64px source shared by all modes. It wraps beginMatch, endBattle, HUD updates and drawMatch for the three-stock system and small heart VFX. Calling beginMatch resets stocks; KO respawns preserve the clock and other fighter state. Timeout uses stocks plus normalized remaining HP. Matching stylesheet comes last.

## Relay suite lifecycle

relay-games.js loads last and replaces mountRelayPuzzle while preserving its integration callback. Each mount disposes the previous session. A single requestAnimationFrame clock runs only for the mounted visible host and skips document-hidden time. Completion is guarded and invokes the gate callback once. The suite handles its own reset/undo/retry and marks assistance using the existing callback. Free selects uniformly from ten types; Challenge maps directly to the level number. Matrix variants use reversible legal moves; locked cells are excluded from both direct and adjacent changes. Wire routes are noncrossing templates with randomized rotation and numbered endpoints. Master stages share one session. Legacy puzzles.js is retained but no longer mounts the active gate UI.
