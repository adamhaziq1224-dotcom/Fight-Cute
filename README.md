# Fight Cute — projek boleh edit

Buka keseluruhan folder ini dalam Antigravity melalui **Open Folder**. Game menggunakan HTML, CSS dan JavaScript Canvas; tiada framework, pemasangan pakej atau API key diperlukan.

## Jalankan

Dengan Node.js 18 atau lebih baru, buka terminal dalam folder ini:

```sh
npm run dev
```

Buka http://localhost:5173. Selepas mengubah kod, simpan dan refresh browser. Pelayan hanya mendengar pada komputer sendiri. `index.html` juga boleh dibuka terus untuk bermain offline.

## Fail yang perlu diubah

| Fail | Kandungan |
| --- | --- |
| `index.html` | Susunan skrin dan butang |
| `src/styles/interface.css` | Start, menu, karakter, loading dan pemilihan map |
| `src/styles/battle.css` | Health/energy bar, joystick, butang combat dan keputusan |
| `src/game/title.js` | Dunia permulaan, awan, tulisan dan saiz skrin |
| `src/game/navigation.js` | Pilihan mode, level dan state pemilihan |
| `src/game/characters.js` | Nama, HP/attack/def, personaliti dan SVG pemilihan |
| `src/game/character-select.js` | Pemilihan Player/NPC dan butang PASTI |
| `src/game/loading.js` | Tips dan skrin loading |
| `src/game/map-select.js` | 7 map, random dan preview pixel |
| `src/game/combat.js` | Definisi arena, kelajuan/skill, damage, NPC dan timer |
| `src/game/hud.js` | Paparan health, energy dan cooldown |
| `src/game/arenas.js` | Lantai, cuaca, parallax dan suasana arena |
| `src/game/fighters.js` | Bentuk, warna, shading dan animasi anggota setiap haiwan |
| `src/game/challenge-data.js` | 10 tema, reka bentuk laluan, musuh, halangan dan relay puzzle interaktif |
| `src/game/challenge.js` | Campaign: pemilihan haiwan, physics, musuh, kuiz, checkpoint, unlock dan bintang |
| `src/game/free-data.js` | Lima dunia, fizik, puzzle dan susunan laluan Free Mode |
| `src/game/free-mode.js` | Free Mode: gerakan, spring, combat, bos, kunci dan progress |
| `src/styles/free-mode.css` | UI expedition dan kawalan Free Mode |
| `src/styles/challenge.css` | Peta pengembaraan, HUD campaign, dialog kuiz dan kawalan touch |
| `src/game/controls.js` | Input keyboard/touch, rendering, pause dan rematch |
| `src/game/music.js` | Muzik latar, mute, volume dan simpan tetapan |
| `assets/audio/expedition-theme.wav` | Lagu asal retro adventure, 64 saat |
| `assets/maps/` | 7 gambar map WebP yang boleh diganti |

## Semak dan export

```sh
npm run check
npm run build
```

`check` menyemak pautan fail dan sintaks JavaScript. `build` menghasilkan **dist/index.html** dengan aset terbenam untuk dikongsi sebagai satu fail offline. Edit fail sumber, bukan fail export.

## Status sebenar

1 vs 1 menentang NPC dan semua **10 level Challenge** boleh dimainkan. Pilih Challenge → level yang terbuka → haiwan → PASTI. Menang membuka level seterusnya. Rekod terbaik disimpan dalam browser (localStorage).

Campaign: Skyline Relay, Mossy Meadows, Coral Coast, Sakura Steps, Lantern City, Frosted Peaks, Lunar Archive, Clockwork Library, Storm Academy, Astral Citadel. Kesukaran meningkat melalui laluan lebih panjang, langkah sempit, platform bergerak/rapuh, musuh darat/udara, duri, projectile dan kuiz lebih mencabar. Lunar Archive mempunyai graviti rendah; dua level terakhir mempunyai angin ketika di udara.

Setiap level mempunyai tiga hati, checkpoint dan 1–3 relay terminal. Selesaikan semua puzzle sebelum tamat. Signal Matrix menukar sel dan jiran; Phase Lock memutarkan dua dial yang berkaitan. Undo dan reset tersedia, manakala HINT dikira sebagai bantuan untuk bintang perfect. Bintang: tamat level; kutip sekurang-kurangnya 80% coin; tiada damage dan tiada bantuan puzzle. Maksimum 30 bintang.

