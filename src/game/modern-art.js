/* Modern 128px roster: articulated silhouettes, six-frame motion and 61-colour ramps. */
const modernSprites=new Map();
function modernRGB(hex){return hex.match(/\w\w/g).map(v=>parseInt(v,16));}
function modernMix(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*t));}
retroSprite=function(id,pose='idle',frame=0,ninja=false){
 id=String(id);frame=((frame%6)+6)%6;const key=[id,pose,frame,ninja].join(':');if(modernSprites.has(key))return modernSprites.get(key);
 const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
 const fur=['fff0d9','f4d5a2','cba17a','f0ca8d','edaa71','c4b5db','d8b698'][+id-1]||'fff0d9';
 const bases=[fur,'f5eee4','668cc1','e8a6b3','765565','e9b963'];const ramps=bases.map(h=>{const b=modernRGB(h);return Array.from({length:10},(_,i)=>i<5?modernMix(modernRGB('423a56'),b,.3+i*.14):modernMix(b,[255,249,225],(i-4)*.12));});
 const palette=ramps.flat(),rgb=(r,i)=>'rgb('+ramps[r][i].join(',')+')';
 const phase=frame*Math.PI/3,breath=Math.sin(phase),stride=Math.sin(phase),moving=pose==='walk'||pose==='climb',strike=pose==='attack'||pose==='heavy',reach=strike?[0,-3,12,20,11,2][frame]:0;
 function shape(path,r=0){g.beginPath();path();const grad=g.createLinearGradient(25,15,101,118);for(let i=0;i<10;i++)grad.addColorStop(i/9,rgb(r,9-i));g.fillStyle=grad;g.fill();g.strokeStyle=rgb(r,1);g.lineWidth=1;g.stroke();}
 function oval(x,y,rx,ry,r=0,angle=0){shape(()=>g.ellipse(x,y,rx,ry,angle,0,Math.PI*2),r);}
 function limb(x,y,ex,ey,width,r=0){shape(()=>{g.moveTo(x-width,y);g.quadraticCurveTo(x-width-3,(y+ey)/2,ex-width*.7,ey);g.quadraticCurveTo(ex,ey+width,ex+width*.7,ey);g.quadraticCurveTo(x+width+2,(y+ey)/2,x+width,y);g.closePath();},r);}
 g.translate(0,Math.round(-breath*(moving?2:1)));
 // Distinct, independently moving tails and ears.
 if(id==='5'){shape(()=>{g.moveTo(49,104);g.bezierCurveTo(13,109,10,77+breath*3,26,67);g.bezierCurveTo(28,88,51,72,49,104);},0);oval(23,77+breath*2,7,12,1,-.4);}
 if(id==='2')limb(44,104,29+breath*3,80,4);
 if(id==='4')oval(42,102,10,7,0,breath*.1);
 if(id==='7')for(let i=0;i<11;i++){const a=i*Math.PI/10;shape(()=>{g.moveTo(63+Math.cos(a)*37,64-Math.sin(a)*27);g.lineTo(63+Math.cos(a)*48,60-Math.sin(a)*39);g.lineTo(65+Math.cos(a+.22)*36,73-Math.sin(a+.22)*30);},4);}
 const lift=moving?stride*5:0;oval(55,116+lift,9,5,0,-.1);oval(pose==='heavy'?99:77,pose==='heavy'?101:116-lift,10,5,0,.12);
 oval(65,98,21,19,1,.05);oval(65,88,16,5,4,.03); // neck occlusion
 limb(47,88,pose==='climb'?40:44-reach*.3,pose==='climb'?58-lift:104+lift,6);
 limb(83,89,pose==='guard'?82:86+reach,pose==='climb'?60+lift:pose==='guard'?68:98-lift-reach*.55,6);
 // Vest, collar and fabric folds.
 shape(()=>{g.moveTo(48,87);g.lineTo(58,91);g.lineTo(63,112);g.lineTo(49,108);g.closePath();},2);
 shape(()=>{g.moveTo(79,87);g.lineTo(68,92);g.lineTo(66,113);g.lineTo(81,108);g.closePath();},2);
 g.fillStyle=rgb(2,2);g.fillRect(53,99,1,7);g.fillRect(74,96,1,9);g.fillStyle=rgb(1,8);g.fillRect(56,94,2,5);g.fillRect(70,101,2,7);oval(65,95,2,2,5);
 g.save();g.translate(65,58);g.rotate(-.085+breath*.014+Math.cos(phase)*.025);g.translate(-65,-58);
 if(id==='1'){oval(47,26,8,24,0,-.18+breath*.035);oval(80,24,8,22,0,.27+breath*.025);oval(47,24,3,16,3,-.18);oval(81,24,3,14,3,.27);}
 if(id==='2'||id==='5')for(const [x,s]of [[39,-1],[87,1]]){shape(()=>{g.moveTo(x-12,47);g.quadraticCurveTo(x-10,26,x+s*4,22);g.quadraticCurveTo(x+11,30,x+12,46);},0);oval(x,37,4,7,3,s*.3);}
 if(id==='3'){oval(38,39,9,8);oval(89,37,8,8);oval(38,39,4,3,4);oval(89,37,4,3,4);}
 if(id==='4'){oval(29,58,10,23,0,.3+breath*.03);oval(100,62,10,25,0,-.23+breath*.025);}
 if(id==='6'){oval(39,36,9,13,0,-.5);oval(88,36,8,11,0,.4);}
 oval(64,60,id==='3'?36:33,28);
 if(id==='5'){oval(48,69,17,16,1,-.2);oval(79,68,17,16,1,.25);}
 if(id==='6'){oval(49,60,16,20,1,-.1);oval(80,59,16,20,1,.1);}
 // Pixel clusters for brow rim light, cheek bounce, muzzle and expressive eyes.
 g.fillStyle=rgb(0,9);g.fillRect(47,34,14,1);g.fillRect(38,40,3,1);
 const blink=pose==='idle'&&frame===5;
 if(pose==='climb'){oval(64,62,10,3,0);}
 else{for(const x of [49,80]){oval(x,59,3.5,blink?.8:5,4);if(!blink){g.fillStyle=rgb(1,9);g.fillRect(x-1,56,2,2);}}oval(40,69,5,2.5,3);oval(90,68,5,2.5,3);oval(65,68,id==='3'?6:3,2,id==='6'?5:4);g.strokeStyle=rgb(4,2);g.lineWidth=1;g.beginPath();g.moveTo(60,74);g.quadraticCurveTo(64,78,69,73);g.stroke();if(id==='2'){g.fillStyle=rgb(4,3);g.fillRect(29,65,8,1);g.fillRect(92,64,8,1);}}
 if(ninja){g.fillStyle=rgb(2,2);g.fillRect(33,46,64,5);g.fillStyle=rgb(5,7);g.fillRect(72,47,6,3);}
 g.restore();
 // Quantize interior shades to 60 colours, retaining only four edge alpha steps.
 const image=g.getImageData(0,0,128,128),d=image.data;
 for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;let best=0,dist=Infinity;for(let j=0;j<palette.length;j++){const p=palette[j],v=(d[i]-p[0])**2+(d[i+1]-p[1])**2+(d[i+2]-p[2])**2;if(v<dist){dist=v;best=j;}}d[i]=palette[best][0];d[i+1]=palette[best][1];d[i+2]=palette[best][2];d[i+3]=Math.round(d[i+3]/85)*85;}
 g.putImageData(image,0,0);modernSprites.set(key,c);return c;
};
retroPose=function(f,t){if(f.climbing)return['climb',Math.floor(t*10)%6];if(f.guard)return['guard',Math.floor(t*4)%6];if(f.action)return[f.action.type==='heavy'?'heavy':'attack',Math.min(5,Math.floor(f.action.t/f.action.duration*6))];if(f.airborne||f.y<groundY-1)return['jump',Math.floor(t*5)%6];return Math.abs(f.vx)>15?['walk',Math.floor(t*12)%6]:['idle',Math.floor(t*3)%6];};
drawFighter=function(g,f,t){const [pose,frame]=retroPose(f,motion.matches?0:t);g.save();g.imageSmoothingEnabled=false;g.translate(Math.round(f.x),Math.round(f.y));g.scale(f.face||1,1);if(f.stun>0)g.rotate(-.07);g.fillStyle='#34314b35';g.fillRect(-17,0,34,2);g.drawImage(retroSprite(f.id,pose,frame,scene==='free'&&freeRun?.world.index===4),-56,-106,112,112);g.restore();if(!f.hideLabel)retroText(g,f.side==='player'?'P1':'NPC',f.x,f.y-108);};
animateRetroPortraits=function(now){const step=motion.matches?0:Math.floor(now/333)%6;if(step!==retroPortraitTick){retroPortraitTick=step;for(const img of document.querySelectorAll('img.retro-mascot'))img.src=retroSprite(img.dataset.animal,'idle',step).toDataURL();}requestAnimationFrame(animateRetroPortraits);};
// Portrait backing stores follow the shared sprite resolution.
for(const side of ['player','npc']){const c=document.getElementById(side+'-portrait');c.width=c.height=128;}
const modernHUD=updateBattleHUD;updateBattleHUD=function(){modernHUD();if(!match)return;for(const side of ['player','npc']){const g=document.getElementById(side+'-portrait').getContext('2d');g.clearRect(0,0,128,128);g.drawImage(retroSprite(match[side].id,'idle',motion.matches?0:Math.floor(match.elapsed*3)%6),0,0);}};
// Fine stepped sky ramps keep the pixel grid while softening the atmosphere.
arenaSky=function(g,colors){const p=colors.map(h=>modernRGB(h.slice(1)));for(let y=0;y<360;y+=3){const u=y/359*2,i=Math.min(1,Math.floor(u)),c=modernMix(p[i],p[i+1],u-i);g.fillStyle='rgb('+c.join(',')+')';g.fillRect(0,y,640,4);}};
function modernGlow(g,x,y,r,color,strength){g.save();for(let j=10;j>=1;j--){g.globalAlpha=strength/10;arenaDisc(g,x,y,r*j/10,r*j/12,color);}g.restore();}
function modernAtmosphere(g,id,t,cam=0){g.save();const warm=id===1||id===6;const color=warm?'#ffe1aa':id===3?'#f1a4e3':'#c9dcff';if(id===6){modernGlow(g,322,140,115,color,.42);modernGlow(g,590,245,45,color,.5);}else if(id===3){for(let i=0;i<10;i++)modernGlow(g,i*68+11,140-Math.abs(5-i)*4,25,color,.3+(Math.sin(t*2+i)*.04));}else modernGlow(g,id===5?458:462,id===5?99:118,105,color,.22);
 for(let i=0;i<26;i++){const x=((i*97+t*(2+i%3)-cam*.16)%680+680)%680-20,y=90+(i*31+t*(i%2?2:-2)+Math.sin(t+i)*3+1000)%165;g.globalAlpha=.25+.25*Math.sin(t+i)**2;g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),1,1);}g.restore();}
