// Campaign content. All courses are deterministic and share the same movement rules.
const campaignLevels = [
 {name:'Skyline Relay',icon:'☁',colors:['#8d81d4','#b6dcef','#c9dfa9'],motif:'candy',lesson:'Learn ladders, jumps and your first relay terminal.',nodes:10,enemy:1,quiz:1},
 {name:'Mossy Meadows',icon:'♣',colors:['#639c98','#d3e4c1','#8cca96'],motif:'forest',lesson:'Meet roaming jelly creatures. Jump on them or press J.',nodes:11,enemy:1,quiz:1},
 {name:'Coral Coast',icon:'≈',colors:['#4ca6c5','#d9f1ee','#f3d19b'],motif:'sea',lesson:'Ride the gently moving blue platforms.',nodes:12,enemy:2,quiz:1},
 {name:'Sakura Steps',icon:'❀',colors:['#aa83b5','#f1d7e7','#efadc7'],motif:'sakura',lesson:'Watch for pink thorns on the ends of islands.',nodes:13,enemy:3,quiz:2},
 {name:'Lantern City',icon:'◈',colors:['#343767','#a276ae','#79c9d0'],motif:'city',lesson:'Flying puffballs patrol the lantern paths.',nodes:14,enemy:4,quiz:2},
 {name:'Frosted Peaks',icon:'❄',colors:['#6c94ba','#e1eff2','#b5dce5'],motif:'snow',lesson:'Cracked steps crumble: keep moving, then wait for them to return.',nodes:15,enemy:5,quiz:2},
 {name:'Lunar Archive',icon:'☾',colors:['#333961','#929aca','#c3b7df'],motif:'moon',lesson:'Gentle moon gravity gives longer jumps. Control your landing.',nodes:16,enemy:5,quiz:2},
 {name:'Clockwork Library',icon:'▤',colors:['#736785','#e3c9b1','#d3ac7e'],motif:'library',lesson:'Watch sentries charge, then dodge their slow star shots.',nodes:17,enemy:6,quiz:3},
 {name:'Storm Academy',icon:'ϟ',colors:['#505982','#adb7d3','#b4a2d5'],motif:'college',lesson:'Airborne gusts, narrow steps and mixed enemies test your timing.',nodes:18,enemy:7,quiz:3},
 {name:'Astral Citadel',icon:'♛',colors:['#6b5b9f','#e6c9de','#f0d293'],motif:'palace',lesson:'The final climb combines every lesson. Solve three relay systems.',nodes:20,enemy:9,quiz:3}
];
const campaignQuestions = [
 ['You collect 2 pink sweets and 3 blue sweets. How many sweets?', ['4','5','6'],1,'Count on from 2: 3, 4, 5.'],
 ['Which comes next: leaf, flower, leaf, flower, …?', ['Leaf','Cloud','Flower'],0,'The two shapes alternate.'],
 ['Four shells are on the beach. You find four more. Total?', ['6','7','8'],2,'Four plus four is eight.'],
 ['Three branches each have 2 blossoms. How many blossoms?', ['5','6','8'],1,'Add 2 + 2 + 2.'],
 ['Which number is even?', ['9','11','12'],2,'An even number can be split into two equal whole-number groups.'],
 ['A lantern flashes every 5 seconds. How long for 3 intervals?', ['15 seconds','8 seconds','20 seconds'],0,'Three intervals: 5 + 5 + 5.'],
 ['What comes next: 3, 6, 9, …?', ['10','12','15'],1,'Add three each time.'],
 ['You have 20 snowflakes and give away 7. How many remain?', ['12','14','13'],2,'20 minus 7 equals 13.'],
 ['Four explorers share 12 berries equally. Each gets…', ['3','4','6'],0,'Find the number that gives 12 when multiplied by 4.'],
 ['A moon rover travels 6 steps each minute. In 4 minutes?', ['10','24','18'],1,'Multiply 6 by 4.'],
 ['What comes next: 1, 2, 4, 8, …?', ['10','12','16'],2,'Each number doubles.'],
 ['A book has 30 pages. You read one third. Pages read?', ['10','15','20'],0,'Divide 30 into three equal parts.'],
 ['Which is equivalent to one half?', ['1/3','2/4','3/4'],1,'Two of four equal parts make half.'],
 ['It is 2:45. What time is it 30 minutes later?', ['3:00','3:45','3:15'],2,'15 minutes to 3:00, then 15 more.'],
 ['Three equal notebooks cost 18 coins. Two notebooks cost…', ['12 coins','9 coins','15 coins'],0,'One costs 18 ÷ 3 = 6. Two cost 12.'],
 ['What comes next: 2, 5, 8, 11, …?', ['13','14','16'],1,'The difference between neighbours is three.'],
 ['A square has sides of 7 steps. Its perimeter is…', ['14','21','28'],2,'Add all four sides: 7 × 4.'],
 ['A chest holds 24 gems. Half are blue; half of those are shiny. Shiny blue gems?', ['6','8','12'],0,'Half of 24 is 12. Half of 12 is 6.'],
 ['A code follows 2, 6, 12, 20, … What is next?', ['28','30','32'],1,'The gaps are 4, 6, 8, then 10.'],
 ['Two keys and a crown weigh 14 units. The crown weighs 8. Each equal key weighs…', ['2','4','3'],2,'Subtract 8, then divide the remaining 6 by two.']
];
function createCampaignCourse(level){
 const def=campaignLevels[level-1],platforms=[],ladders=[],coins=[],enemies=[],spikes=[],gates=[];
 const bottom=level===1?1000:1060+level*48;
 let x=level%2?120:500,y=bottom,dir=x<320?1:-1;
 for(let i=0;i<def.nodes;i++){
  const ladder=i>0&&i%3===1;
  if(i){if(ladder)y-=100+Math.min(level*2,20);else{y-=38+Math.min(level,9);x+=dir*(86+Math.min(level*2,16));if(x>515){x=510;dir=-1;}if(x<125){x=130;dir=1;}}}
  const safe=i===0||ladder||i===def.nodes-1;
  const w=safe?160:Math.max(64,104-level*4);
  const f={x:x-w/2,baseX:x-w/2,y,w,type:safe?'grass':'donut',checkpoint:safe,index:i,move:!safe&&level>=3&&i%3===2?8+level:0,crumble:!safe&&level>=6&&i%3===0,age:0,absent:0};
  platforms.push(f);
  if(ladder)ladders.push({x,top:y,bottom:platforms[i-1].y});
  coins.push([x,y-27]);if(ladder)coins.push([x,y+50]);
 }
 const candidates=platforms.filter(f=>f.checkpoint&&f.index>0&&f.index<def.nodes-1);
 for(let q=0;q<def.quiz;q++){const f=candidates[Math.min(candidates.length-1,Math.floor(q*candidates.length/def.quiz))];gates.push({x:f.baseX+f.w/2,y:f.y,solved:false,question:campaignQuestions[campaignLevels.slice(0,level-1).reduce((n,d)=>n+d.quiz,0)+q]});}
 const hostile=platforms.filter(f=>f.index>1&&f.index<def.nodes-1&&!gates.some(q=>q.y===f.y));
 for(let i=0;i<Math.min(def.enemy+1,hostile.length);i++){const f=hostile[i],kind=level>=8&&i%3===2?'sentry':level>=5&&i%3===1?'flyer':'jelly';enemies.push({platform:f.index,x:f.x+f.w*.65,y:f.y-10,kind,dead:false,dir:i%2?1:-1,speed:22+level*3,fire:2.5+i*.3});}
 if(level>=4)for(const f of platforms.filter(f=>f.checkpoint&&f.index>1&&f.index<def.nodes-1&&!gates.some(q=>q.y===f.y))){spikes.push({x:f.baseX+9,y:f.y});}
 return {def,level,platforms,ladders,coins,enemies,spikes,gates,bottom,top:y,spawn:{x:platforms[0].x+80,y:bottom},goal:{x,y},gravity:level===7?480:660};
}