Free Mode kini mempunyai lima dunia berturutan: Meadow Frontier, Cloud Citadel, Lunar Outpost, Frostline Ridge dan Sakura Shadow Village. Pilih haiwan dahulu; cari amber key melalui spring, selesaikan logic gate, kemudian survive bos selama 60 saat untuk mint key dan buka dunia seterusnya. Reka bentuk Free Mode disasarkan untuk umur 10–12 tahun: UI expedition, kod simbol dan logik, dengan petunjuk apabila jawapan salah. Sasaran sesi 3–5 minit per dunia, tanpa had masa; tempoh sebenar bergantung kepada pemain. Tiada multiplayer online atau backend. Muzik instrumental asal 64 saat dimainkan berulang selepas interaksi pertama. MUSIC untuk mute, VOL untuk volume; pilihan disimpan dan muzik berhenti apabila tab tersembunyi.

Kawalan: A/D bergerak, W/Space lompat, J serang, K heavy, E skill, R guard, Q ultimate, Esc pause. Touch joystick dan butang disediakan untuk mobile landscape.

Baca `docs/ARCHITECTURE.md` sebelum mengubah aliran atau menambah mode.

Challenge controls: A/D atau ←/→ untuk berjalan, W/S atau ↑/↓ untuk tangga, Space untuk lompat, J untuk bop musuh, E untuk membuka gate berdekatan, Esc untuk pause. Gate juga dibuka secara automatik apabila dihampiri di platform. Semua 7 haiwan menggunakan pergerakan yang sama untuk memastikan laluan boleh diselesaikan.

Free Mode controls: A/D atau ←/→ bergerak; Space lompat; J serang (shuriken di dunia ninja); E guna tanda/gate; S atau ↓ tunduk dan brek atas ais; Esc pause. Checkpoint memulihkan empat hati. Bekalan nyawa muncul di kiri arena bos setiap 12 saat. Kunci dan gate yang sudah selesai kekal selepas respawn; percubaan bos bermula semula. Rekod dunia yang tamat disimpan dalam browser.

## Expedition upgrade

Visual lebih matang menggunakan ink/jade/brass, vest pengembaraan bagi tujuh haiwan, shading berarah, platform berfaset, beacon dan lapisan bangunan parallax. Ini ialah Canvas 2.5D, bukan enjin 3D penuh. Pergerakan Free naik daripada 172 ke 205 unit/s; Challenge 160 ke 190, tangga 104 ke 132. Musuh lebih pantas/banyak dan NPC lebih responsif.

SHIFT / DASH memberikan burst pendek dengan cooldown 1.5 saat dan perlindungan 0.14 saat. Semua laluan boleh dilalui tanpa dash. Puzzle menggantikan soalan pilihan jawapan, meningkat kepada matriks 4×4 dan enam dial. Lihat `src/game/puzzles.js`, `src/game/premium.js`, `src/styles/premium.css`. Reka bentuk kekal tanpa keganasan grafik dan disasarkan untuk umur 10–12 yang mahukan cabaran lebih serius.

## Current art direction — Retro pixel edition

The active renderer is now `src/game/retro-art.js`, loaded after premium.js. Seven original animal sprites are drawn at 96×96 with integer pixel blocks, limited palettes and dithered shading. Four-frame idle/walk/climb animations replace smooth limb rotation. All adventure and battle environments use procedural pixel scenery, grass/dirt platforms, stepped clouds, layered parallax and sparkles. The modern panels are overridden by `src/styles/retro.css`.

`assets/fonts/retro-grid.ttf` is an original bitmap-style font generated by `tools/build-pixel-font.py`; no external font download is needed. The export embeds the font. Existing image assets and older renderers are kept as editable legacy sources but are not the active scene art. Gameplay physics, ten challenge routes, five free worlds, relay puzzles and dash remain intact.

## Latest: living arenas and unified 64px roster

All seven 1v1 maps now use `src/game/living-arenas.js`: 3-layer parallax, map-specific tiled ground and ambient motion. Beach waves/gulls, sakura petals/bridge, neon lanterns/river, cloud island/castle, moon craters/stars, library shelves/dust/window light and campus foliage are drawn with integer pixel blocks. Random remains a UI icon. Map cards animate the same arena renderer used during combat.

