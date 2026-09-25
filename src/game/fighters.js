// Fight Cute — fighters.js
// Articulated, shaded animal fighters: limbs are drawn independently every frame.
const fighterLooks={
 '1':{fur:'#fff5ec',shade:'#cbb7d2',inner:'#f7a9bd',accent:'#e997b7'},
 '2':{fur:'#fff4d9',shade:'#c4a6bb',inner:'#efacbc',accent:'#79bbc4'},
 '3':{fur:'#d7b187',shade:'#947363',inner:'#f2c1a2',accent:'#a5c596'},
 '4':{fur:'#ffe5ab',shade:'#c2a071',inner:'#c8a276',accent:'#98b7dd'},
 '5':{fur:'#f4b875',shade:'#b97c76',inner:'#ffeac8',accent:'#b4a1d4'},
 '6':{fur:'#c9b6dd',shade:'#887aab',inner:'#f7e4d4',accent:'#94c9cc'},
 '7':{fur:'#eed2b9',shade:'#b4919c',inner:'#ffe9da',accent:'#e6a7bc'}
};
function drawFighter(g,f,t){
 const c=fighterLooks[f.id],a=f.action,air=Math.max(0,groundY-f.y),moving=Math.abs(f.vx)>15&&air<1;
 const clock=motion.matches?0:t,walk=moving?Math.sin(clock*12):0,breath=Math.sin(clock*3+Number(f.id));
 const phase=a?a.t/a.duration:0,wind=a?Math.min(1,a.t/a.windup):0;
 // A held anticipation pose, fast extension at the damage frame, then a soft recovery.
 const strike=a?(a.t<a.windup?-.25*Math.sin(wind*Math.PI/2):Math.pow(Math.max(0,1-(a.t-a.windup)/(a.duration-a.windup)),.65)):0;
 const kick=a&&(a.type==='heavy'||a.type==='attack'&&a.kick),special=a?.type==='skill',burst=a?.type==='ultimate';
 const hurt=f.stun>0,guard=f.guard,spin=special&&['5','7'].includes(f.id),flap=f.id==='6'&&(air>2||special);
 g.save();g.globalAlpha=.25;g.fillStyle='#392b50';g.beginPath();g.ellipse(f.x,groundY+2,Math.max(9,25-air*.06),5,0,0,Math.PI*2);g.fill();g.restore();
 g.save();g.translate(f.x,f.y);g.scale(f.face,1);
 if(f.invulnerable>0)g.globalAlpha=.7+.3*Math.sin(t*65)**2;
 const landing=Math.min(1,Math.max(0,f.land||0)/.16);
 g.translate(0,moving?-Math.abs(walk)*3:breath*.7);
 g.scale(1+landing*.12,1-landing*.12);
 g.rotate(hurt?-.2:guard?-.07:strike*.12+(moving?.06:0));
 if(special&&f.id==='3'){g.scale(1+Math.sin(phase*Math.PI)*.12,1-Math.sin(phase*Math.PI)*.12);}
 if(special&&f.id==='1')g.translate(0,-Math.abs(Math.sin(phase*Math.PI*2))*9);
 if(spin&&!motion.matches){g.translate(0,-35);g.rotate(phase*Math.PI*2);g.translate(0,35);}
 function oval(x,y,rx,ry,color=c.fur,shade=c.shade,rot=0){
  g.save();g.translate(x,y);g.rotate(rot);g.beginPath();g.ellipse(0,0,rx,ry,0,0,Math.PI*2);
  const fill=g.createRadialGradient(-rx*.32,-ry*.38,1,rx*.12,ry*.15,Math.max(rx,ry)*1.35);fill.addColorStop(0,color);fill.addColorStop(.48,color);fill.addColorStop(1,shade);g.fillStyle=color===shade?color:fill;g.fill();
  if(color!==shade){g.save();g.clip();g.fillStyle=shade;g.globalAlpha*=.16;g.beginPath();g.ellipse(3,ry*.85,rx*1.1,ry*.4,0,0,7);g.fill();g.restore();g.strokeStyle=c.outline||'#4b536b';g.lineWidth=1.2;g.beginPath();g.ellipse(0,0,rx,ry,0,0,Math.PI*2);g.stroke();}
  g.restore();
 }
 function line(points,color,width=1.3){g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
 function limb(x,y,angle,len,width,color=c.fur){g.save();g.translate(x,y);g.rotate(angle);oval(0,len*.5,width,len*.65,color,c.shade);oval(0,len,width+1,width*.85,color,c.shade);g.restore();}
 const wag=Math.sin(clock*(f.id==='4'?12:4))*.25;
 // Back layer: tails, quills, far arm and legs.
 if(f.id==='5'){oval(-26,-25,13,26,c.fur,c.shade,-.65+wag);oval(-36,-39,9,12,'#fff4dc',c.shade,-.65+wag);}
 if(f.id==='2'){g.save();g.translate(-21,-20);g.rotate(wag);line([[0,0],[-11,-6],[-15,-19],[-10,-25]],c.shade,9);line([[0,0],[-11,-6],[-15,-19],[-10,-25]],c.fur,6);g.restore();}
 if(['1','4'].includes(f.id))oval(-25,-20,8,f.id==='4'?12:8,c.fur,c.shade,wag);
 if(f.id==='7'){for(let i=0;i<11;i++){const angle=-Math.PI+i/10*Math.PI*2;oval(Math.cos(angle)*32,-55+Math.sin(angle)*25,7,10,'#a98dab','#7c6c91',angle+Math.PI/2);}}
 limb(-19,-28,f.climbing?-2.5+Math.sin(clock*10)*.5:guard?.9:flap?1.5+Math.sin(clock*15)*.5:walk*.4+.25,12,7);
 const legSwing=f.climbing?Math.sin(clock*10)*.65:(air>1||f.airborne)?.65:walk*.5;
 limb(-10,-11,legSwing,7,7);
 if(!kick)limb(11,-11,-legSwing-(strike>0?.3:0),7,7);
 oval(0,-23,f.id==='3'?25:22,f.id==='3'?21:20);
 oval(3,-22,12,11,'#fff6e8',c.fur);
 // Fitted expedition vest, metal clasp and rim-lit boots add depth and a coherent silhouette.
 oval(0,-25,19,13,'#425772','#202f48');oval(-12,-27,5,10,c.accent,'#3c536c');oval(12,-27,5,10,c.accent,'#3c536c');
 g.fillStyle='#cceae6';g.fillRect(-2,-32,4,15);g.fillStyle='#e7bd71';g.fillRect(-5,-20,10,4);
 
 // Little scarf gives a readable torso twist and a secondary trailing motion.
 oval(0,-35,18,3,c.accent,c.shade);
 g.save();g.translate(-12,-35);g.rotate(wag-strike*.7);oval(-4,7,4,8,c.accent,c.shade,-.3);g.restore();
 // Head follows the torso with a little delayed sway.
 g.save();g.scale(.92,.95);g.translate(3,-55+(hurt?3:Math.sin(clock*3-.4)*.8));g.rotate(hurt?.14:-strike*.09+walk*.035);
 if(f.id==='1'){oval(-17,-29,9,20,c.fur,c.shade,-.2+Math.sin(clock*5)*.06-strike*.16);oval(16,-29,9,21,c.fur,c.shade,.18+Math.sin(clock*5-.5)*.06-strike*.2);oval(-17,-31,3.5,12,c.inner,c.inner,-.2);oval(16,-31,3.5,13,c.inner,c.inner,.18);}
 if(['2','5'].includes(f.id)){for(const x of [-25,25]){g.fillStyle=c.fur;g.strokeStyle=c.shade;g.beginPath();g.moveTo(x-10,-10);g.lineTo(x+(x<0?-3:3),-35);g.lineTo(x+10,-11);g.closePath();g.fill();g.stroke();g.fillStyle=c.inner;g.beginPath();g.moveTo(x-5,-14);g.lineTo(x,-28);g.lineTo(x+5,-14);g.fill();}}
 if(['3','7'].includes(f.id)){oval(-26,-23,7,7);oval(26,-23,7,7);}
 if(f.id==='6'){for(const x of [-20,20]){g.fillStyle=c.fur;g.strokeStyle=c.shade;g.beginPath();g.moveTo(x-8,-14);g.lineTo(x,-34);g.lineTo(x+8,-14);g.closePath();g.fill();g.stroke();}}
 oval(0,0,f.id==='3'?35:f.id==='5'?33:36,f.id==='6'?30:27);
 if(f.id==='4'){oval(-35,-2,11,20,c.inner,c.shade,-.3+wag-strike*.3);oval(35,-2,11,20,c.inner,c.shade,.3+wag-strike*.3);}
 if(['3','4','5','7'].includes(f.id))oval(4,12,f.id==='3'?21:18,10,'#fff4df','#fff4df');
 if(f.id==='6'){oval(-14,2,15,19,'#fff3de','#fff3de',-.15);oval(14,2,15,19,'#fff3de','#fff3de',.15);}
 // Tiny glossy eyes, blinks, cheek color and changing expression.
 const blink=(clock+Number(f.id)*.37)%4.1<.12;
 const faceInk=f.id==='1'?'#598bad':'#5b4c61';
 for(const x of [-12,15]){
  if(hurt){line([[x-2,3],[x+2,5],[x-2,7]],faceInk,1.8);}
  else if(blink||f.cheer>0){line([[x-3,6],[x,3],[x+3,6]],faceInk,1.8);}
  else{oval(x,5,2.8,3.8,faceInk,faceInk);}
 }
 oval(-24,12,6,3,'#f4b9cb','#f4b9cb');oval(26,12,6,3,'#f4b9cb','#f4b9cb');
 if(f.id==='6'){g.fillStyle='#efb865';g.beginPath();g.moveTo(-1,9);g.lineTo(7,9);g.lineTo(3,15);g.closePath();g.fill();}
 else if(f.id!=='1')oval(3,11,2.6,1.9,faceInk,faceInk);
 if(hurt||burst)oval(3,17,2.5,3,faceInk,faceInk);
 else {g.strokeStyle=faceInk;g.lineWidth=1.3;g.lineCap='round';g.beginPath();g.moveTo(-2,16);g.quadraticCurveTo(0,20,3,16);g.quadraticCurveTo(6,20,8,16);g.stroke();}
 // Each animal keeps a tiny readable accessory instead of busy surface detail.
 if(f.id==='1'){oval(23,-23,5,4,'#a9d8df','#a9d8df',-.4);oval(30,-21,5,4,'#a9d8df','#a9d8df',.4);oval(26,-22,2,2,'#fff1d5','#fff1d5');}
 if(f.id==='7'){for(let i=0;i<5;i++)oval(23+Math.cos(i*1.26)*4,-20+Math.sin(i*1.26)*4,3,3,'#e7b0ce','#e7b0ce');oval(23,-20,2,2,'#fff2ae','#fff2ae');}
 if(f.id==='2')for(const side of [-1,1]){line([[side*20,5],[side*31,3]],'#aa899b');line([[side*21,10],[side*32,12]],'#aa899b');}
 if(f.id==='3'){oval(-9,-24,8,6,'#f3b65f','#c99666');line([[-9,-30],[-4,-33]],'#81996e',3);}
 g.restore();
 // Near limbs: actual shoulder/hip rotation, reaching paw and kicking foot.
 if(kick){const extension=Math.max(0,strike);limb(11,-17,-.4-extension*1.35,15+extension*19,8);}
 const flurry=special&&['1','4'].includes(f.id)?Math.sin(phase*Math.PI*8)*.55:0;
 const armAngle=f.climbing?-2.5-Math.sin(clock*10)*.5:guard?-2.1:flap?-1.6-Math.sin(clock*15)*.55:kick?-.9:-.35-strike*1.25+flurry;
 limb(20,-29,armAngle,12+(kick?0:Math.max(0,strike)*20),f.id==='6'?10:7);
 if(guard){g.strokeStyle='#c4f4ff';g.lineWidth=2;g.globalAlpha=.6;g.beginPath();g.ellipse(27,-40,13,29,0,-1.7,1.7);g.stroke();}
 if(special&&f.id==='2'&&strike>0){for(let i=0;i<3;i++)line([[33,-54+i*7],[56+strike*8,-43+i*7]],'#ffebd3',1.5);}
 if(special&&f.id==='3'&&phase>.3){g.save();g.globalAlpha=(1-phase)*.7;g.strokeStyle='#ffe0a0';g.lineWidth=2;g.beginPath();g.ellipse(0,0,20+phase*55,4+phase*6,0,0,Math.PI*2);g.stroke();g.restore();}
 if(a&&strike>0){g.globalAlpha=strike*.55;g.strokeStyle=burst?'#ffed9c':special?'#dec9ff':'#fff4dc';g.lineWidth=burst?5:2;g.beginPath();g.arc(18,kick?-22:-42,Math.min(59,a.range*.65),-.9,1);g.stroke();if(burst){g.beginPath();g.arc(18,-42,Math.min(68,a.range*.72),-1.1,1.3);g.stroke();}}
 g.restore();g.fillStyle=f.side==='player'?'#ddfff0':'#ffe1ed';g.font='bold 8px monospace';g.textAlign='center';if(!f.hideLabel)g.fillText(f.side==='player'?'P1':'NPC',f.x,f.y-(f.id==='1'?112:98));
}
