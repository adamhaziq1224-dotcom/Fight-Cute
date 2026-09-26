/* Ten-stage adventure campaign. Content is defined in challenge-data.js. */
const challengeRoot = document.createElement('section');
challengeRoot.id = 'challenge'; challengeRoot.hidden = true;
challengeRoot.innerHTML = `
 <div id="challenge-select">
  <button class="ch-small" id="ch-select-back">← LEVELS</button>
  <p class="ch-eyebrow">CHALLENGE · LEVEL 01</p><h2>Pick your sky explorer</h2>
  <p class="ch-description">Climb, collect glowing keys and reach the flag.</p>
  <div id="ch-roster" role="group" aria-label="Choose your character"></div>
  <p id="ch-choice" aria-live="polite">Choose one of your seven explorers.</p>
  <button id="ch-confirm" class="ch-primary" disabled>PASTI · LET’S CLIMB</button>
  <p class="ch-fair">Every animal can complete this course. Choose your favourite!</p>
 </div>
 <div id="challenge-play" hidden>
  <canvas id="challenge-canvas" width="640" height="360" aria-label="Sky Sweet Climb platform game"></canvas>
  <div class="ch-hud"><div><small>CHALLENGE 01</small><strong>SKY SWEET CLIMB</strong><span id="ch-hearts"></span></div><div class="ch-counters"><strong id="ch-coins"></strong><span id="ch-clock"></span></div><button id="ch-pause" class="ch-small">Ⅱ PAUSE</button></div>
  <div id="ch-tip" role="status"></div>
  <div class="ch-touch"><div class="ch-pad"><button data-ch-key="left" aria-label="Move left">◀</button><div><button data-ch-key="up" aria-label="Climb up">▲</button><button data-ch-key="down" aria-label="Climb down">▼</button></div><button data-ch-key="right" aria-label="Move right">▶</button></div><button id="ch-jump">JUMP <small>SPACE</small></button></div>
  <div class="ch-key-help">A / D MOVE · W / S CLIMB · SPACE JUMP · ESC PAUSE</div>
  <div id="ch-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="ch-result-title"><div class="ch-result-card"><p class="ch-eyebrow">SKY SWEET CLIMB</p><h2 id="ch-result-title"></h2><div id="ch-earned"></div><p id="ch-result-text"></p><button id="ch-resume" class="ch-primary">CONTINUE</button><button id="ch-retry" class="ch-primary">TRY AGAIN</button><button id="ch-repick" class="ch-small">CHANGE CHARACTER</button><button id="ch-exit" class="ch-small">LEVELS</button></div></div>
 </div>`;