`src/game/chibi-combat.js` supersedes the earlier 96px sprite renderer with seven original 64×64 mascots, white tops, blue collars, three-tone fur shading and 9–10 colours per sprite. This shared roster is used in selection, loading, Free, Challenge and 1v1. Nearest-neighbour scaling preserves hard edges.

1v1 now has three stocks per fighter: a KO uses one heart and respawns with full HP and brief protection; losing all three ends the match. The 90-second clock is shared across stocks. At timeout the greater remaining stock count wins, with remaining HP fraction as the tiebreaker. Gold HP bars reveal a red missing-health segment; energy remains underneath. Character portraits, heart stocks and the central timer mirror left/right.

## Ten relay minigames

Challenge levels 1–10 now use Signal Matrix I, Wire Reroute, Power Calibration, Signal Matrix II, Echo Sequence, Dual Relay Sync, Dial Alignment, Interference Sweep, Signal Matrix III and Master Relay in order. Multiple gates in one level use fresh variants of that level’s mechanic. Free Mode chooses a random type from the same ten at each new gate attempt. Numbers, targets, patterns and wire labels are randomized.

Locked cells never change, including neighbour effects. Toggle puzzles are scrambled using legal moves to guarantee solvability. Memory Matrix reveals for three seconds; REVEAL/RESET are assists. Echo includes visual numbered lights and optional sound respecting music mute. Timing tasks and Sweep use their own active puzzle clock while the game world is frozen. Hidden tabs freeze puzzle time; closing a gate disposes its animation loop. Wire supports drag, sequential clicks and keyboard. Master Relay keeps three sub-stages (1, 2, 7) in one gate before awarding completion.

Edit `src/game/relay-games.js` and `src/styles/relay-games.css`. Failed tasks and requested hints count as campaign assistance; retries are unlimited and do not remove health.
## Modern pixel-art update

`src/game/modern-art.js` is the final shared visual layer. It supplies original 128×128 animal sprites for character selection, loading portraits, versus combat, Free Mode and Challenge Mode. Each sprite uses ten-step material ramps quantized to at most 60 RGB colours (44–50 opaque colours in the standing roster), four edge-opacity steps, asymmetric anatomy, six-frame idle/walk/climb/attack cycles and cloth details. Sprites remain 2D; shading suggests volume.

Arena skies now use fine stepped colour ramps, rounded scenery has pixel-band volume, and scene-specific glows and moving motes enhance all seven versus arenas. Adventure platforms have additional material highlights. Existing layouts, collision and objectives remain compatible. Versus attacks have a 0.2-second input buffer near the end of move recovery; pausing clears it.

Validation: sprite dimensions/palette/six distinct idle frames, seven animated three-layer arenas, reduced-motion arena freeze, desktop/mobile battle flow, and relay puzzle suite. Edit the modular project and run `node tools/build.cjs` to regenerate the standalone export.

## Simple exploration gates (current)
Signal Matrix and the randomized relay minigames are no longer loaded in the playable game. `src/game/key-trails.js` replaces them with automatic world pickups: three keys on each safe Challenge gate platform; Free Mode uses the existing spring-route amber key plus two ground-path keys. No quiz modal, puzzle timer, or wrong-answer penalty. Gate counts appear in the world and HUD. All ten Challenge levels and five Free worlds were checked for supported key locations and successful unlocks. Older relay files are retained only as unused source history.
## Weapon spacing combat (1 vs 1)

`src/game/weapon-combat.js` owns the versus combat rules and weapon overlays. Seven weapons have separate reach, windup, active window, recovery, damage, movement speed and dodge recovery. Character selection shows weapon descriptions. Ground reach markers and WINDUP / STRIKE / RECOVERY labels expose attack timing; attacking during recovery grants 25% bonus damage.

Controls: J light, K heavy, E skill, Q ultimate, R guard, Shift plus direction dodge (no direction steps backward). Touch players use the new DODGE button and existing analog stick. Dodge costs 25 Energy, starts a character-specific cooldown, and has invulnerability from 0.025 to 0.20 seconds of its 0.28-second movement. Energy begins at 60 and regenerates while not guarding/dodging. Guard has three durability points, drains Energy, blocks knockback and breaks under sustained pressure; its first 0.13 seconds can parry after at least 0.25 seconds released. Heavy mallet hits break guard faster. Landak's close-range block counters for 2 chip damage and has shorter hit stun.

