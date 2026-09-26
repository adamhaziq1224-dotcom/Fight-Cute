// Fight Cute — title.js
'use strict';
// Original pixel artwork, drawn on a low-resolution canvas. Entirely offline.
// Connect the next scene by listening for the fightcute:start event.
const canvas=document.querySelector('#world'),ctx=canvas.getContext('2d'),stage=document.querySelector('#stage'),start=document.querySelector('#start'),modes=document.querySelector('#modes');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let scene="title",selectedMode=null;
let scale=1,width=1280,height=720,hover=false,pressed=false;
function resize(){width=innerWidth;height=innerHeight;scale=Math.min(width/1280,height/720);stage.style.setProperty('--scale',scale);canvas.width=Math.ceil(width/(scale*4));canvas.height=Math.ceil(height/(scale*4));ctx.imageSmoothingEnabled=false;}
addEventListener('resize',resize);resize();
const font={A:['01110','11011','11011','11111','11011','11011','11011'],C:['01111','11000','11000','11000','11000','11000','01111'],E:['11111','11000','11000','11110','11000','11000','11111'],F:['11111','11000','11000','11110','11000','11000','11000'],G:['01111','11000','11000','11011','11011','11011','01110'],H:['11011','11011','11011','11111','11011','11011','11011'],I:['111','010','010','010','010','010','111'],M:['11011','11111','11111','10101','10001','10001','10001'],N:['11001','11101','11101','11011','11011','11001','11001'],P:['11110','11011','11011','11110','11000','11000','11000'],R:['11110','11011','11011','11110','11100','11010','11011'],S:['01111','11000','11000','01110','00011','00011','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],U:['11011','11011','11011','11011','11011','11011','01110'],' ':['000','000','000','000','000','000','000']};
Object.assign(font,{L:['11000','11000','11000','11000','11000','11000','11111'],O:['01110','11011','11011','11011','11011','11011','01110'],D:['11110','11011','11011','11011','11011','11011','11110']});
function textCells(text,size,cx,y){const w=([...text].reduce((a,c)=>a+font[c][0].length+1,0)-1)*size;let x=Math.round(cx-w/2),cells=[];for(const c of text){font[c].forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='1')cells.push([x+i*size,y+j*size,j]);}));x+=(font[c][0].length+1)*size;}return cells;}
function label(text,cx,y,size,color){ctx.fillStyle=color;for(const[x,z]of textCells(text,size,cx,y))ctx.fillRect(x,z,size,size);}
// Nine-row, hand-drawn title alphabet: softened corners and generous counters.
const titleFont={
F:['0111111','1111111','1100000','1100000','1111110','1111110','1100000','1100000','1100000'],
I:['11111','11111','01110','01110','01110','01110','01110','11111','11111'],
G:['0011110','0111111','1100000','1100000','1101111','1100011','1100011','0111111','0011110'],
H:['1100011','1100011','1100011','1111111','1111111','1100011','1100011','1100011','1100011'],
T:['0111110','1111111','0011100','0011100','0011100','0011100','0011100','0011100','0011100'],
C:['0011110','0111111','1100011','1100000','1100000','1100000','1100011','0111111','0011110'],
U:['1100011','1100011','1100011','1100011','1100011','1100011','1100011','0111110','0011100'],
E:['0111111','1111111','1100000','1111110','1111110','1100000','1100000','1111111','0111111']};
function word(text,y,size,palette,t){
 const gap=3,total=([...text].reduce((n,c)=>n+titleFont[c][0].length+gap,0)-gap)*size;
 let x=Math.round(160-total/2);const cells=[],tops=[];
 [...text].forEach((c,k)=>{const rows=titleFont[c],z=y+Math.round(Math.sin(t*1.5+k*.35));rows.forEach((row,j)=>[...row].forEach((v,i)=>{if(v==='1'){cells.push([x+i*size,z+j*size,j,k]);if(j===0||rows[j-1][i]==='0')tops.push([x+i*size,z+j*size,k]);}}));x+=(rows[0].length+gap)*size;});
 // Warm white sticker rim, compact plum extrusion, and clean pastel faces.
 for(const [spread,dx,dy,color]of [[3,0,1,'#fff8ed'],[3,1,3,'#fff8ed'],[2,1,3,'#695178'],[1,1,2,'#a06b9a'],[1,0,0,'#695178']]){ctx.fillStyle=color;for(const[x,z]of cells)ctx.fillRect(x-spread+dx,z-spread+dy,size+spread*2,size+spread*2);}
 const mint=['#e6fff2','#d6fae9','#c8f4e2','#b8ecdb','#a6e3d3','#98dacc','#8bd0c4','#7ec6bb','#74b9b1'];
 for(const[x,z,row,k]of cells){ctx.fillStyle=text==='CUTE'&&k%2===1?mint[row]:palette[row];ctx.fillRect(x,z,size,size);}
 ctx.fillStyle='#fffaf0';for(const[x,z]of tops)ctx.fillRect(x,z,size,1);
}
const cloudShape=new Path2D('M0 22H5V18H12V12H16V8H20V5H28V8H32V13H35V17H39V12H44V10H50V13H54V19H61V22H67V25H72V29H67V32H58V34H14V32H6V29H0Z');
function cloud(x,y,s,alpha=1,face=false){ctx.save();ctx.globalAlpha=alpha;ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);ctx.translate(0,3);ctx.fillStyle='#ada9d9';ctx.fill(cloudShape);ctx.translate(0,-1);ctx.fillStyle='#ddd5ee';ctx.fill(cloudShape);ctx.translate(0,-2);ctx.fillStyle='#fff6ee';ctx.fill(cloudShape);ctx.fillStyle='#e5ddf1';ctx.fillRect(8,28,54,3);ctx.fillRect(16,31,40,2);ctx.fillRect(30,19,5,3);ctx.fillRect(35,22,7,2);ctx.fillRect(52,23,6,2);ctx.fillStyle='#fffdf3';ctx.fillRect(20,6,8,2);ctx.fillRect(17,9,7,3);ctx.fillRect(44,11,6,2);if(face){ctx.fillStyle='#776786';ctx.fillRect(28,22,2,3);ctx.fillRect(41,22,2,3);ctx.fillRect(34,26,4,1);ctx.fillStyle='#f3b5c6';ctx.fillRect(24,25,5,2);ctx.fillRect(42,25,5,2);}ctx.restore();}
const clouds=[[-20,15,.8,3,.8],[225,25,.8,4,.85],[75,3,.45,2,.4],[-33,80,1.1,5,1],[245,82,1,4,1],[60,105,.55,3,.6],[185,119,.5,2,.6],[-22,142,1.45,7,1],[230,147,1.3,6,1]];
function heart(x,y,s,color){const shape=['0110110','1111111','1111111','0111110','0011100','0001000'];ctx.fillStyle=color;shape.forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='1')ctx.fillRect(x+i*s,y+j*s,s,s);}));}
function star(x,y,color){ctx.fillStyle=color;ctx.fillRect(x,y-2,1,5);ctx.fillRect(x-2,y,5,1);}
function button(t){const dy=pressed?2:hover?-1:0;ctx.save();ctx.translate(0,dy);ctx.fillStyle='#594569';ctx.fillRect(117,134,86,20);ctx.fillRect(120,131,80,26);ctx.fillStyle='#a67e9e';ctx.fillRect(120,151,80,4);ctx.fillStyle=hover?'#e0ffee':'#bcf2db';ctx.fillRect(120,134,80,17);ctx.fillRect(123,132,74,21);ctx.fillStyle='#f6ffe9';ctx.fillRect(123,133,73,2);ctx.fillStyle='#83cfbb';ctx.fillRect(123,150,74,3);label('START GAME',160,140,1,'#594569');if(hover){ctx.fillStyle='#fff8dd';ctx.fillRect(110,140,2,7);ctx.fillRect(112,142,2,3);}ctx.restore();if(Math.sin(t*2)>-.5||motion.matches)label('PRESS ENTER',160,166,1,'#69628c');}
function draw(ms){if(scene==='battle'||scene==='challenge'||scene==='free'){requestAnimationFrame(draw);return;}const t=motion.matches?0:ms/1000;ctx.setTransform(1,0,0,1,0,0);const sky=ctx.createLinearGradient(0,0,0,canvas.height);sky.addColorStop(0,'#9799d9');sky.addColorStop(.48,'#b9c7e8');sky.addColorStop(1,'#e9d9e7');ctx.fillStyle=sky;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.translate(Math.floor((canvas.width-320)/2),Math.floor((canvas.height-180)/2));
// Quiet, dithered atmosphere and tiny drifting stardust.
for(let i=0;i<44;i++){const x=(i*73%400)-40,y=i*37%210-15;ctx.globalAlpha=.2+.12*Math.sin(t+i);ctx.fillStyle='#fff8ed';ctx.fillRect(x,y,1,1);}ctx.globalAlpha=1;
// A stepped little sun behind the upper cloud layer.
ctx.fillStyle='#eacbdf';ctx.fillRect(254,15,20,28);ctx.fillRect(250,19,28,20);ctx.fillStyle='#ffe9bf';ctx.fillRect(255,18,18,23);ctx.fillRect(252,22,24,15);ctx.fillStyle='#fff5d7';ctx.fillRect(257,20,10,2);
const left=-(canvas.width-320)/2-110,span=canvas.width+220;
for(let i=0;i<clouds.length;i++){const[x,y,s,v,a]=clouds[i];const xx=((x-t*v*3-left)%span+span)%span+left;cloud(xx,y+Math.round(Math.sin(t*.6+i)),s,a,i>6);}
if(scene==='title'){
// Symmetrical hearts and a small orbit of pixel stars frame the title.
heart(143,22,1,'#fff0cb');heart(155,19,1.5,'#fff5df');heart(172,22,1,'#fff0cb');
word('FIGHT',42,3,['#fff8e2','#fff3d6','#ffedc8','#ffe6bd','#ffdfb4','#ffd7ae','#ffcea8','#f5bfa2','#eab09e'],t);
word('CUTE',81,4,['#fff1f2','#ffe4ed','#ffdae8','#ffd0e2','#fac4dc','#f3b6d4','#eba8cc','#df98c1','#d28ab5'],t+.2);
for(const[x,y,i]of [[86,36,0],[224,42,1],[83,100,2],[235,107,3],[110,120,4],[215,75,5]]){ctx.globalAlpha=.55+.45*Math.sin(t*2+i)**2;star(x,y+Math.round(Math.sin(t+i)),'#fff8d9');}ctx.globalAlpha=1;
button(t);
}else if(scene!=='loading'){heart(153,17,2,'#fff1d6');label(scene==='levels'?'CHALLENGE MODE':scene==='versus'?'CHARACTER SELECT':scene==='maps'?'SELECT MAP':'SELECT MODE',160,29,2,'#695178');}
requestAnimationFrame(draw);}
requestAnimationFrame(draw);
start.addEventListener('pointerenter',()=>hover=true);start.addEventListener('pointerleave',()=>{hover=false;pressed=false;});start.addEventListener('pointerdown',()=>pressed=true);addEventListener('pointerup',()=>pressed=false);start.addEventListener('focus',()=>hover=true);start.addEventListener('blur',()=>hover=false);
