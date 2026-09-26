/* Challenge-only deception campaign. Physics and animals remain shared with the game. */
const trollNames=["The Liar's Floor",'Reverse Ladder','The Almost-Key','Mimic Block','Invisible Bridge','The Decoy Checkpoint','Slow-Motion Trap Door','False Safe Zone','Copycat Path','The Fake Boss Gate'];
const trollRecipes=[['liar'],['reverse'],['bait'],['mimic','liar'],['bridge','reverse'],['decoy','mimic'],['sink','liar'],['safe','bait','bridge','mimic','sink','liar'],['copy','decoy','reverse','safe','copy','bridge','mimic','bait'],['liar','reverse','bait','mimic','bridge','decoy','sink','safe','copy','final']];
const trollJokes={liar:'The floor lied to you.',reverse:'Going up? This ladder disagrees.',bait:'Returns are not accepted.',mimic:'That block took it personally.',bridge:'Seeing is not believing.',decoy:'Saved? That flag never said so.',sink:'It was fine. Until it wasn’t.',safe:'Rest in pieces. Briefly.',copy:'Other left. Remember that.',final:'Nice try. Again?',fall:'Skill issue? Or troll issue?'};
let trollRecords={};try{trollRecords=JSON.parse(localStorage.getItem('fight-cute-troll-records-v1')||'{}')||{};}catch{}
// This campaign has its own progress; old adventure medals do not skip its learning curve.
try{const saved=JSON.parse(localStorage.getItem('fight-cute-troll-stars-v1')||'[]');campaignStars=Array.from({length:10},(_,i)=>clamp(Number(saved[i])||0,0,3));}catch{campaignStars=Array(10).fill(0);}
campaignLevels.forEach((d,i)=>{d.name=trollNames[i];d.lesson=i<3?'One trick. Unlimited retries. Trust carefully.':i<7?'Two tricks, one route. Remember what fooled you.':'A chain of deceptions. Your memory is the real upgrade.';});
levels.querySelector('.mode-intro').innerHTML='<strong>TRUST NOTHING</strong><br><span>10 troll trails · Instant retries · Cute world, questionable intentions.</span>';
document.querySelector('#ch-confirm').textContent='PASTI · TRUST NOTHING';
document.querySelector('.ch-fair').textContent='Every animal can finish. Deaths are part of discovering the route.';
document.querySelector('#challenge-canvas').setAttribute('aria-label','Troll challenge platformer');
document.querySelector('#ch-next').textContent='NEXT TRICK →';
refreshChallengeStars();
const trollRefreshStars=refreshChallengeStars;
refreshChallengeStars=function(){trollRefreshStars();document.querySelector('#level-status').textContent=`${campaignStars.filter(Boolean).length} / 10 troll trails cleared · Unlimited retries · Finish to unlock the next.`;};refreshChallengeStars();
createCampaignCourse=function(level){
 const platforms=[],ladders=[],coins=[],modules=[];let y=3000,x=160,dir=1;
 const add=(cx,cy,w=94,extra={})=>{const f={x:cx-w/2,baseX:cx-w/2,y:cy,homeY:cy,w,type:'grass',index:platforms.length,age:0,absent:0,move:0,...extra};platforms.push(f);return f;};
 const start=add(x,y,220,{checkpoint:true});
 const step=(extra={})=>{if(x+dir*95>515||x+dir*95<125)dir=-dir;x+=dir*95;y-=45;const f=add(x,y,94,extra);coins.push([x,y-27]);return f;};
 for(const [mi,type] of trollRecipes[level-1].entries()){
  const m={type,index:mi,platforms:[],closed:false,triggered:false};modules.push(m);
  // Real beacons before most modules keep late routes from becoming full-level restarts.
  // The decoy module deliberately withholds a new save until its alternate flag is found.
  const entry=step({checkpoint:type!=='decoy'});m.entry=entry;
  if(type==='reverse'){
   const low=entry.y,center=x;const a=step(),b=step();m.platforms.push(a,b);
   const top=add(center,low-120,100);ladders.push({x:center,top:top.y,bottom:low,reverse:true});m.ladder=ladders.at(-1);m.platforms.push(top);x=center;y=top.y;
  }else if(type==='copy'){
   // Identical geometry; the dangerous side is stable for the entire level and all retries.
   const center=320;add(center,y,100);if(Math.abs(x-center)>130)add((x+center)/2,y,90);x=center;
   const bad=(level+mi)%2;
   const branches=[add(225,y-45,92,{trap:'copy',bad:bad===0}),add(415,y-45,92,{trap:'copy',bad:bad===1})];
   const merge=add(320,y-90,94);m.platforms.push(...branches,merge);y-=90;x=320;
  }else{
   for(let j=0;j<3;j++){
    const f=step();m.platforms.push(f);
    if(j===1){f.trap=type;m.trap=f;
     if(type==='bridge'){f.invisible=true;const fake=add(f.x+f.w/2-dir*110,f.y-12,94,{illusion:true,trap:'bridge'});m.platforms.push(fake);}
     if(type==='decoy'){f.decoy=true;const real=add(clamp(f.x+f.w/2+dir*110,60,580),f.y+18,74,{checkpoint:true,secret:true});m.real=real;m.platforms.push(real);}
     if(type==='bait'){m.key={x:f.x+f.w/2,y:f.y-27};coins.pop();}
     if(type==='safe')f.w=140;
    }
   }
  }
  m.exit=step();
 }
 const end=step({checkpoint:true});const goal={x:x,y:y};let realGoal=null;
 if(level===10){
  // A side alcove below the advertised exit remains reachable before and after the fake gate.
  const side=x>320?-1:1;add(x+side*85,y+42,78);const hidden=add(x+side*165,y+86,90,{secret:true});realGoal={x:hidden.x+45,y:hidden.y};
 }
 return {def:campaignLevels[level-1],level,platforms,ladders,coins,modules,enemies:[],spikes:[],gates:[],bottom:3000,top:y,spawn:{x:160,y:3000},goal,realGoal,gravity:660,troll:true};
};
const trollBegin=beginChallenge;
beginChallenge=function(){trollBegin();const c=challengeRun;if(!c?.course.troll)return;Object.assign(c,{deaths:0,lastTrap:'fall',fakeVisits:0,respawnSerial:0});c.p.standing=0;};
document.querySelector('#ch-confirm').onclick=beginChallenge;document.querySelector('#ch-retry').onclick=beginChallenge;
function trollMessage(text){challengeRun.message=text;challengeRun.messageUntil=challengeRun.time+3.3;}
function resetTrollObjects(c){for(const f of c.course.platforms){f.y=f.homeY;f.age=0;f.absent=0;f.triggered=false;f.stay=0;}for(const m of c.course.modules){m.triggered=false;/* Collected bait and its gate remain closed; checkpoint moves forward with it. */}c.projectiles=[];}
function trollRespawn(c,checkpoint=c.checkpoint){
 resetTrollObjects(c);clearChallengeInput();Object.assign(c.p,{x:checkpoint.x,y:checkpoint.y,vx:0,vy:0,grounded:true,climbing:false,standing:null,detach:.25,jumpBuffer:0,coyote:0,dash:0,action:null,attackCD:0});
 c.camera=clamp(c.p.y-215,c.course.top-140,c.course.bottom-250);c.invincible=.4;c.respawnSerial++;c.hearts=3;
}
challengeDamage=function(fall=false){const c=challengeRun;if(!c||c.paused||c.ended||c.quiz||(!fall&&c.invincible>0))return;c.deaths++;c.hits++;if(fall)c.falls++;const joke=trollJokes[c.lastTrap]||trollJokes.fall;trollRespawn(c);trollMessage(joke+'  ·  Deaths: '+c.deaths);};
const trollPhysics=updateChallenge;
updateChallenge=function(dt){
 const c=challengeRun;if(!c||c.paused||c.ended||c.quiz)return;const p=c.p,serial=c.respawnSerial,previousY=p.y;
 // Triggered floors continue moving even after the player jumps away.
 for(const f of chPlatforms){if(!f.triggered)continue;f.age+=dt;if(f.trap==='liar'&&f.age>=.3){f.absent=999;if(p.standing===f.index){p.grounded=false;p.coyote=0;}}
  if(f.trap==='sink'){const old=f.y;f.y=f.homeY+Math.min(95,f.age*34);if(p.grounded&&p.standing===f.index)p.y+=f.y-old;if(f.age>=2.7){f.absent=999;if(p.standing===f.index)p.grounded=false;}}
 }
 trollPhysics(dt);if(c.ended||serial!==c.respawnSerial)return;
 const f=p.grounded?chPlatforms[p.standing]:null;
 if(p.climbing&&chLadders.some(l=>l.reverse&&Math.abs(l.x-p.x)<2))c.lastTrap='reverse';
 // Fake geometry gives no support, but records the joke if the player falls through it.
 for(const q of chPlatforms)if(q.illusion&&Math.abs(p.y-q.y)<35&&p.x>=q.x&&p.x<=q.x+q.w)c.lastTrap='bridge';
 if(f?.trap){c.lastTrap=f.trap;
  if(['liar','sink'].includes(f.trap)&&!f.triggered){f.triggered=true;f.age=0;}
  if(f.trap==='mimic'&&!f.triggered){f.triggered=true;p.vy=-280;p.vx=-p.face*330;p.grounded=false;p.detach=.3;p.dash=.18;p.face=-p.face;trollMessage('That platform has personal space.');}
  if(f.trap==='decoy'&&!f.triggered){f.triggered=true;trollMessage('CHECKPOINT*  ·  *Terms and conditions apply.');}
  if(f.trap==='copy'&&f.bad){challengeDamage(true);return;}
 }
 for(const q of chPlatforms)if(q.trap==='safe'){q.stay=f===q?(q.stay||0)+dt:0;if(q.stay>=5){c.lastTrap='safe';q.spikeUntil=c.time+1;challengeDamage(true);return;}}
 for(const m of c.course.modules){if(m.type!=='bait')continue;const q=m.trap;
  if(!m.closed&&Math.hypot(p.x-m.key.x,p.y-22-m.key.y)<29){m.closed=true;c.lastTrap='bait';c.checkpoint={x:q.x+q.w/2,y:q.homeY};c.highest=Math.min(c.highest,q.homeY);trollMessage('Oops, no going back now 😏');}
  // Horizontal shutter seals the route below, leaving the forward climb open.
  if(m.closed&&previousY<=q.homeY+31&&p.y>q.homeY+30&&p.vy>=0){p.y=q.homeY+30;p.vy=0;p.grounded=true;p.standing=null;}
 }
 if(c.course.realGoal&&p.grounded&&Math.abs(p.y-c.course.realGoal.y)<2&&Math.abs(p.x-c.course.realGoal.x)<30)completeTrollChallenge();
};
function completeTrollChallenge(){const c=challengeRun;if(c.ended)return;c.ended=true;c.won=true;
 const stars=1+(c.deaths<=10?1:0)+(c.deaths===0?1:0),key=c.course.level,old=trollRecords[key];
 const best=Math.min(old?.deaths??Infinity,c.deaths);trollRecords[key]={deaths:best,clears:(old?.clears||0)+1};campaignStars[key-1]=Math.max(campaignStars[key-1],stars);
 try{localStorage.setItem('fight-cute-troll-stars-v1',JSON.stringify(campaignStars));localStorage.setItem('fight-cute-troll-records-v1',JSON.stringify(trollRecords));}catch{}
 refreshChallengeStars();challengeDialog(key===10?'YOU OUT-TROLLED THE GAME':'TRUST ISSUES: EARNED',`Deaths: ${c.deaths} · ${Math.floor(c.time)} seconds · Personal best: ${best} deaths. Stars: clear / 10 deaths or fewer / zero deaths. Every retry taught you something.`,true,stars);
}
finishChallenge=function(){const c=challengeRun;if(c.course.level!==10){completeTrollChallenge();return;}c.fakeVisits++;trollRespawn(c,c.course.spawn);trollMessage('Nice try. Again? The real exit is somewhere else.');};
updateChallengeHUD=function(){const c=challengeRun;if(!c)return;document.querySelector('#ch-hearts').textContent='∞ RETRIES';document.querySelector('#ch-coins').textContent='DEATHS: '+c.deaths;document.querySelector('#ch-clock').textContent=Math.floor(c.time/60)+':'+String(Math.floor(c.time%60)).padStart(2,'0');document.querySelector('#ch-tip').textContent=c.time<c.messageUntil?c.message:'A / D MOVE · W / S CLIMB · SPACE JUMP · SHIFT DASH';document.querySelector('#ch-objective').textContent='TRUST NOTHING';document.querySelector('#ch-progress-fill').style.height=clamp((c.course.bottom-c.p.y)/(c.course.bottom-c.course.top)*100,0,100)+'%';};
challengeInteract=function(){if(challengeRun&&!challengeRun.paused&&!challengeRun.ended)trollMessage('Remember the route. Vibrant flags save your progress.');};document.querySelector('#ch-use').onclick=challengeInteract;
function trollFlag(g,x,y,fake=false){retroBox(g,x,y-34,2,34,'#eee0da');retroBox(g,x+2,y-34,16,10,fake?'#bcb5c3':'#48dfb8');}
drawChallenge=function(){const c=challengeRun,g=chG,t=motion.matches?0:c.time,kind=c.course.def.motif;g.imageSmoothingEnabled=false;retroBackdrop(g,kind,t,0,c.camera);g.save();g.translate(0,-Math.round(c.camera));
 for(const l of chLadders){g.save();g.globalAlpha=l.reverse?.65:1;retroLadder(g,l);g.restore();}
 for(const f of chPlatforms){if(!f.invisible)retroPlatform(g,f,kind);
  if(f.checkpoint)trollFlag(g,f.x+12,f.y);if(f.decoy)trollFlag(g,f.x+12,f.y,true);
  if(f.trap==='liar'&&f.triggered&&f.age<.3){retroBox(g,f.x+f.w/2,f.y,2,4,'#594c69');retroBox(g,f.x+f.w/2+2,f.y+4,2,4,'#594c69');}
  if(f.trap==='mimic'&&((Math.floor(t*10)%47===0)||f.triggered))retroBox(g,f.x+f.w/2,f.y+7,2,1,'#342d50');
  if(f.spikeUntil>c.time)for(let x=f.x;x<f.x+f.w;x+=9)for(let j=0;j<5;j++)retroBox(g,x+4-j,f.homeY-10+j*2,1+j*2,2,'#eb8eaa');
 }
 for(const q of c.coins)if(!q.taken)retroCoin(g,q.x,q.y,t);
 for(const m of c.course.modules)if(m.type==='bait'){if(!m.closed)retroKey(g,m.key.x,m.key.y);else{for(let x=0;x<640;x+=16)retroBox(g,x,m.trap.homeY+32,12,8,'#796b91');}}
 const goal=c.course.goal;retroGate(g,goal.x,goal.y,false);retroText(g,c.course.level===10?'BOSS →':'EXIT',goal.x,goal.y-58);
 if(c.course.realGoal){const r=c.course.realGoal;retroBox(g,r.x-12,r.y-30,24,30,'#514767');retroBox(g,r.x-8,r.y-26,16,26,'#8fc3bf');retroBox(g,r.x+4,r.y-13,2,2,'#ffe4ae');}
 const p=c.p;g.save();g.translate(Math.round(p.x),Math.round(p.y));g.scale(.75,.75);g.translate(0,-groundY);drawFighter(g,{...p,x:0,y:groundY,airborne:!p.grounded&&!p.climbing,hideLabel:true},t);g.restore();g.restore();retroParticles(g,t);
};
