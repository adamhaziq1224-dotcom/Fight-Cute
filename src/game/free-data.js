// Five side-scrolling worlds. A relaxed 3–5 minute pace is a target, not a time limit.
const freeWorlds = [
 {name:'Meadow Frontier',subtitle:'Green hills & blue skies',kind:'meadow',sky:['#72cbed','#dcf4ef'],ground:['#b7e28e','#70af77','#b78969'],enemy:'spider',boss:'Silkwarden',hint:'Bop spiders with J, or land on them. A spring leads to the hidden key.',clue:'The garden sign says: SUN → LEAF → FLOWER.',question:'Which sequence opens the garden door?',answers:['SUN → LEAF → FLOWER','FLOWER → SUN → LEAF','LEAF → FLOWER → SUN'],answer:0},
 {name:'Cloud Citadel',subtitle:'A path above the clouds',kind:'cloud',sky:['#82bdea','#f5f1ff'],ground:['#ffffff','#d1d5f0','#b8b9dc'],enemy:'puff',boss:'Tempest Sentinel',hint:'The blue cloud lifts sway gently. Jump towards the centre.',clue:'The cloud bell rings twice, pauses, then rings once.',question:'How many rings did the cloud bell make?',answers:['2','3','4'],answer:1},
 {name:'Lunar Outpost',subtitle:'Low gravity & orbital ruins',kind:'moon',sky:['#6973ba','#c8cbee'],ground:['#eee5f6','#b4accd','#9089ae'],enemy:'moonbug',boss:'Lunar Warden',hint:'Low gravity means longer airtime. Release a direction early to land.',clue:'The moon panel shows 2, 4, 6, 8…',question:'Which number powers the next moon panel?',answers:['9','12','10'],answer:2},
 {name:'Frostline Ridge',subtitle:'Ice trails & frozen ruins',kind:'ice',sky:['#96d7e4','#edf8f7'],ground:['#ecfcff','#9fd7e5','#83adc9'],enemy:'snowling',boss:'Glacier Guardian',hint:'Ice keeps your momentum. Hold the opposite direction to brake.',clue:'Three ice crystals each have two glowing tips.',question:'How many glowing tips are there altogether?',answers:['6','5','8'],answer:0},
 {name:'Sakura Shadow Village',subtitle:'Petals, rooftops & flying stars',kind:'ninja',sky:['#a1a5df','#f5dce6'],ground:['#e9bdd2','#b89abb','#927c9e'],enemy:'ninja',boss:'Ronin Kage',hint:'Your ninja outfit is ready. J throws a shuriken; duck under high shots with S.',clue:'The dojo scroll says: 1 star + 2 stars + 3 stars.',question:'How many stars belong on the dojo seal?',answers:['5','6','7'],answer:1}
];
// Logic locks aimed at ages 10–12: decode, reason, then choose.
Object.assign(freeWorlds[0],{clue:'SUN = 4, LEAF = 7, FLOWER = 2. The three digits are LEAF−SUN, SUN+FLOWER, LEAF−FLOWER.',question:'Decode the three-digit gate code.',answers:['365','563','357'],answer:0,explanation:'Work out each digit separately: subtract, add, then subtract. Keep the order on the sign.'});
Object.assign(freeWorlds[1],{clue:'The blue beacon flashes every 6 seconds. Gold flashes every 8. They flash together at the start.',question:'After how many seconds do both flash together again?',answers:['14 seconds','24 seconds','48 seconds'],answer:1,explanation:'List multiples of 6 and 8. Find their first shared number after zero.'});
Object.assign(freeWorlds[2],{clue:'The lunar terminal displays: 2, 6, 12, 20, …',question:'What number completes the next step?',answers:['28','32','30'],answer:2,explanation:'The gaps increase: +4, +6, +8. What gap comes next?'});
Object.assign(freeWorlds[3],{clue:'Three lamps start OFF. Switch A toggles LEFT + MIDDLE. Switch B toggles MIDDLE + RIGHT.',question:'Which switches leave only LEFT and RIGHT on?',answers:['A then B','Only A','A twice'],answer:0,explanation:'A lamp toggled twice returns to OFF. Track the middle lamp carefully.'});
Object.assign(freeWorlds[4],{clue:'From the shrine: move 3 east, 2 north, 1 west, then 1 south.',question:'Where is the hidden seal relative to the shrine?',answers:['1 east, 2 north','2 east, 1 north','2 west, 1 south'],answer:1,explanation:'Cancel opposite steps: east against west, north against south.'});
function makeFreeWorld(index){
 const def=freeWorlds[index],length=6800,platforms=[],gaps=[];
 for(let i=0;i<8;i++)gaps.push({x:550+i*670,w:64+(index===1?12:0)});
 let previous=0;for(const gap of gaps){platforms.push({x:previous,y:282,w:gap.x-previous,baseX:previous,ground:true});previous=gap.x+gap.w;}platforms.push({x:previous,y:282,w:length-previous,baseX:previous,ground:true});
 // Optional stepping stones and overhead coin trails. Ground remains the easy route.
 for(let i=0;i<7;i++)platforms.push({x:760+i*690,baseX:760+i*690,y:216,w:155,move:index===1?18:0});
 platforms.push({x:1160,baseX:1160,y:158,w:230,keyRoute:true});
 const springs=[{x:1090,y:282},{x:3100,y:282},{x:4460,y:282}];
 // Place all objects on actual ground, not in gaps.
 const safeX=x=>{const gap=gaps.find(g=>x>g.x-25&&x<g.x+g.w+25);return gap?gap.x+gap.w+55:x;};
 springs.forEach(s=>s.x=safeX(s.x));
 const enemies=Array.from({length:8+index*2},(_,i)=>{const x=safeX(390+i*(index>2?345:440));return{x,home:x,y:270,dir:i%2?1:-1,hp:1,kind:def.enemy,phase:i*.7};}).filter(e=>e.x<5480);
 const coins=[];for(let x=260;x<5480;x+=145)coins.push({x:safeX(x),y:249,taken:false});for(const f of platforms.filter(f=>!f.ground))for(let n=0;n<3;n++)coins.push({x:f.x+35+n*40,y:f.y-25,taken:false});
 return{def,index,length,platforms,gaps,springs,enemies,coins,gravity:index===2?380:650,jump:index===2?-295:-310,key:{x:1250,y:130,taken:false},sign:{x:1840,y:282},gate:{x:2320,y:282},bossStart:5800,bossEnd:6530,exit:6660,checkpoints:[100,950,1720,2670,3670,4770,5740].map(safeX)};
}