Puppy's disc must return before another throw and can hit on its return; Fox throws knives with a heavy fan; Owl charges a pushing wind projectile. Ranged damage is reduced inside the weapon's preferred minimum spacing. NPCs approach or retreat according to their own weapon, react to telegraphs and attempt recovery punishes. Light chains and timed heavy finishers use the visible character-specific input strings.

The implementation keeps the shared 128px chibi sprites and adds proportional pixel weapons, phase poses, trails, dodge afterimages and guard sparks. Free/Challenge rules are unchanged. Verified: all seven weapon hit paths and phases; guard, parry, dodge, Energy, disc retrieval, NPC spacing, stock reset, keyboard/touch controls, input buffering, and all 15 exploration courses' key gates. Combat balance is an initial tuning pass and can be adjusted in weaponRoster.

## Portrait handheld layout
Portrait (width < height) uses an original lavender handheld shell, recessed screen and large controls below the game. The game stays 16:9 with letterboxing. Existing control DOM nodes are temporarily moved to the dock, preserving their event handlers; landscape restores them to their exact original parents. Rotation clears held input only, without replacing match/course state. Portrait menus offer large shortcut buttons, and pause dialogs use the same shortcuts. Safe-area insets and compact 320px-wide phones are supported. `src/game/handheld.js` and `src/styles/handheld.css` implement the presentation.

## Free Mode: randomized world puzzle framework

`src/game/expedition-puzzles.js` replaces Free Mode's simple key trail with exactly three in-world trials in each of the five worlds. Every new run shuffles Cloud Stepping-Stone Sequence (platforming), Windmill Redirect (environmental timing/direction), and Sleeping Guardian Bypass (combat plus a back-route exploration option). Parameters and fan phases/directions are randomized; levels increase cloud count, narrow footholds, add a third fan, shorten gust windows and make guardians notice the player sooner. There is no quiz dialog.

Clouds must be visited in numbered order; standing for two seconds makes one disappear for 3.5 seconds. Ground contact resets the sequence. Fans alternate ON/OFF: USE reverses their direction; ride every right-facing fan before reaching the altar. The sleeper can be bypassed by jumping behind it and pressing USE, or cleared with a barrel (USE near it). Attacking or lingering in front alerts exactly two additional guards; defeat both and USE the chest as a fallback. Unsolved trials reset on respawn; earned keys persist. All three trial keys open the gate before the existing boss trial. Challenge mode retains its simpler key platforms.

Verification includes all 15 rewards, supported encounter placements, increasing geometric difficulty, cloud fade/return, stealth/barrel/alert fallback, pause and key persistence. Scripted movement using normal jump/gust physics completed cloud and wind routes in all five worlds. These checks establish route feasibility, not broad human difficulty playtesting.

## Three-phase weakpoint bosses (all five Free worlds)

`src/game/weakpoint-boss.js` replaces timer-survival victory. Boss HP scales from 100 to 180. Phase 1 (above 60% HP) cycles telegraphed slam, volley and lunge attacks. A clean evasion by moving, jumping or dashing opens a short glowing weakpoint window; only attacks during that window deal damage, capped at two hits per opening. Phase 2 (60%–30%) raises two moving platforms, adds a telegraphed hazard strip and introduces a ground shockwave. Phase 3 (30% and below) attacks more frequently and adds a marked burst; a clean last-0.10-second dash during its tell opens a longer, higher-damage punish window.

The boss HUD displays HP and phase, never survival time. Depleting HP awards the existing mint-key pickup. Losing all player hearts restarts the boss at full HP/phase 1 while retaining expedition puzzle keys. No timed automatic victory or passive stagger-to-win path remains. Ninja projectiles also obey weakpoint damage rules. Existing pause, portrait/landscape, jump, attack and dash controls are reused.

Automated checks cover phase thresholds and weakpoint victories on all five worlds, armour protection, failed-dodge rejection, raised platforms, defeat-key pickup, loss/reset, and pause. Difficulty still benefits from human playtesting.
