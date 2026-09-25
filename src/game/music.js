const musicPanel=document.createElement('div');musicPanel.id='music-controls';musicPanel.innerHTML='<button id="music-toggle" type="button">MUSIC</button><details><summary aria-label="Music volume settings">VOL</summary><div><label for="music-volume">MUSIC VOLUME</label><input id="music-volume" type="range" min="0" max="100" value="35"><span id="music-status" role="status">Expedition theme</span></div></details>';stage.append(musicPanel);
// Original expedition theme. One shared player persists across scenes.
const gameMusic=document.querySelector('#game-music');
const musicToggle=document.querySelector('#music-toggle'),musicVolume=document.querySelector('#music-volume');
let musicEnabled=true,musicLevel=.35,musicStarted=false;
try{const s=JSON.parse(localStorage.getItem('fight-cute-music-v1')||'null');if(s){musicEnabled=s.enabled!==false;if(Number.isFinite(s.volume))musicLevel=clamp(s.volume,0,1);}}catch{}
gameMusic.volume=musicLevel;musicVolume.value=Math.round(musicLevel*100);
function saveMusic(){try{localStorage.setItem('fight-cute-music-v1',JSON.stringify({enabled:musicEnabled,volume:musicLevel}));}catch{}}
function paintMusic(){const audible=musicEnabled&&musicLevel>0;musicToggle.textContent=audible?'MUSIC ON':'MUTED';musicToggle.setAttribute('aria-pressed',String(audible));musicToggle.setAttribute('aria-label',audible?'Mute background music':'Enable background music');}
function playMusic(){if(!musicStarted||!musicEnabled||document.hidden)return;gameMusic.play().then(()=>{document.querySelector('#music-status').textContent='Expedition theme';}).catch(()=>{document.querySelector('#music-status').textContent='Tap MUSIC to play';});}
function beginMusic(e){if(e.type==='keydown'&&['Shift','Control','Alt','Meta','Tab'].includes(e.key))return;musicStarted=true;playMusic();}
document.addEventListener('pointerdown',beginMusic,{once:true});document.addEventListener('keydown',beginMusic);
musicToggle.onclick=()=>{musicStarted=true;musicEnabled=!musicEnabled;if(musicEnabled){if(musicLevel===0){musicLevel=.35;musicVolume.value=35;gameMusic.volume=musicLevel;}playMusic();}else gameMusic.pause();saveMusic();paintMusic();};
musicVolume.oninput=()=>{musicLevel=Number(musicVolume.value)/100;gameMusic.volume=musicLevel;musicEnabled=musicLevel>0;musicStarted=true;if(musicEnabled)playMusic();else gameMusic.pause();saveMusic();paintMusic();};
document.addEventListener('visibilitychange',()=>{if(document.hidden)gameMusic.pause();else playMusic();});
gameMusic.addEventListener('error',()=>{document.querySelector('#music-status').textContent='Music unavailable';});paintMusic();
