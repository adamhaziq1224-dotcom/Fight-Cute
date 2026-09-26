// Fight Cute — character-select.js
function renderFighters(){
 for(const side of ['player','npc']){const choice=fighters[side],id=choice==='random'?randomResolved[side]:choice,a=animals[id];document.querySelector('#'+side+'-panel').classList.toggle('active',activeTarget===side);document.querySelector('[data-target="'+side+'"]').setAttribute('aria-pressed',String(activeTarget===side));document.querySelector('#'+side+'-preview').innerHTML=a?animalSVG(id,true):'—';document.querySelector('#'+side+'-name').textContent=a?a.name+(choice==='random'?' ?':''):'Belum dipilih';document.querySelector('#'+side+'-skill').textContent=a?a.skill:'Pilih haiwan untuk lihat kelebihannya.';document.querySelector('#'+side+'-stats').innerHTML=statsHTML(a);document.querySelector('#'+side+'-personality').textContent=a?personalities[id]:'';}

 for(const b of roster){const sprite=b.querySelector('.mascot');if(sprite)sprite.classList.toggle('is-performing',['player','npc'].some(side=>(fighters[side]==='random'?randomResolved[side]:fighters[side])===b.dataset.slot));const badges=b.querySelector('.slot-badges');badges.replaceChildren();for(const side of ['player','npc'])if(fighters[side]===b.dataset.slot){const badge=document.createElement('span');badge.textContent=side==='player'?'P1':'NPC';badge.className=side==='npc'?'npc-badge':'';badges.append(badge);}}
 confirmNPC.disabled=!playerConfirmed||!fighters.npc;
 confirmPlayer.disabled=!fighters.player||playerConfirmed;
 confirmPlayer.textContent=playerConfirmed?'DISAHKAN ✓':'PASTI';
 document.querySelector('[data-target="npc"]').disabled=!playerConfirmed;
 document.querySelector('#npc-panel').classList.toggle('locked',!playerConfirmed);
 if(!playerConfirmed){document.querySelector('#npc-name').textContent='Belum dibuka';document.querySelector('#npc-skill').textContent='Sahkan character Player dahulu.';}
 document.querySelector('#versus-status').textContent=!playerConfirmed?(fighters.player?'Tekan PASTI untuk sahkan Player dan teruskan ke NPC.':'Langkah 1: Pilih character Player dahulu.'):fighters.npc?'Tekan PASTI di bawah NPC untuk teruskan ke pilihan map.':'Langkah 2: Pilih character untuk NPC.';

}
function openVersus(){scene='versus';maps.hidden=true;modes.hidden=true;versus.hidden=false;activeTarget=playerConfirmed?'npc':'player';renderFighters();roster[0].focus();}
document.querySelector('#versus-back').addEventListener('click',activate);
confirmPlayer.addEventListener('click',()=>{if(!fighters.player||playerConfirmed)return;playerConfirmed=true;activeTarget='npc';renderFighters();roster[0].focus();});
targetButtons.forEach(b=>b.addEventListener('click',()=>{if(b.dataset.target==='npc'&&!playerConfirmed)return;if(b.dataset.target==='player'&&playerConfirmed){playerConfirmed=false;fighters.npc=null;randomResolved.npc=null;}activeTarget=b.dataset.target;renderFighters();}));
roster.forEach(b=>b.addEventListener('click',()=>{if(activeTarget==='npc'&&!playerConfirmed)return;fighters[activeTarget]=b.dataset.slot;if(b.dataset.slot==='random')randomResolved[activeTarget]=String(1+Math.floor(Math.random()*7));renderFighters();window.dispatchEvent(new CustomEvent('fightcute:roster-selected',{detail:{player:fighters.player==='random'?randomResolved.player:fighters.player,npc:fighters.npc==='random'?randomResolved.npc:fighters.npc}}));}));
