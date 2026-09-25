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
