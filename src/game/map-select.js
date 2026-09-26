// Fight Cute — map-select.js
const mapButtons=[...document.querySelectorAll('.map-card')];
const mapNames=['Palm Beach','Sakura Katana','China Neon City','Sky Kingdom','Moonlight','Cozy Library','College Campus'];
let selectedMap=null,selectedMapSlot=null;
function openMaps(){if(!playerConfirmed||!fighters.npc)return;scene='maps';versus.hidden=true;maps.hidden=false;(mapButtons.find(b=>b.dataset.map===selectedMapSlot)||mapButtons[0]).focus();}
confirmNPC.addEventListener('click',openMaps);
document.querySelector('#maps-back').addEventListener('click',()=>{openVersus();confirmNPC.focus();});
mapButtons.forEach(b=>b.addEventListener('click',()=>{selectedMapSlot=b.dataset.map;selectedMap=selectedMapSlot==='random'?1+Math.floor(Math.random()*7):Number(selectedMapSlot);mapButtons.forEach(c=>c.setAttribute('aria-pressed',String(c===b)));document.querySelector('#map-status').textContent=(selectedMapSlot==='random'?'Random memilih: ':'Map dipilih: ')+mapNames[selectedMap-1]+'. Menyiapkan pertarungan…';window.dispatchEvent(new CustomEvent('fightcute:map-selected',{detail:{map:selectedMap,player:fighters.player==='random'?randomResolved.player:fighters.player,npc:fighters.npc==='random'?randomResolved.npc:fighters.npc}}));openLoading();}));
addEventListener('keydown',e=>{if(scene==='title'&&e.key==='Enter'&&document.activeElement!==start){e.preventDefault();activate();}else if(scene==='loading'){if(e.key==='Escape'){e.preventDefault();leaveLoading();}}else if(scene==='maps'){if(e.key==='Escape'){e.preventDefault();openVersus();confirmNPC.focus();}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();let i=mapButtons.indexOf(document.activeElement);i=i<0?0:(i+({ArrowLeft:7,ArrowRight:1,ArrowUp:4,ArrowDown:4}[e.key]))%8;mapButtons[i].focus();}}else if(scene==='versus'){if(e.key==='Escape'){e.preventDefault();activate();}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();let i=roster.indexOf(document.activeElement);if(i<0)i=0;else i=(i+({ArrowLeft:7,ArrowRight:1,ArrowUp:4,ArrowDown:4}[e.key]))%8;roster[i].focus();}}else if(scene==='levels'){if(e.key==='Escape'){e.preventDefault();activate();}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();let i=levelButtons.indexOf(document.activeElement);if(i<0)i=0;else if(e.key==='ArrowRight')i=(i+1)%10;else if(e.key==='ArrowLeft')i=(i+9)%10;else i=(i+5)%10;for(let tries=0;tries<10&&levelButtons[i].disabled;tries++)i=(i+1)%10;levelButtons[i].focus();}}else if(scene==='modes'){if(e.key==='Escape'){e.preventDefault();back();}else if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const i=modeButtons.indexOf(document.activeElement);modeButtons[(i+(e.key==='ArrowRight'?1:2)+3)%3].focus();}}});

// A display treatment only: the full-resolution embedded images remain available.
async function pixelateMapPreviews(){
 await Promise.all([...document.querySelectorAll('.map-card img')].map(async img=>{
  try{
   await img.decode();
   const tile=document.createElement('canvas');tile.className='map-pixel';tile.width=128;tile.height=72;tile.setAttribute('role','img');tile.setAttribute('aria-label',img.alt);
   const g=tile.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.filter='saturate(.88) contrast(.93) brightness(1.05)';
   const ratio=tile.width/tile.height,sourceRatio=img.naturalWidth/img.naturalHeight;let sw=img.naturalWidth,sh=img.naturalHeight;
   if(sourceRatio>ratio)sw=sh*ratio;else sh=sw/ratio;
   g.drawImage(img,(img.naturalWidth-sw)/2,(img.naturalHeight-sh)/2,sw,sh,0,0,tile.width,tile.height);
   img.after(tile);img.closest('.map-card').classList.add('pixel-ready');
  }catch(error){console.warn('Using original map preview:',img.alt);}
 }));
}
// Procedural retro previews are painted by retro-art.js.
