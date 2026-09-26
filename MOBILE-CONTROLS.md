# Compact mobile controls

During mobile gameplay, portrait and landscape use an edge-to-edge canvas with independent overlay controls. Selection and pause screens retain the existing menu dock. Desktop controls remain available.

- Circular D-pad: slide between directions, including diagonals. Up jumps in combat/Free Mode, and climbs in Challenge Mode. Down guards in combat and ducks in Free Mode.
- Combat: tap Attack for light, hold 380ms for Heavy; tap Skill for skill, hold for Ultimate; hold Guard; tap Dodge. Existing energy costs, cooldowns, parries and recovery remain enforced.
- Free/Challenge: Attack, Jump, Use and Dash in a compact 2x2 cluster.
- Each finger has independent pointer capture and lifetime. Cancellation, blur, pause, respawn and rotation clear held inputs without resetting game state.
- Weapon attacks allow movement at 32% of normal speed while attacking; guarding, stun and dodge still follow their existing movement rules.
- Controls use minimum 44px action targets. The circular pad has a 104px minimum for usable directional zones on narrow portrait phones, rather than shrinking to an unusable 15% of a 390px screen.
- Sprites retain their aspect ratio. Portrait extends scenery above/below the centred gameplay area; landscape crops surplus sky/ground, keeping the full horizontal arena. No reserved control panel or letterbox bars.

Validated in Chromium mobile emulation using simultaneous touch events: movement plus attack in all three modes, movement during attack, heavy hold, independent guard, pointer cancellation, full-window canvas sizing, and preserved match identity across rotation. Physical-device testing remains useful for thumb reach and browser safe areas.