const modernArenaBase=paintLivingArena;paintLivingArena=function(g,id,t,cam){modernArenaBase(g,id,t,cam);modernAtmosphere(g,id,motion.matches?0:t,cam);};
const modernBackdropBase=retroBackdrop;retroBackdrop=function(g,kind,t,x=0,y=0){modernBackdropBase(g,kind,t,x,y);modernAtmosphere(g,kind==='moon'?5:kind==='ninja'?3:7,motion.matches?0:t,x);};
// Add tiny material highlights to every traversable platform without changing collision.
const modernPlatformBase=retroPlatform;retroPlatform=function(g,p,kind){if(p.absent>0)return;modernPlatformBase(g,p,kind);g.save();g.fillStyle='#fff0d84a';for(let x=p.x+5;x<p.x+p.w-4;x+=13)g.fillRect(Math.round(x),Math.round(p.y+2),5,1);g.restore();};

// Rounded scenery receives fine pixel-band volume rather than flat discs.
arenaDisc=function(g,x,y,rx,ry,color){const base=modernRGB(color.slice(1));for(let yy=-Math.ceil(ry);yy<=ry;yy++){const u=yy/ry;if(Math.abs(u)>1)continue;const w=Math.floor(rx*Math.sqrt(1-u*u));const step=Math.round((u+1)*5)/10;const tint=step<.45?modernMix(base,[255,246,226],(.45-step)*.25):modernMix(base,[48,47,77],(step-.45)*.18);g.fillStyle='rgb('+tint.join(',')+')';g.fillRect(Math.round(x)-w,Math.round(y+yy),w*2+1,1);}};
// Short input buffer lets a deliberate late press chain into the next move.
const modernMove=doMove;doMove=function(f,type){if(match&&!match.paused&&!match.ended&&match.countdown<=0&&f.side==='player'&&f.stun<=0&&(f.action||f.cooldown>0)&&f.cooldown<=.18){f.bufferedMove={type,until:match.elapsed+.2};return;}modernMove(f,type);};
const modernUpdate=updateMatch;updateMatch=function(dt){modernUpdate(dt);if(!match||match.paused||match.ended)return;const f=match.player,b=f.bufferedMove;if(b){if(match.elapsed>b.until)f.bufferedMove=null;else if(!f.action&&f.cooldown<=0&&f.stun<=0){f.bufferedMove=null;modernMove(f,b.type);}}};
const modernReset=resetArenaInput;resetArenaInput=function(){modernReset();if(match)match.player.bufferedMove=null;};


