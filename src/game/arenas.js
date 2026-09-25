// Fight Cute — arenas.js
function drawFloor(g,t,camera){const d=match.def;const grad=g.createLinearGradient(0,250,0,360);grad.addColorStop(0,d.edge);grad.addColorStop(.14,d.floor);grad.addColorStop(1,d.line);g.fillStyle=grad;g.fillRect(0,257,640,103);g.fillStyle=d.edge;g.fillRect(0,257,640,2);
 if(match.map===1){for(let i=0;i<90;i++){g.globalAlpha=.14;g.fillStyle=i%2?'#fff2ce':d.line;g.fillRect((i*97%680)-camera*.12,267+i*31%88,3+i%4,1);}g.globalAlpha=.48;g.fillStyle='#edf6e9';for(let i=0;i<32;i++)g.fillRect(i*24+Math.sin(t*.7+i)*8,254+Math.sin(i*.5+t)*2,16,1);g.globalAlpha=1;}
 else if(match.map===5){for(let i=0;i<18;i++){g.fillStyle='#78778e50';g.beginPath();g.ellipse(i*47%640,267+i*37%80,7+i%8,2+i%3,0,0,7);g.fill();g.fillStyle='#e1d6e13a';g.fillRect(i*83%640,265+i*19%85,3,1);}}
 else{g.strokeStyle=d.line;g.lineWidth=.65;g.globalAlpha=.45;for(let i=0;i<10;i++){const y=260+i*i*1.4;g.beginPath();g.moveTo(0,y);g.lineTo(640,y);g.stroke();}for(let i=-5;i<15;i++){const x=i*70-camera*.18;g.beginPath();g.moveTo(320+(x-320)*.55,258);g.lineTo(x,360);g.stroke();}g.globalAlpha=1;}
 if(match.map===3){g.globalAlpha=.18;for(let i=0;i<12;i++){g.fillStyle=i%2?'#f39bda':'#94e2e4';g.fillRect(i*59,264+(i*17)%70,15+Math.sin(t+i)*8,2);}g.globalAlpha=1;}
 if(match.map===6){g.fillStyle='#b38a7170';g.fillRect(50,285,540,1);g.fillStyle='#eed39b15';g.beginPath();g.moveTo(370,257);g.lineTo(485,257);g.lineTo(620,360);g.lineTo(310,360);g.fill();}
}
function drawEnvironment(g,t,camera){const d=match.def;g.imageSmoothingEnabled=false;g.drawImage(match.bg,-24-camera*.035,-9,688,387);drawFloor(g,t,camera);
 if(match.map===1){g.globalAlpha=.17;g.fillStyle='#fff3b0';g.beginPath();g.arc(530,65,35+Math.sin(t)*2,0,7);g.fill();g.globalAlpha=1;}
 if(match.map===4){for(let i=0;i<4;i++){const x=((i*210-t*9)%850+850)%850-120;g.globalAlpha=.18;g.fillStyle='#fff5ee';g.beginPath();g.ellipse(x,230+i%2*30,80,13,0,0,7);g.fill();}g.globalAlpha=1;}
 const count=match.map===3?60:match.map===5?25:28;
 for(let i=0;i<count;i++){const seed=i*97.37;let x=(seed*3.7)%680,y=(seed*1.83)%270;g.fillStyle=d.ambient;
  if(d.weather==='rain'){x=(x-t*26+720)%720;y=(y+t*130)%310;g.globalAlpha=.22;g.strokeStyle='#d8d5ff';g.beginPath();g.moveTo(x,y);g.lineTo(x-3,y+10);g.stroke();}
  else if(d.weather==='petals'||d.weather==='leaves'){x=(x+t*(8+i%9))%690-20;y=(y+t*(4+i%6))%300;g.globalAlpha=.5;g.save();g.translate(x,y);g.rotate(Math.sin(t+i));g.fillRect(-2,-1,4,2);g.restore();}
  else if(d.weather==='stars'){g.globalAlpha=.15+.3*Math.sin(t*.7+i)**2;g.fillRect(x,y*.7,1,1);}
  else{g.globalAlpha=.12+.22*Math.sin(t+i)**2;g.fillRect(x+Math.sin(t*.4+i)*8,(y-t*2+300)%300,1.4,1.4);}
 }g.globalAlpha=1;
 // Foreground edges create depth without obscuring the fighting lane.
 if(match.map===1||match.map===7){g.fillStyle=match.map===1?'#759a7166':'#69876b66';for(let j=0;j<7;j++){const x=j*6;g.beginPath();g.moveTo(x,360);g.quadraticCurveTo(x+18+Math.sin(t)*2,340,x+4,325+j*3);g.lineTo(x+7,360);g.fill();g.save();g.translate(640,0);g.scale(-1,1);g.beginPath();g.moveTo(x,360);g.lineTo(x+17,335+j*2);g.lineTo(x+6,360);g.fill();g.restore();}}
}
