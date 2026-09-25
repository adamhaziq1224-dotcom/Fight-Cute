// Fight Cute — characters.js
const animals={
 '1':{name:'Arnab',skill:'Serangan laju dan pergerakan pantas.',hp:110,attack:64,def:42,color:'#fff4ed'},
 '2':{name:'Kucing',skill:'Cakaran kuat dan gerakan tangkas.',hp:105,attack:84,def:48,color:'#c4b2e6'},
 '3':{name:'Capybara',skill:'Badan besar, kuat dan tahan serangan.',hp:180,attack:72,def:90,color:'#c69b73'},
 '4':{name:'Puppy',skill:'Bijak menyambung kombo berturut-turut.',hp:135,attack:70,def:65,color:'#efd0a0'},
 '5':{name:'Fox',skill:'Gerakan laju dengan serangan ekor berpusing.',hp:115,attack:80,def:50,color:'#eda76d'},
 '6':{name:'Owl',skill:'Serangan udara dan terjahan dari atas.',hp:95,attack:78,def:40,color:'#b9c7db'},
 '7':{name:'Landak',skill:'Duri tajam dengan serangan berkuasa tinggi.',hp:125,attack:92,def:78,color:'#c398a5'}
};
const randomResolved={player:null,npc:null};
const personalities={'1':'CERIA & AKTIF','2':'TANGKAS & FOKUS','3':'TENANG & TEGUH','4':'SETIA & TERUJA','5':'LICIK & BERGAYA','6':'BIJAK & INGIN TAHU','7':'BERANI & BERDAYA TAHAN'};
function animalSVG(id,performing=false){
 const ink='#42516a';let body='',head='',ears='',tail='',face='',acc='',wings='';
 const path=(d,fill,stroke=ink,sw=1.1)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round"/>';
 const el=(x,y,rx,ry,fill,stroke='none',sw=1)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
 const line=(d,c=ink,w=1)=>path(d,'none',c,w);
 const eye=(x,y,c='#4d4053',big=1)=>el(x,y,2.2*big,3*big,c)+el(x-.65*big,y-1.05*big,.75*big,.9*big,'#fff')+el(x+.65*big,y+.95*big,.3*big,.35*big,'#e8d8ed');
 const cheeks=(y=33)=>el(20,y,3.4,1.8,'#efacb880')+el(44,y,3.4,1.8,'#efacb880');
 const smile=(y=35)=>line('M29 '+y+' Q32 '+(y+3.6)+' 35 '+y,'#916877',.9);
 const nose=(y=32,c='#bc8092')=>path('M30 '+y+' Q32 '+(y-1)+' 34 '+y+' Q32 '+(y+3.5)+' 30 '+y,c,'none');
 const foot=(x,c)=>el(x,57,5.4,2.8,c,ink,.9)+el(x-.7,56.6,2.1,.6,'#ffffff60');
 const paw=(x,y,c)=>el(x,y,3.6,5.6,c,ink,1);
 const star=(x,y,c)=>path('M'+x+' '+(y-3)+' L'+(x+1)+' '+(y-1)+' L'+(x+3)+' '+y+' L'+(x+1)+' '+(y+1)+' L'+x+' '+(y+3)+' L'+(x-1)+' '+(y+1)+' L'+(x-3)+' '+y+' L'+(x-1)+' '+(y-1)+'Z',c,'none');
 if(id==='1'){
 // Mallow: a cream bunny with oversized velvet ears and a lavender neckerchief.
 tail=el(46,49,5.4,5,'#fff8ee',ink,1)+el(47,47,2.3,2.3,'#fff');
 ears=path('M20 23 C13 16 13 1 19 0 C25 -1 27 14 26 23Z','#fff6e9')+path('M36 22 C34 10 39 -2 46 2 C51 6 43 11 43 23Z','#fff6e9')+path('M20 19 C17 10 18 4 20 4 C23 5 24 15 23 20Z','#edc1d1','none')+path('M39 19 Q38 5 44 5 Q45 7 41 12 L42 20Z','#edc1d1','none');
 body=el(32,46,11,12,'#f6e9d9',ink,1.1)+el(32,47,7,9,'#fff9ef')+paw(21,45,'#fff6e9')+paw(43,45,'#fff6e9')+foot(25,'#fff7eb')+foot(39,'#fff7eb');
 head=path('M14 27 C14 13 49 10 50 26 C54 37 45 42 32 42 C18 42 10 37 14 27Z','#fff8ed')+el(26,18,8,2,'#ffffffa0');
 face=cheeks()+nose()+smile();
 acc=path('M23 40 Q32 44 41 40 L40 44 Q31 48 24 44Z','#bba6df','#9c86bf',.7)+path('M34 44 Q40 45 41 51 L36 50 33 46Z','#cbb8e9','#9c86bf',.7)+el(29,44,1.3,1.3,'#fff0be');
 }
 if(id==='2'){
 // Mochi: a peach tabby with a soft mint romper and a tiny moon pendant.
 tail=path('M42 51 C56 57 58 40 51 36 C46 34 46 39 50 40 C54 43 50 51 43 47Z','#efbda5')+line('M51 40Q54 41 54 44','#d89884',2);
 ears=path('M17 25 Q11 4 19 8 L30 17 37 16 Q52 3 50 13 L48 28Z','#f2c4ad')+path('M18 12L26 21 18 23Z','#e8a3ad','none')+path('M47 12L40 21 47 23Z','#e8a3ad','none');
 body=el(32,46,11,12,'#efbda5',ink,1)+paw(21,45,'#f3cbb4')+paw(43,45,'#f3cbb4')+foot(25,'#f5d9c4')+foot(39,'#f5d9c4')+path('M25 40L28 40 29 44 35 44 36 40 39 40 41 55Q32 59 23 55Z','#a7d8cc','#75ad9c',.8)+el(28,46,1,1,'#fff8dc')+el(36,46,1,1,'#fff8dc');
 head=path('M14 25 C13 14 49 13 50 25 Q56 39 34 42 Q12 43 14 25Z','#f8d4bc')+path('M27 17L29 23M34 17L34 22M40 18L38 23','none','#dca88e',1.8)+el(32,35,8,5,'#fff0df');
 face=cheeks()+nose(32,'#b77684')+smile(35)+line('M19 34L13 33M19 36L12 37M45 34L51 33M45 36L52 37','#af8f88',.6);
 acc=path('M34 42 A3 3 0 1 0 37 45 A2.8 2.8 0 0 1 34 42Z','#f5dc8c','none');
 }
 if(id==='3'){
 // Chai: a sleepy honey-brown capybara with a leaf and a cross-body pouch.
 ears=el(20,18,4,4.3,'#c9a482',ink,1)+el(44,18,4,4.3,'#c9a482',ink,1)+el(20,18,2,2,'#aa8069')+el(44,18,2,2,'#aa8069');
 body=el(32,45,14,13,'#cba785',ink,1.1)+el(32,46,9,10,'#e5cbb0')+paw(19,46,'#d8b896')+paw(45,46,'#d8b896')+foot(24,'#caa37f')+foot(40,'#caa37f');
 head=path('M13 26 Q12 17 23 17 L42 17 Q51 18 51 28 L52 33 Q52 41 42 42 L22 42 Q11 41 13 26Z','#d9b898')+el(37,34,12,7,'#e9cfad');
 face=cheeks(34)+el(40,32,2,1.1,'#947056')+line('M31 37Q37 38 43 37','#ac8265',.9);
 acc=path('M28 18Q25 9 36 10Q36 17 28 18Z','#a6bf98','#82997c',.6)+line('M28 18L33 12','#789171',.6)+line('M21 41L40 55','#998070',2)+path('M35 48Q42 47 44 51L43 56 35 57 33 52Z','#c39474','#917159',.8)+el(39,51,1,1,'#efd6a3');
 }
 if(id==='4'){
 // Biscuit: a cream and cocoa puppy with velvet ears and a star bandana.
 tail=path('M42 49Q54 51 54 41Q59 39 57 46Q54 56 43 54Z','#d5ab88');
 ears=path('M18 17Q9 12 7 24Q5 36 13 37Q21 37 23 22Z','#a47865')+path('M45 17Q55 13 57 25Q60 36 52 37Q44 37 42 23Z','#a47865')+el(12,24,2.2,6,'#c19982')+el(52,24,2.2,6,'#c19982');
 body=el(32,46,12,12,'#ead0ab',ink,1)+el(32,48,8,8,'#fff0d6')+paw(20,46,'#f1dcc0')+paw(44,46,'#f1dcc0')+foot(25,'#f9e5c8')+foot(39,'#f9e5c8');
 head=path('M14 26Q13 14 32 14Q50 14 50 27Q54 42 33 43Q10 42 14 26Z','#fae7c9')+path('M16 22Q18 14 26 16Q31 24 27 31Q16 33 16 22Z','#d4aa86','none')+el(32,35,8,5,'#fff4df');
 face=cheeks()+nose(31,'#735969')+line('M32 34V36M28 35Q29 39 32 36Q35 39 37 35')+path('M31 38Q32 42 34 38Z','#e7a9b6','none');
 acc=path('M23 40Q32 45 41 40L33 49Z','#a8c6e1','#809fbd',.8)+star(33,45,'#fff0b0');
 }
 if(id==='5'){
 // Ember: a little apricot fox with a luxurious tail and plum scarf.
 tail=path('M40 53Q58 61 59 36Q58 26 53 30Q49 42 40 42Z','#eab088')+path('M54 31Q60 26 59 36Q59 42 56 45L51 39Z','#fff0db','none');
 ears=path('M15 27Q10 2 20 10L30 19 35 19Q52 1 50 13L48 30Z','#ebb088')+path('M17 12L25 24 17 25Z','#e3a1a1','none')+path('M48 12L40 24 48 25Z','#e3a1a1','none');
 body=el(32,46,10.5,12,'#efbc97',ink,1)+el(32,47,6,9,'#fff2df')+paw(22,46,'#efbd99')+paw(42,46,'#efbd99')+foot(25,'#b88979')+foot(39,'#b88979');
 head=path('M14 25Q14 15 32 16Q49 15 50 26L53 32 47 35Q43 43 32 43Q20 43 17 35L11 32Z','#f5c69f')+path('M13 31Q23 30 32 36Q42 30 52 31L46 35Q43 42 32 42Q21 42 18 35Z','#fff4df','none');
 face=cheeks()+nose(33,'#7f5b67')+smile(37);
 acc=path('M23 41Q32 45 41 41L39 46Q32 48 25 45Z','#c0a6c7','#987aa4',.7)+path('M37 45Q43 47 44 52L37 51 34 46Z','#ccb2d1','#987aa4',.7);
 }
 if(id==='6'){
 // Lumi: a round lavender owl with cream facial discs and a mint bow tie.
 ears=path('M17 24L16 12Q24 12 29 20L35 20Q42 12 49 12L47 26Z','#c3b7d4');
 body=el(32,42,16,16,'#c8bfd8',ink,1.1)+el(32,45,10,11,'#fff0d8')+foot(25,'#dfbc86')+foot(39,'#dfbc86');
 wings='<g class="wing-left">'+path('M21 37Q8 33 11 45Q13 50 21 48Z','#b0a1c6')+'</g><g class="wing-right">'+path('M43 37Q56 33 53 45Q51 50 43 48Z','#b0a1c6')+'</g>';
 head=el(32,29,19,15,'#cfc6df',ink,1.1)+el(24,30,9,10,'#fff4e2')+el(40,30,9,10,'#fff4e2');
 face=cheeks(35)+path('M29 35Q32 32 35 35L32 39Z','#d4ad70','#b58e5c',.5)+line('M28 47L30 49M35 47L37 49M31 52L33 53','#d2bda0',1.2);
 acc=path('M25 41Q28 39 32 43Q37 39 40 41L39 46Q35 46 32 44Q29 46 25 45Z','#a6ccc1','#85ada0',.6)+el(32,43,1.4,1.4,'#d2e6d6');
 }
 if(id==='7'){
 // Pippin: a peach hedgehog with soft scalloped rose quills and a flower pin.
 tail=path('M14 46Q6 44 12 37Q6 30 14 28Q10 20 20 21Q21 12 28 17Q34 9 39 18Q48 13 48 22Q58 21 53 30Q62 35 54 41Q57 50 48 50L42 57H21Z','#bb99af');
 ears=el(22,24,4,4,'#f1d7c2',ink,.9)+el(43,24,4,4,'#f1d7c2',ink,.9);
 body=el(32,46,12,12,'#f0d6bd',ink,1)+el(32,47,7,9,'#fff0dc')+paw(21,46,'#f7e0cc')+paw(43,46,'#f7e0cc')+foot(25,'#e7cbb4')+foot(39,'#e7cbb4');
 head=path('M16 31Q15 22 25 23Q33 19 40 24Q48 22 49 31Q55 40 33 44Q13 41 16 31Z','#fae4cf');
 face=cheeks(35)+nose(34,'#a67b8c')+smile(37);
 acc=el(18,24,2.7,2.7,'#e2b0c1')+el(21,22,2.7,2.7,'#e2b0c1')+el(24,25,2.7,2.7,'#e2b0c1')+el(21,28,2.7,2.7,'#e2b0c1')+el(21,25,1.5,1.5,'#ffedb2');
 }
 const ex=id==='6'?24:24,ex2=id==='6'?40:40,ey=id==='4'?28:29;
 const eyes='<g class="eyes-open">'+eye(ex,ey,undefined,id==='6'?1.3:1)+eye(ex2,ey,undefined,id==='6'?1.3:1)+'</g><g class="eyes-happy">'+line('M21 '+ey+' Q24 '+(ey-3)+' 27 '+ey,'#695261',1.3)+(id==='2'?eye(ex2,ey):line('M37 '+ey+' Q40 '+(ey-3)+' 43 '+ey,'#695261',1.3))+'</g>';
 const effect=id==='3'?'<text x="51" y="15" font-family="sans-serif" font-size="8" fill="#b9a4c4">z</text>':path('M7 20C2 15 0 22 7 26C14 22 12 15 7 20Z','#efb6c9','none')+star(55,20,'#e9cf99');
 body+=path('M23 42 L41 42 L40 53 L24 53Z','#314b68','#203247')+path('M25 42 L29 44 L29 51 L24 49Z','#76aaa9','none')+path('M35 44 L39 42 L40 49 L35 51Z','#76aaa9','none')+path('M30 42 L34 42 L34 50 L30 50Z','#d7e9e0','none')+path('M29 50 L35 50 L35 53 L29 53Z','#dab56e','none');
 return '<svg class="mascot '+(performing?'is-performing':'')+'" data-animal="'+id+'" viewBox="-4 -8 72 76" shape-rendering="geometricPrecision" aria-hidden="true">'+el(32,61,14,2,'#d6c8dd80')+'<g class="rig"><g class="tail">'+tail+'</g>'+body+wings+'<g class="ears">'+ears+'</g>'+head+face+eyes+acc+'</g><g class="effects">'+effect+'</g></svg>';
}
for(const b of roster){const a=animals[b.dataset.slot];if(a){b.querySelector('.slot-placeholder').innerHTML=animalSVG(b.dataset.slot);b.querySelector('small').textContent=a.name.toUpperCase();b.setAttribute('aria-label',a.name);}}
function statsHTML(a){return [['HP','hp',200,'#86cdb2'],['Attack','attack',100,'#e6a1b9'],['DEF','def',100,'#acabe0']].map(([label,key,max,color])=>'<div class="stat-row"><span>'+label+'</span><div class="stat-track" role="meter" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+max+'" aria-valuenow="'+(a?a[key]:0)+'"><span class="stat-fill" style="--bar:'+color+';width:'+(a?a[key]/max*100:0)+'%"></span></div><span>'+(a?a[key]:'—')+'</span></div>').join('');}
