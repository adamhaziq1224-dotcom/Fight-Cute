// Fight Cute — loading.js
const loadingScreen=document.querySelector('#loading-screen');
let loadingRun=0,loadingTimer=null;
const clubTips=[
 'Capybara mempunyai HP dan pertahanan tertinggi. Sesuai untuk gaya bermain yang tenang.',
 'Arnab pantas dan ceria. Pilihan yang sesuai untuk peminat serangan laju.',
 'Landak mempunyai Attack tertinggi dalam kelab. Kecil-kecil cili padi!',
 'Puppy gemar menyambung kombo. Bijak, setia, dan sentiasa teruja.',
 'Fox terkenal dengan gerakan laju dan ekor berpusingnya.',
 'Owl pakar serangan udara. Si kecil yang sentiasa ingin tahu.',
 'Kucing menggabungkan cakaran kuat dengan pergerakan tangkas.'
];
let nextTip=Math.floor(Math.random()*clubTips.length);
function leaveLoading(){loadingRun++;clearTimeout(loadingTimer);loadingScreen.hidden=true;loadingScreen.setAttribute('aria-busy','false');openMaps();}
document.querySelector('#loading-back').addEventListener('click',leaveLoading);
async function openLoading(){
 const run=++loadingRun;clearTimeout(loadingTimer);scene='loading';maps.hidden=true;loadingScreen.hidden=false;loadingScreen.classList.remove('ready');loadingScreen.setAttribute('aria-busy','true');
 document.querySelector('#loading-map').textContent=mapNames[selectedMap-1].toUpperCase();
 document.querySelector('#loading-tip').textContent=clubTips[nextTip++%clubTips.length];
 document.querySelector('#loading-bunny').innerHTML=animalSVG('1',true);
 document.querySelector('#loading-title').innerHTML='Loading<span class="loading-dots" aria-hidden="true">...</span>';
 document.querySelector('#loading-detail').textContent='Menyiapkan arena pilihan anda.';
 document.querySelector('#loading-title').focus();
 // Prepare the procedural arena; the short minimum display lets the tip be read.
 const img=document.querySelector('.map-card[data-map="'+selectedMap+'"] img');
 let deadline;
 try{
  await Promise.all([Promise.race([arenaImage(selectedMap),new Promise((_,reject)=>{deadline=setTimeout(()=>reject(new Error('Map loading timed out')),15000);})]),new Promise(resolve=>{loadingTimer=setTimeout(resolve,3600);})]);
  if(run!==loadingRun||scene!=='loading')return;
  loadingScreen.classList.add('ready');loadingScreen.setAttribute('aria-busy','false');
  document.querySelector('#loading-title').textContent='Ready!';
  document.querySelector('#loading-detail').textContent='Arena sudah sedia. Bersedia untuk bertarung!';
  window.dispatchEvent(new CustomEvent('fightcute:arena-ready',{detail:{map:selectedMap,player:fighters.player==='random'?randomResolved.player:fighters.player,npc:fighters.npc==='random'?randomResolved.npc:fighters.npc}}));
  await beginMatch(selectedMap);
 }catch(error){if(run!==loadingRun||scene!=='loading')return;loadingScreen.setAttribute('aria-busy','false');document.querySelector('#loading-title').textContent='Cuba lagi';document.querySelector('#loading-detail').textContent='Arena belum dapat disediakan. Kembali dan pilih map semula.';}
 finally{clearTimeout(deadline);}
}