stage.append(challengeRoot);
const chCanvas = document.querySelector('#challenge-canvas'), chG = chCanvas.getContext('2d');
const chSelect = document.querySelector('#challenge-select'), chPlay = document.querySelector('#challenge-play');
const chOverlay = document.querySelector('#ch-overlay');
let challengeChoice = null, challengeRun = null, chLast = 0;
const chKeys = new Set(), chPointers = new Map();
let chPlatforms=[],chLadders=[],chCoinPlaces=[];
let campaignStars=Array(10).fill(0);
try{const saved=JSON.parse(localStorage.getItem('fight-cute-campaign-v1')||'null');if(Array.isArray(saved))campaignStars=campaignStars.map((_,i)=>clamp(Math.floor(Number(saved[i])||0),0,3));campaignStars[0]=Math.max(campaignStars[0],clamp(Number(localStorage.getItem('fight-cute-challenge-1-stars'))||0,0,3));}catch{}
function unlockedChallenge(){let n=1;while(n<10&&campaignStars[n-1]>0)n++;return n;}
function refreshChallengeStars(){
 const unlocked=unlockedChallenge();
 levelButtons.forEach((tile,i)=>{const d=campaignLevels[i],locked=i+1>unlocked;tile.disabled=locked;tile.classList.toggle('ch-locked',locked);tile.style.setProperty('--island-color',d.colors[2]);tile.innerHTML=`<span class="campaign-icon">${locked?'⌑':d.icon}</span><span class="level-caption">${String(i+1).padStart(2,'0')} · ${locked?'LOCKED':campaignStars[i]?'COMPLETED':'EXPLORE'}</span><strong class="campaign-name">${d.name}</strong><span class="level-stars">${'★'.repeat(campaignStars[i])+'☆'.repeat(3-campaignStars[i])}</span>`;tile.setAttribute('aria-label',`Level ${i+1}, ${d.name}, ${campaignStars[i]} stars${locked?', locked':''}`);});
 document.querySelector('#level-status').textContent=`${campaignStars.reduce((a,b)=>a+b,0)} / 30 stars · ${campaignStars.filter(Boolean).length} / 10 adventures complete · Finish a level to unlock the next.`;
}
levels.querySelector('.mode-intro').innerHTML='<strong>THE FRONTIER PROTOCOL</strong><br><span>Ten sectors. Signal puzzles. Precision movement.</span>';
refreshChallengeStars();
for(const [id,a] of Object.entries(animals)){
 const button=document.createElement('button');button.className='ch-animal';button.dataset.animal=id;button.setAttribute('aria-pressed','false');
 button.innerHTML=`<canvas class="ch-portrait" width="160" height="170" aria-hidden="true"></canvas>`+`<strong>${a.name}</strong><span>${personalities[id]}</span>`;
 button.addEventListener('click',()=>{challengeChoice=id;document.querySelectorAll('.ch-animal').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('#ch-choice').textContent=a.name+' is ready to explore the frontier!';document.querySelector('#ch-confirm').disabled=false;});
 document.querySelector('#ch-roster').append(button);
}
function openChallengeSelection(){
 clearChallengeInput();challengeRun=null;scene='challenge-select';const d=campaignLevels[(selectedLevel||1)-1];document.querySelector('#challenge-select .ch-eyebrow').textContent='CHALLENGE · LEVEL '+String(selectedLevel||1).padStart(2,'0');document.querySelector('#challenge-select .ch-description').textContent=d.name+' — '+d.lesson;document.querySelector('#challenge-select h2').textContent='Choose your operative';levels.hidden=true;modes.hidden=true;versus.hidden=true;maps.hidden=true;
 challengeRoot.hidden=false;chSelect.hidden=false;chPlay.hidden=true;chOverlay.hidden=true;
 document.querySelector(challengeChoice?`.ch-animal[data-animal="${challengeChoice}"]`:'.ch-animal').focus();
}
function clearChallengeInput(){chKeys.clear();chPointers.clear();document.querySelectorAll('[data-ch-key]').forEach(b=>b.classList.remove('held'));}
function exitChallenge(){clearChallengeInput();challengeRun=null;challengeRoot.hidden=true;refreshChallengeStars();openLevels();}
function beginChallenge(){
 if(!challengeChoice)return;const level=selectedLevel||1;if(level>unlockedChallenge())return;
 clearChallengeInput();const course=createCampaignCourse(level);chPlatforms=course.platforms;chLadders=course.ladders;chCoinPlaces=course.coins;
 const p=newFighter(challengeChoice,course.spawn.x,'player');Object.assign(p,{y:course.bottom,vx:0,vy:0,grounded:true,climbing:false,hideLabel:true,coyote:0,jumpBuffer:0,attackCD:0});
 challengeRun={p,course,camera:course.bottom-250,time:0,hearts:3,falls:0,hits:0,wrong:0,coins:course.coins.map(([x,y])=>({x,y,taken:false})),checkpoint:{...course.spawn},highest:course.bottom,paused:false,ended:false,quiz:null,won:false,projectiles:[],invincible:0,message:course.def.lesson,messageUntil:8};
 document.querySelector('.ch-hud small').textContent='CHALLENGE '+String(level).padStart(2,'0');document.querySelector('.ch-hud strong').textContent=course.def.name.toUpperCase();document.querySelector('.ch-result-card .ch-eyebrow').textContent=course.def.name;
 chSelect.hidden=true;chPlay.hidden=false;chOverlay.hidden=true;document.querySelector('#ch-quiz').hidden=true;scene='challenge';document.querySelector('#ch-pause').focus();updateChallengeHUD();
}
window.addEventListener('fightcute:level-selected',e=>{if(e.detail.level<=unlockedChallenge())openChallengeSelection();});
document.querySelector('#ch-select-back').onclick=exitChallenge;
document.querySelector('#ch-confirm').onclick=beginChallenge;
document.querySelector('#ch-retry').onclick=beginChallenge;
document.querySelector('#ch-repick').onclick=openChallengeSelection;
document.querySelector('#ch-exit').onclick=exitChallenge;
document.querySelector('#ch-resume').onclick=()=>{challengeRun.paused=false;chOverlay.hidden=true;document.querySelector('#ch-pause').focus();};
function challengeDialog(title,text,finished,stars=0){
 clearChallengeInput();chOverlay.hidden=false;document.querySelector('#ch-result-title').textContent=title;document.querySelector('#ch-result-text').textContent=text;
 document.querySelector('#ch-earned').textContent=finished&&challengeRun.hearts>0?'★'.repeat(stars)+'☆'.repeat(3-stars):'';
 document.querySelector('#ch-resume').hidden=finished;document.querySelector('#ch-retry').hidden=!finished;document.querySelector('#ch-next').hidden=!(finished&&challengeRun.won&&challengeRun.course.level<10);
 document.querySelector(finished?'#ch-retry':'#ch-resume').focus();
}
function pauseChallenge(){if(!challengeRun||challengeRun.ended||challengeRun.paused||challengeRun.quiz)return;challengeRun.paused=true;challengeDialog('MISSION PAUSED','Your explorer will wait right here.',false);}
document.querySelector('#ch-pause').onclick=pauseChallenge;
function finishChallenge(){
 const c=challengeRun;if(c.ended)return;
 const pending=c.course.gates.find(q=>!q.solved);if(pending){c.message='Collect the glowing keys at every gate before the finish.';c.messageUntil=c.time+3;return;}
 c.ended=true;c.won=true;const coins=c.coins.filter(q=>q.taken).length,stars=1+(coins>=Math.ceil(c.coins.length*.8)?1:0)+(c.hits===0&&c.wrong===0?1:0);
 campaignStars[c.course.level-1]=Math.max(campaignStars[c.course.level-1],stars);try{localStorage.setItem('fight-cute-campaign-v1',JSON.stringify(campaignStars));localStorage.setItem('fight-cute-challenge-1-stars',String(campaignStars[0]));}catch{}
 refreshChallengeStars();challengeDialog(c.course.level===10?'TEN WORLDS, ONE BRAVE HEART!':'ADVENTURE COMPLETE!',`${coins}/${c.coins.length} coins · ${Math.floor(c.time)} seconds · ${c.hits} hits · ${c.wrong} puzzle assists. Stars: finish, collect 80% of coins, and take no hits or puzzle assists.`,true,stars);
}
function challengeFall(){challengeDamage(true);}
function challengeDamage(fall=false){
 const c=challengeRun;if(!c||c.ended||c.quiz||(!fall&&c.invincible>0))return;
 c.hearts--;c.hits++;if(fall)c.falls++;clearChallengeInput();
 if(c.hearts<=0){c.ended=true;challengeDialog('A brave try!','Try again from the start, or choose another explorer. Your best stars are safe.',true);return;}
 Object.assign(c.p,{x:c.checkpoint.x,y:c.checkpoint.y,vx:0,vy:0,grounded:true,climbing:false,attackCD:0});c.camera=clamp(c.p.y-215,c.course.top-140,c.course.bottom-250);c.invincible=2;
 c.message='Safe at your checkpoint · Look ahead before the next jump.';c.messageUntil=c.time+3;
}
function challengeJump(){const c=challengeRun;if(scene!=='challenge'||!c||c.paused||c.ended||c.quiz)return;c.p.jumpBuffer=.14;}
document.querySelector('#ch-jump').addEventListener('pointerdown',e=>{e.preventDefault();challengeJump();});
document.querySelector('#ch-jump').addEventListener('click',e=>{if(e.detail===0)challengeJump();});
const chKeyMap={a:'left',d:'right',w:'up',s:'down',ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
addEventListener('keydown',e=>{
 if(scene!=='challenge')return;
 if(challengeRun.quiz)return;
 if(e.key==='Escape'){e.preventDefault();if(challengeRun.paused&&!challengeRun.ended)document.querySelector('#ch-resume').click();else pauseChallenge();return;}
 if(!chOverlay.hidden){if(e.key==='Tab'){const bs=[...chOverlay.querySelectorAll('button')].filter(b=>!b.hidden);if(e.shiftKey&&document.activeElement===bs[0]){e.preventDefault();bs.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===bs.at(-1)){e.preventDefault();bs[0].focus();}}return;}
 if(e.key.toLowerCase()==='j'&&!e.repeat)challengeAttack();if(e.key.toLowerCase()==='e'&&!e.repeat)challengeInteract();
 if(chKeyMap[e.key]){e.preventDefault();chKeys.add(chKeyMap[e.key]);}if(e.code==='Space'){e.preventDefault();if(!e.repeat)challengeJump();}
});
addEventListener('keyup',e=>chKeys.delete(chKeyMap[e.key]));
for(const b of document.querySelectorAll('[data-ch-key]')){
 b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);chPointers.set(e.pointerId,b.dataset.chKey);b.classList.add('held');});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>{chPointers.delete(e.pointerId);b.classList.remove('held');});
}
addEventListener('blur',()=>{clearChallengeInput();if(scene==='challenge')pauseChallenge();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&scene==='challenge')pauseChallenge();});
function chHeld(key){return chKeys.has(key)||[...chPointers.values()].includes(key);}
function updateChallenge(dt){
 const c=challengeRun;if(!c||c.paused||c.ended||c.quiz)return;c.time+=dt;c.invincible=Math.max(0,c.invincible-dt);const p=c.p;
 p.land=Math.max(0,(p.land||0)-dt);p.cheer=Math.max(0,(p.cheer||0)-dt);p.detach=Math.max(0,(p.detach||0)-dt);p.attackCD=Math.max(0,p.attackCD-dt);p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);
 if(p.action){p.action.t+=dt;if(p.action.t>p.action.duration)p.action=null;}
 for(const f of chPlatforms){const old=f.x;f.x=f.baseX+(f.move?Math.sin(c.time*(.7+c.course.level*.03)+f.index)*f.move:0);if(p.grounded&&p.standing===f.index)p.x+=f.x-old;if(f.absent>0){f.absent-=dt;if(f.absent<=0)f.age=0;}else if(f.crumble&&f.age>0){f.age+=dt;if(f.age>1.05){f.absent=2.8;f.age=0;}}}
 const dx=Number(chHeld('right'))-Number(chHeld('left')),dy=Number(chHeld('down'))-Number(chHeld('up'));
 tickExpeditionDash(c,dt);
 const desired=dx*190;p.vx+=clamp(desired-p.vx,-1400*dt,1400*dt);if(dx)p.face=dx;
 p.coyote=p.grounded?.11:Math.max(0,p.coyote-dt);
 if(p.jumpBuffer>0&&(p.grounded||p.climbing||p.coyote>0)){p.vy=-325;p.grounded=false;p.climbing=false;p.detach=.22;p.coyote=0;p.jumpBuffer=0;}
 const ladder=chLadders.find(l=>Math.abs(p.x-l.x)<18&&p.y>=l.top-3&&p.y<=l.bottom+3);
 if(ladder&&dy&&p.detach===0){p.climbing=true;p.grounded=false;p.x=ladder.x;p.vy=0;}
 if(p.dash>0)p.vx=p.face*360;
 if(p.climbing){if(!ladder||dx){p.climbing=false;p.vy=0;}else{p.y+=(ladder.reverse?Math.abs(dy):dy)*132*dt;p.vx=0;if(p.y<=ladder.top){p.y=ladder.top;p.climbing=false;p.grounded=true;}if(p.y>=ladder.bottom){p.y=ladder.bottom;p.climbing=false;p.grounded=true;}}}
 const previous=p.y;
 if(!p.climbing){const gust=c.course.level>=9&&!p.grounded?Math.sin(c.time*.8)*13:0;p.x=clamp(p.x+(p.vx+gust)*dt,12,628);p.vy+=c.course.gravity*dt;p.y+=p.vy*dt;p.grounded=false;p.standing=null;
  if(p.vy>=0)for(const f of chPlatforms){if(f.absent>0||f.illusion)continue;if(p.x>f.x-5&&p.x<f.x+f.w+5&&previous<=f.y+1&&p.y>=f.y){if(p.vy>120)p.land=.16;p.y=f.y;p.vy=0;p.grounded=true;p.standing=f.index;if(f.crumble&&!f.age)f.age=.001;break;}}
 }
 if(p.grounded){const f=chPlatforms[p.standing];if(f?.checkpoint&&f.y<c.highest){c.highest=f.y;c.checkpoint={x:f.x+f.w/2,y:f.y};c.message='CHECKPOINT · Your next safe place is saved.';c.messageUntil=c.time+3;}}
 for(const coin of c.coins)if(!coin.taken&&Math.hypot(p.x-coin.x,p.y-22-coin.y)<28){coin.taken=true;p.cheer=.65;}
 for(const e of c.course.enemies){if(e.dead)continue;const f=chPlatforms[e.platform];if(f.absent>0)continue;e.x+=e.dir*e.speed*dt;if(e.x<f.x+13){e.x=f.x+13;e.dir=1;}if(e.x>f.x+f.w-13){e.x=f.x+f.w-13;e.dir=-1;}e.y=f.y-10-(e.kind==='flyer'?24+Math.sin(c.time*2+e.platform)*10:0);
  if(e.kind==='sentry'){e.fire-=dt;if(e.fire<=0){e.fire=Math.max(1.8,3.2-c.course.level*.1);c.projectiles.push({x:e.x,y:e.y-8,vx:Math.sign(p.x-e.x||1)*94,life:3});}}
  if(Math.abs(p.x-e.x)<24&&Math.abs(p.y-20-e.y)<28){if(p.vy>20&&previous<e.y+4){e.dead=true;p.vy=-230;p.cheer=.5;}else {challengeDamage();return;}}
 }
 for(const q of c.projectiles){q.x+=q.vx*dt;q.life-=dt;if(Math.hypot(q.x-p.x,q.y-(p.y-24))<18){q.life=0;challengeDamage();return;}}c.projectiles=c.projectiles.filter(q=>q.life>0);
 if(c.course.spikes.some(q=>Math.abs(p.x-q.x)<14&&Math.abs(p.y-q.y)<10)){challengeDamage();return;}
 if(p.y>c.course.bottom+70||p.y>c.camera+425){challengeFall();return;}
 const target=clamp(p.y-215,c.course.top-140,c.course.bottom-250);c.camera+=(target-c.camera)*Math.min(1,dt*6);
 const gate=c.course.gates.find(q=>!q.solved&&p.grounded&&Math.abs(q.y-p.y)<2&&Math.abs(q.x-p.x)<29);if(gate){openChallengeQuiz(gate);return;}
 if(p.grounded&&Math.abs(p.y-c.course.goal.y)<1&&Math.abs(p.x-c.course.goal.x)<30)finishChallenge();
}
function updateChallengeHUD(){
 const c=challengeRun;if(!c)return;document.querySelector('#ch-hearts').textContent='♥ '.repeat(c.hearts)+'♡ '.repeat(3-c.hearts);document.querySelector('#ch-coins').textContent='✦ '+c.coins.filter(q=>q.taken).length+' / '+c.coins.length;document.querySelector('#ch-clock').textContent=Math.floor(c.time/60)+':'+String(Math.floor(c.time%60)).padStart(2,'0');document.querySelector('#ch-tip').textContent=c.time<c.messageUntil?c.message:'Blue = moving · Cracked = crumbling · J to bop · Collect 3 keys at each gate';
 const solved=c.course.gates.filter(q=>q.solved).length;document.querySelector('#ch-objective').textContent=`GATES ${solved}/${c.course.gates.length}`;document.querySelector('#ch-progress-fill').style.height=clamp((c.course.bottom-c.p.y)/(c.course.bottom-c.course.top)*100,0,100)+'%';
}
function challengeAttack(){const c=challengeRun;if(!c||c.paused||c.ended||c.quiz||c.p.attackCD>0)return;const p=c.p;p.attackCD=.42;p.action={type:'attack',duration:.3,windup:.07,t:.07,range:55};for(const e of c.course.enemies)if(!e.dead&&Math.abs(e.x-p.x)<58&&(e.x-p.x)*p.face>=-12&&Math.abs(e.y-(p.y-24))<48){e.dead=true;p.cheer=.6;}for(const q of c.projectiles)if(Math.hypot(q.x-p.x,q.y-(p.y-24))<60)q.life=0;}
function challengeInteract(){const c=challengeRun;if(!c||c.paused||c.ended||c.quiz)return;const gate=c.course.gates.find(q=>!q.solved&&Math.abs(q.y-c.p.y)<8&&Math.abs(q.x-c.p.x)<55);if(gate)openChallengeQuiz(gate);}
function drawChallenge(){
 const c=challengeRun,g=chG,t=motion.matches?0:c.time;g.imageSmoothingEnabled=false;
 const sky=g.createLinearGradient(0,0,0,360);sky.addColorStop(0,c.course.def.colors[0]);sky.addColorStop(1,c.course.def.colors[1]);g.fillStyle=sky;g.fillRect(0,0,640,360);
 drawCampaignBackdrop(g,c,t);
 function cloud(x,y,size,pink=false){g.fillStyle=pink?'#edc7df':'#e6e8fa';g.beginPath();g.ellipse(x,y,size, size*.27,0,0,7);g.fill();g.fillStyle=pink?'#fff1f2':'#f9f4ff';for(let i=0;i<3;i++){g.beginPath();g.ellipse(x+(i-1)*size*.38,y-size*.17,size*.35,size*(i===1?.38:.25),0,0,7);g.fill();}}
 for(let i=0;i<11;i++){const x=((i*137+t*(2+i%3))%800)-80,y=((i*71-c.camera*.24)%430+430)%430-30;cloud(x,y,27+i%4*13,i%4===0);}
 for(let i=0;i<45;i++){const x=i*83%640,y=((i*47-c.camera*.13)%360+360)%360;g.fillStyle=i%3?'#fff4ecaa':'#ffe49a';g.fillRect(x,y,2,2);if(i%6===0){g.fillRect(x-2,y+1,6,1);g.fillRect(x+1,y-2,1,6);}}
 g.save();g.translate(0,-c.camera);
 // Wooden ladders, with offset shadow and individual rungs.
 for(const l of chLadders){g.fillStyle='#765b7a';g.fillRect(l.x-13,l.top,5,l.bottom-l.top);g.fillRect(l.x+12,l.top,5,l.bottom-l.top);g.fillStyle='#dba97e';g.fillRect(l.x-15,l.top,5,l.bottom-l.top);g.fillRect(l.x+10,l.top,5,l.bottom-l.top);for(let y=l.top+9;y<l.bottom;y+=14){g.fillStyle='#816275';g.fillRect(l.x-10,y+3,20,4);g.fillStyle='#f1c79b';g.fillRect(l.x-10,y,20,4);}}
 for(const [i,f] of chPlatforms.entries()){if(f.absent>0)continue;
  if(f.type==='donut'){const steel=g.createLinearGradient(0,f.y,0,f.y+19);steel.addColorStop(0,f.crumble?'#aa9982':f.move?'#6da4b2':'#607d91');steel.addColorStop(1,'#283c53');g.fillStyle=steel;g.fillRect(f.x,f.y,f.w,18);g.fillStyle=f.crumble?'#e0ad79':f.move?'#9decdc':'#b6cbd4';g.fillRect(f.x,f.y-2,f.w,3);g.fillStyle='#2d4559';for(let x=f.x+8;x<f.x+f.w-5;x+=18)g.fillRect(x,f.y+8,8,4);if(f.crumble){g.strokeStyle='#4c3b3f';g.beginPath();g.moveTo(f.x+f.w*.45,f.y);g.lineTo(f.x+f.w*.53,f.y+8);g.lineTo(f.x+f.w*.48,f.y+16);g.stroke();}}

  else{g.fillStyle='#886982';g.fillRect(f.x+5,f.y+7,f.w-10,20);g.fillStyle='#c39687';g.fillRect(f.x,f.y+5,f.w,15);for(let j=0;j<f.w/18;j++){g.fillStyle=j%2?'#e1b096':'#b7847c';g.fillRect(f.x+j*18+3,f.y+12,12,8);}g.fillStyle=f.type==='grass'?'#7aa590':'#d188ac';g.fillRect(f.x-2,f.y,f.w+4,9);g.fillStyle=c.course.def.colors[2];g.fillRect(f.x-2,f.y-2,f.w+4,6);for(let j=0;j<f.w/16;j++)g.fillRect(f.x+j*16,f.y+3,8,5);
   // Expedition beacon replaces candy props.
   g.fillStyle='#314c62';g.fillRect(f.x+15,f.y-25,7,25);g.fillStyle='#7699a6';g.fillRect(f.x+16,f.y-25,2,25);g.fillStyle='#8be3cd';g.fillRect(f.x+12,f.y-29,13,6);g.globalAlpha=.12;g.fillRect(f.x+8,f.y-35,21,19);g.globalAlpha=1;

  }
 }
 for(const coin of c.coins)if(!coin.taken){const y=coin.y+Math.sin(t*3+coin.x)*2,w=motion.matches?7:3+Math.abs(Math.cos(t*2+coin.x))*4;g.fillStyle='#c38b41';g.beginPath();g.ellipse(coin.x,y,w+1,10,0,0,7);g.fill();g.fillStyle='#ffe39b';g.beginPath();g.ellipse(coin.x-1,y-1,w,8,0,0,7);g.fill();g.fillStyle='#cc963d';g.font='bold 10px monospace';g.textAlign='center';g.fillText('★',coin.x,y+3);}
 const goal=c.course.goal;g.fillStyle='#fff3dd';g.fillRect(goal.x-3,goal.y-58,3,58);g.fillStyle=c.course.gates.every(q=>q.solved)?'#81c9b0':'#b39dc4';g.beginPath();g.moveTo(goal.x,goal.y-57);g.lineTo(goal.x+36,goal.y-49+Math.sin(t*4)*2);g.lineTo(goal.x,goal.y-35);g.fill();g.fillStyle='#fff9df';g.font='bold 10px monospace';g.textAlign='center';g.fillText(c.course.level===10?'PALACE':'FINISH',goal.x,goal.y-70);
 drawCampaignObstacles(g,c,t);
 // Reuse the game's articulated animal rig, at platformer scale.
 const p=c.p;g.save();g.translate(p.x,p.y);g.scale(.68,.68);g.translate(0,-groundY);if(c.invincible>0)g.globalAlpha=.5+.5*Math.sin(c.time*20)**2;
 drawFighter(g,{...p,x:0,y:groundY,vx:p.climbing?45:p.vx,guard:false,action:p.action,climbing:p.climbing,hideLabel:true,airborne:!p.grounded&&!p.climbing},t);g.restore();
 if(p.cheer>0&&!motion.matches){g.fillStyle='#fff1b4';for(let i=0;i<3;i++){const x=p.x-21+i*21,y=p.y-72-(.65-p.cheer)*16;g.fillRect(x-2,y,5,1);g.fillRect(x,y-2,1,5);}}
 if(p.climbing){g.fillStyle='#fff2d5aa';g.fillRect(p.x-17,p.y-15,2,2);}
 g.restore();
}
function drawChallengePortraits(now){
 for(const button of document.querySelectorAll('.ch-animal')){
  const portrait=button.querySelector('canvas'),g=portrait.getContext('2d');
  g.clearRect(0,0,160,170);g.save();g.translate(80,151-groundY);
  const f=newFighter(button.dataset.animal,0,'player');f.hideLabel=true;
  drawFighter(g,f,motion.matches?0:now/1000);g.restore();
 }
}
function challengeFrame(now){if(scene==='challenge-select')drawChallengePortraits(now);const dt=Math.min(.025,(now-chLast)/1000||.016);chLast=now;if(scene==='challenge'&&challengeRun){updateChallenge(dt);drawChallenge();updateChallengeHUD();}requestAnimationFrame(challengeFrame);}
requestAnimationFrame(challengeFrame);
// Wisdom gates freeze simulation; mistakes offer a hint, not lost health.
chPlay.insertAdjacentHTML('beforeend',`<div id="ch-quiz" role="dialog" aria-modal="true" aria-labelledby="ch-question" hidden><div class="ch-quiz-card"><span class="quiz-badge">✦ RELAY TERMINAL ✦</span><h2 id="ch-question"></h2><p>Solve the system. Movement pauses while the terminal is open.</p><div id="ch-answers"></div><p id="ch-feedback" role="status"></p><button class="ch-primary" id="ch-quiz-continue" hidden>GATE OPEN · CONTINUE</button><button class="ch-small" id="ch-quiz-exit">RETURN TO TRAIL</button></div></div><div id="ch-height"><span>⚑</span><div><i id="ch-progress-fill"></i></div><small>↑</small></div>`);
document.querySelector('.ch-counters').insertAdjacentHTML('beforeend','<small id="ch-objective"></small>');
document.querySelector('.ch-touch').insertAdjacentHTML('beforeend','<button id="ch-bop" class="ch-small">BOP <small>J</small></button><button id="ch-use" class="ch-small">HINT <small>E</small></button>');
document.querySelector('#ch-retry').insertAdjacentHTML('afterend','<button id="ch-next" class="ch-primary" hidden>NEXT ADVENTURE →</button>');
document.querySelector('#ch-next').onclick=()=>{selectedLevel=Math.min(10,challengeRun.course.level+1);beginChallenge();};
document.querySelector('#ch-bop').onclick=challengeAttack;document.querySelector('#ch-use').onclick=challengeInteract;
document.querySelector('.ch-key-help').textContent='A / D MOVE · W / S CLIMB · SPACE JUMP · J BOP · E HINT · ESC PAUSE';
document.querySelector('#ch-quiz-exit').onclick=()=>{document.querySelector('#ch-quiz').hidden=true;exitChallenge();};
function openChallengeQuiz(gate){const c=challengeRun;if(!c||gate.solved)return;c.message='Walk through the 3 glowing keys on this platform to open the gate.';c.messageUntil=c.time+2;}
document.querySelector('#ch-quiz-continue').onclick=()=>{challengeRun.quiz=null;clearChallengeInput();document.querySelector('#ch-quiz').hidden=true;document.querySelector('#ch-pause').focus();};
document.querySelector('#ch-quiz').addEventListener('keydown',e=>{if(e.key!=='Tab')return;const buttons=[...e.currentTarget.querySelectorAll('button')].filter(b=>!b.hidden&&!b.disabled);if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus();}});
function drawCampaignBackdrop(g,c,t){
 const type=c.course.def.motif;g.save();g.globalAlpha=.25;
 if(['city','college','library','palace'].includes(type)){
  for(let i=0;i<10;i++){const x=i*73-25,h=70+(i*37%95),y=365-h;g.fillStyle='#564970';g.fillRect(x,y,53,h);if(type==='palace'){g.beginPath();g.moveTo(x-6,y);g.lineTo(x+27,y-36);g.lineTo(x+59,y);g.fill();}for(let j=0;j<4;j++){g.fillStyle=c.course.def.colors[2];g.fillRect(x+9+(j%2)*22,y+14+Math.floor(j/2)*26,9,12);}}
 }else if(type==='forest'||type==='sakura'){for(let i=0;i<8;i++){const x=i*93;g.fillStyle='#6b7779';g.fillRect(x,250,9,110);g.fillStyle=type==='forest'?'#539b8c':'#ffc5de';g.beginPath();g.arc(x+4,260,40,0,7);g.fill();}}
 else if(type==='moon'){g.fillStyle='#fff2d8';g.beginPath();g.arc(505,95,49,0,7);g.fill();g.fillStyle='#918abc';g.beginPath();g.arc(525,86,42,0,7);g.fill();}
 else if(type==='sea'){for(let i=0;i<7;i++){g.strokeStyle='#fff6d7';g.lineWidth=3;g.beginPath();for(let x=0;x<=640;x+=8){const y=280+i*14+Math.sin(x*.035+t+i)*4;x?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}}
 else if(type==='snow'){for(let i=0;i<5;i++){g.fillStyle='#f7f4ff';g.beginPath();g.moveTo(i*170-50,360);g.lineTo(i*170+40,175);g.lineTo(i*170+160,360);g.fill();}}
 g.restore();
 if(['snow','sakura','college'].includes(type)){g.fillStyle=type==='sakura'?'#ffd4e9':'#ffffff99';for(let i=0;i<22;i++){const x=(i*71+t*12)%650,y=(i*43+t*16)%360;g.fillRect(x,y,2,3);}}
}
function drawCampaignObstacles(g,c,t){
 for(const f of chPlatforms){if(f.absent>0)continue;if(f.crumble){g.strokeStyle='#775d75';g.lineWidth=1;g.beginPath();g.moveTo(f.x+f.w*.4,f.y);g.lineTo(f.x+f.w*.5,f.y+4);g.lineTo(f.x+f.w*.46,f.y+9);g.stroke();}if(f.move){g.fillStyle='#e5fbff';g.font='9px monospace';g.textAlign='center';g.fillText('↔',f.x+f.w/2,f.y+7);}}
 for(const q of c.course.spikes){g.fillStyle='#d3849f';g.beginPath();g.moveTo(q.x-10,q.y);g.lineTo(q.x-4,q.y-13);g.lineTo(q.x+1,q.y-3);g.lineTo(q.x+7,q.y-13);g.lineTo(q.x+13,q.y);g.fill();}
 for(const gate of c.course.gates){g.fillStyle=gate.solved?'#7abca4':'#9276be';g.fillRect(gate.x-10,gate.y-43,20,39);g.fillStyle=gate.solved?'#ccf6d9':'#ffe5a6';g.fillRect(gate.x-8,gate.y-41,16,28);g.fillStyle='#695080';g.font='bold 17px monospace';g.textAlign='center';g.fillText(gate.solved?'✓':'?',gate.x,gate.y-21);}
 for(const e of c.course.enemies){if(e.dead||chPlatforms[e.platform].absent>0)continue;g.save();g.translate(e.x,e.y);if(e.kind==='flyer'){g.fillStyle='#eedaff';for(const side of [-1,1]){g.beginPath();g.ellipse(side*13,-6+Math.sin(t*12)*3,9,4,side*.4,0,7);g.fill();}}g.fillStyle=e.kind==='sentry'?'#a5a7c7':e.kind==='flyer'?'#bb9bd3':'#edaabd';g.beginPath();g.ellipse(0,0,13,e.kind==='sentry'?14:10+Math.sin(t*4)*1,0,0,7);g.fill();g.fillStyle='#544960';g.fillRect(-6,-4,2,3);g.fillRect(4,-4,2,3);g.fillRect(-2,3,4,1);if(e.kind==='sentry'){g.fillStyle=e.fire<.65?'#fff3a0':'#7b779b';g.beginPath();g.arc(0,-15,e.fire<.65?5:3,0,7);g.fill();}g.restore();}
 for(const q of c.projectiles){if(q.life<=0)continue;g.fillStyle='#ffe5a0';g.fillRect(q.x-4,q.y-2,8,4);g.fillRect(q.x-2,q.y-4,4,8);}
}
