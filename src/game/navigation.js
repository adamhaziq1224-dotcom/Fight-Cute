// Fight Cute — navigation.js
const maps=document.querySelector('#maps');
const versus=document.querySelector('#versus');
const levels=document.querySelector('#levels'),levelButtons=[...document.querySelectorAll('.level-tile')];
let selectedLevel=null;
const modeButtons=[...document.querySelectorAll('.mode-card')],status=document.querySelector('#mode-status');
function activate(){pressed=false;hover=false;scene='modes';maps.hidden=true;versus.hidden=true;levels.hidden=true;start.hidden=true;modes.hidden=false;window.dispatchEvent(new CustomEvent('fightcute:start'));modeButtons.find(b=>b.dataset.mode===selectedMode)?.focus();if(!selectedMode)modeButtons[0].focus();}
function back(){scene='title';maps.hidden=true;versus.hidden=true;levels.hidden=true;modes.hidden=true;start.hidden=false;start.focus();}
document.querySelector('#back').addEventListener('click',back);
start.addEventListener('click',activate);
const modeNames={free:'Free Mode',versus:'1 vs 1 Mode',challenge:'Challenge Mode'};
modeButtons.forEach(b=>b.addEventListener('click',()=>{selectedMode=b.dataset.mode;modeButtons.forEach(c=>c.setAttribute('aria-pressed',String(c===b)));status.textContent=modeNames[selectedMode]+' dipilih. Gameplay untuk mode ini belum tersedia.';window.dispatchEvent(new CustomEvent('fightcute:mode-selected',{detail:{mode:selectedMode}}));if(selectedMode==='challenge')openLevels();if(selectedMode==='versus')openVersus();}));
function openLevels(){refreshChallengeStars();scene='levels';modes.hidden=true;levels.hidden=false;levelButtons[(selectedLevel||1)-1].focus();}
document.querySelector('#levels-back').addEventListener('click',activate);
levelButtons.forEach(b=>b.addEventListener('click',()=>{selectedLevel=Number(b.dataset.level);levelButtons.forEach(c=>c.setAttribute('aria-pressed',String(c===b)));document.querySelector('#level-status').textContent='Level '+selectedLevel+' dipilih. Pilih character untuk bermula.';window.dispatchEvent(new CustomEvent('fightcute:level-selected',{detail:{mode:'challenge',level:selectedLevel}}));}));
const roster=[...document.querySelectorAll('.roster-slot')],targetButtons=[...document.querySelectorAll('[data-target]')];
let playerConfirmed=false;
const confirmPlayer=document.querySelector('#confirm-player'),confirmNPC=document.querySelector('#confirm-npc');
let activeTarget='player';const fighters={player:null,npc:null};
