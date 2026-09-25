// Fight Cute — combat.js
// Seven reusable arena definitions; challenge levels can reference these map IDs later.
const arenaDefinitions={
 1:{name:'Palm Beach',floor:'#d9bd93',edge:'#f5dfb7',line:'#b79877',ambient:'#f8d69b',weather:'sea',gravity:580},
 2:{name:'Sakura Katana',floor:'#a497a2',edge:'#e1c9c9',line:'#786d81',ambient:'#f3b8d3',weather:'petals',gravity:620},
 3:{name:'China Neon City',floor:'#45445e',edge:'#8d9aaa',line:'#72627e',ambient:'#d18fd9',weather:'rain',gravity:620},
 4:{name:'Sky Kingdom',floor:'#d3d3df',edge:'#fff0d5',line:'#a4a1bc',ambient:'#ecedff',weather:'clouds',gravity:510},
 5:{name:'Moonlight',floor:'#9291ab',edge:'#cbc4db',line:'#717187',ambient:'#c0bada',weather:'stars',gravity:300},
 6:{name:'Cozy Library',floor:'#967457',edge:'#c69d6f',line:'#694f49',ambient:'#ffd28c',weather:'dust',gravity:620},
 7:{name:'College Campus',floor:'#b2a897',edge:'#dbd2b9',line:'#898477',ambient:'#cbd4ab',weather:'leaves',gravity:620}
};
const battle=document.querySelector('#battle'),arenaCanvas=document.querySelector('#arena-canvas'),arenaCtx=arenaCanvas.getContext('2d');
const battleOverlay=document.querySelector('#battle-overlay'),arenaKeys=new Set();
let match=null,matchLoad=0,joystickX=0,stickPointer=null,guardTouch=false,lastBattleFrame=0;
const groundY=278,arenaCache=new Map(),spriteCache=new Map();
const moveStats={'1':{speed:158,skill:'Bunny Rush',range:90},'2':{speed:150,skill:'Quick Claw',range:78},'3':{speed:98,skill:'Cozy Stomp',range:110},'4':{speed:130,skill:'Paw Combo',range:90},'5':{speed:156,skill:'Tail Whirl',range:110},'6':{speed:137,skill:'Sky Swoop',range:132},'7':{speed:117,skill:'Quill Roll',range:105}};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function resolvedFighter(side){return fighters[side]==='random'?randomResolved[side]:fighters[side];}
function newFighter(id,x,side){return{id,x,y:groundY,vx:0,vy:0,face:side==='player'?1:-1,side,hp:animals[id].hp,maxHP:animals[id].hp,energy:0,guard:false,action:null,cooldown:0,skillCD:0,stun:0,invulnerable:0,combo:0,lastHit:-10,steps:0};}
async function spriteImage(id){if(spriteCache.has(id))return spriteCache.get(id);const img=new Image();let svg=animalSVG(id,false).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replace('>'+'' ,'><style>.eyes-happy,.effects{display:none}</style>');img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await img.decode();spriteCache.set(id,img);return img;}
async function arenaImage(id){if(arenaCache.has(id))return arenaCache.get(id);const src=document.querySelector('.map-card[data-map="'+id+'"] img');await src.decode();const c=document.createElement('canvas');c.width=480;c.height=270;const g=c.getContext('2d');g.filter='saturate(.85) contrast(.93) brightness(1.04)';g.drawImage(src,0,0,480,270);arenaCache.set(id,c);return c;}
async function beginMatch(mapId=selectedMap){
 const run=++matchLoad,expectedLoading=scene==='loading'?loadingRun:null;const pId=resolvedFighter('player'),nId=resolvedFighter('npc');
 const [bg,pSprite,nSprite]=await Promise.all([arenaImage(mapId),spriteImage(pId),spriteImage(nId)]);if(run!==matchLoad||(expectedLoading!==null&&(scene!=='loading'||loadingRun!==expectedLoading)))return;
 loadingScreen.hidden=true;maps.hidden=true;versus.hidden=true;battle.hidden=false;scene='battle';battleOverlay.hidden=true;resetArenaInput();
 match={map:mapId,def:arenaDefinitions[mapId],bg,sprites:{[pId]:pSprite,[nId]:nSprite},player:newFighter(pId,205,'player'),npc:newFighter(nId,435,'npc'),time:90,elapsed:0,countdown:1.8,paused:false,ended:false,particles:[],numbers:[],shake:0,aiThink:0,aiGuard:0,toast:'',toastUntil:0,announce:'READY?',announceUntil:1.8,lastHUD:0,hits:0};
 document.querySelector('#battle-player-name').textContent=animals[pId].name;document.querySelector('#battle-npc-name').textContent=animals[nId].name;document.querySelector('#match-map-label').textContent=match.def.name.toUpperCase();document.querySelector('#match-pause').focus();updateBattleHUD();
}
function resetArenaInput(){arenaKeys.clear();joystickX=0;guardTouch=false;stickPointer=null;document.querySelector('#joystick-thumb').style.transform='translate(0,0)';document.querySelector('#guard-btn').classList.remove('held');if(match){match.player.vx=0;match.player.guard=false;}}
function toastBattle(text){if(!match)return;match.toast=text;match.toastUntil=match.elapsed+1.6;}
function battleJump(f){if(!match||match.paused||match.ended||match.countdown>0||f.y<groundY-1||f.stun>0)return;f.vy=match.map===5?-215:-246;f.guard=false;particles(f.x,f.y,7,'#fff3d5',.6);}
function doMove(f,type){
 if(!match||match.paused||match.ended||match.countdown>0||f.cooldown>0||f.stun>0||f.action)return;
 if(type==='skill'&&(f.energy<20||f.skillCD>0)){if(f.side==='player')toastBattle(f.energy<20?'Skill needs 20 energy':'Skill is recharging');return;}
 if(type==='ultimate'&&f.energy<100){if(f.side==='player')toastBattle('Fill your energy bar for Ultimate');return;}
 const spec={attack:{duration:.37,windup:.12,damage:1,range:58},heavy:{duration:.68,windup:.27,damage:1.7,range:71},skill:{duration:.72,windup:.24,damage:1.85,range:moveStats[f.id].range},ultimate:{duration:1.08,windup:.42,damage:3.4,range:155}}[type];
 f.swing=(f.swing||0)+1;f.guard=false;f.action={...spec,type,t:0,hit:false,kick:f.swing%2===0};f.cooldown=spec.duration+.08;f.energy=clamp(f.energy+(type==='attack'?2:0)-(type==='skill'?20:type==='ultimate'?100:0),0,100);
 if(type==='skill'){f.skillCD=3.5;if(f.id==='6'&&f.y>=groundY-1)f.vy=-190;if(f.side==='player')toastBattle(moveStats[f.id].skill);}
 if(type==='ultimate'){match.announce='CUTE BURST!';match.announceUntil=match.elapsed+1.1;particles(f.x,f.y-35,28,'#fff0ab',1.2);}
}
function particles(x,y,count,color,power=1){for(let i=0;i<count;i++){const angle=Math.random()*Math.PI*2,speed=(20+Math.random()*70)*power;match.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-20,life:.35+Math.random()*.45,max:.8,color,size:1+Math.random()*2});}}
function landHit(attacker,defender){
 const a=attacker.action;if(Math.abs(attacker.x-defender.x)>a.range||Math.abs(attacker.y-defender.y)>62||defender.invulnerable>0||(defender.x-attacker.x)*attacker.face<-10)return;
 const blocked=defender.guard&&defender.face*(attacker.x-defender.x)>0&&defender.y>=groundY-1;
 let damage=Math.round((5+animals[attacker.id].attack*.085)*a.damage*(1-animals[defender.id].def/220)*(blocked?.24:1));damage=Math.max(1,damage);
 defender.hp=Math.max(0,defender.hp-damage);defender.energy=clamp(defender.energy+(blocked?9:8),0,100);attacker.energy=clamp(attacker.energy+(blocked?6:12),0,100);defender.invulnerable=.22;
 if(!blocked){defender.stun=.17;defender.guard=false;defender.vx=attacker.face*(a.type==='heavy'?110:65);match.shake=motion.matches?0:(a.type==='ultimate'?5:2);}
 attacker.combo=match.elapsed-attacker.lastHit<1.3?attacker.combo+1:1;attacker.lastHit=match.elapsed;
 particles((attacker.x+defender.x)/2,defender.y-36,blocked?7:13,blocked?'#bce5ee':'#ffdbaf',a.type==='ultimate'?1.6:1);
 match.numbers.push({x:defender.x,y:defender.y-73,text:blocked?'GUARD':'−'+damage,life:.85,color:blocked?'#d4efff':'#fff0c6'});match.hits++;match.hitStop=motion.matches?0:(a.type==='heavy'?.065:.04);
 if(attacker.side==='player'&&attacker.combo>=2)toastBattle(attacker.combo+' HIT COMBO!');
 if(defender.hp<=0)endBattle(defender.side==='npc'?'PLAYER WINS!':'NPC WINS!');
}
function updateFighter(f,other,dt){
 f.land=Math.max(0,(f.land||0)-dt);
 f.cooldown=Math.max(0,f.cooldown-dt);f.skillCD=Math.max(0,f.skillCD-dt);f.stun=Math.max(0,f.stun-dt);f.invulnerable=Math.max(0,f.invulnerable-dt);
 if(!f.action)f.face=other.x>=f.x?1:-1;
 if(f.action){const a=f.action;a.t+=dt;if(a.type==='skill'&&['1','2','5','7'].includes(f.id)&&a.t<.24)f.x+=f.face*80*dt;if(a.t>=a.windup&&!a.hit){a.hit=true;landHit(f,other);}if(a.t>=a.duration)f.action=null;}
 f.x=clamp(f.x+f.vx*dt,36,604);f.vy+=match.def.gravity*dt;f.y+=f.vy*dt;
 if(f.y>=groundY){if(f.vy>150){f.land=.16;particles(f.x,groundY,5,match.def.edge,.5);}f.y=groundY;f.vy=0;}
 if(Math.abs(f.vx)>40&&f.y===groundY){f.steps+=dt;if(f.steps>.18){f.steps=0;particles(f.x,groundY,2,match.def.edge,.35);}}
}
function thinkNPC(dt){const n=match.npc,p=match.player,dist=Math.abs(p.x-n.x);match.aiThink-=dt;match.aiGuard=Math.max(0,match.aiGuard-dt);
 n.guard=match.aiGuard>0&&!n.action&&n.y>=groundY-1;n.vx=n.stun>0?n.vx*.85:0;
 if(n.stun<=0&&!n.action&&!n.guard&&dist>64)n.vx=Math.sign(p.x-n.x)*moveStats[n.id].speed*.83;
 if(match.aiThink<=0){match.aiThink=.18+Math.random()*.24;if(n.stun>0)return;if(p.action&&dist<100&&Math.random()<.56){match.aiGuard=.45;return;}if(dist<135&&n.energy>=100)doMove(n,'ultimate');else if(dist<moveStats[n.id].range&&n.energy>=20&&n.skillCD===0&&Math.random()<.33)doMove(n,'skill');else if(dist<67)doMove(n,Math.random()<.28?'heavy':'attack');else if(dist>120&&Math.random()<.11)battleJump(n);}
}
function updateMatch(dt){if(!match||match.paused||match.ended)return;if(match.hitStop>0){match.hitStop-=dt;return;}match.elapsed+=dt;
 if(match.countdown>0){match.countdown-=dt;if(match.countdown<=0){match.announce='LET’S PLAY!';match.announceUntil=match.elapsed+.9;}return;}
 match.time=Math.max(0,match.time-dt);if(match.time===0){const p=match.player.hp/match.player.maxHP,n=match.npc.hp/match.npc.maxHP;endBattle(p===n?'DRAW!':p>n?'PLAYER WINS!':'NPC WINS!');return;}
 const p=match.player,n=match.npc;const move=joystickX||(arenaKeys.has('d')||arenaKeys.has('arrowright')?1:0)-(arenaKeys.has('a')||arenaKeys.has('arrowleft')?1:0);
 p.guard=(guardTouch||arenaKeys.has('r'))&&!p.action&&p.y>=groundY-1&&p.stun<=0;
 p.vx=p.stun>0?p.vx*.85:!p.action&&!p.guard?move*moveStats[p.id].speed:0;
 if(arenaKeys.has('j'))doMove(p,'attack');if(arenaKeys.has('k'))doMove(p,'heavy');if(arenaKeys.has('e'))doMove(p,'skill');if(arenaKeys.has('q'))doMove(p,'ultimate');
 thinkNPC(dt);updateFighter(p,n,dt);if(!match.ended)updateFighter(n,p,dt);
 if(Math.abs(p.x-n.x)<31&&Math.abs(p.y-n.y)<45){const m=(p.x+n.x)/2,dir=p.x<n.x?1:-1;p.x=clamp(m-dir*16,36,604);n.x=clamp(m+dir*16,36,604);}
 match.shake=Math.max(0,match.shake-dt*18);for(const q of match.particles){q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=110*dt;}match.particles=match.particles.filter(q=>q.life>0);for(const q of match.numbers){q.life-=dt;q.y-=dt*25;}match.numbers=match.numbers.filter(q=>q.life>0);
}
