// Deterministic, reversible puzzle boards. Every scramble is built with legal moves.
function createRelayPuzzle(seed,difficulty){
 const dial=seed%2===1,n=dial?Math.min(6,4+Math.floor(difficulty/4)):(difficulty>=6?4:3),mod=dial?4:2,count=dial?n:n*n;
 const cells=Array(count).fill(0),moves=[];let rng=(seed+1)*971+difficulty*37;
 function affected(i){if(dial)return[i,(i+1)%n];const x=i%n,y=Math.floor(i/n);return [i,...(x?[i-1]:[]),...(x<n-1?[i+1]:[]),...(y?[i-n]:[]),...(y<n-1?[i+n]:[])];}
 function turn(i,dir=1){for(const k of affected(i))cells[k]=(cells[k]+dir+mod)%mod;}
 for(let k=0;k<5+difficulty*2;k++){rng=(rng*1664525+1013904223)>>>0;const i=rng%count;turn(i);moves.push(i);}
 if(cells.every(x=>x===0)){turn(0);moves.push(0);}
 return {dial,n,mod,cells,moves,turn,initial:[...cells]};
}
function mountRelayPuzzle(host,seed,difficulty,onSolved,onAssist=()=>{}){
 const model=createRelayPuzzle(seed,difficulty);let turns=0,done=false;const history=[];
 host.replaceChildren();host.className='relay-host';host._relay=model;
 const desc=document.createElement('p');desc.className='relay-instruction';desc.textContent=model.dial?'PHASE LOCK · Set every dial to NORTH. Each turn rotates this dial and its next neighbour clockwise. The last links back to the first.':'SIGNAL MATRIX · Switch every cell OFF. Selecting a cell flips itself and its direct neighbours. Plan the sequence; order does not matter.';
 const board=document.createElement('div');board.className='relay-board';board.style.setProperty('--columns',model.dial?model.n:model.n);board.setAttribute('role','group');board.setAttribute('aria-label',model.dial?'Linked phase dials':'Signal matrix');
 const status=document.createElement('p');status.className='relay-status';status.setAttribute('role','status');
 const actions=document.createElement('div');actions.className='relay-actions';
 function render(){[...board.children].forEach((b,i)=>{const v=model.cells[i];b.textContent=model.dial?['↑','→','↓','←'][v]:v?'◆':'·';b.dataset.state=v;b.setAttribute('aria-label',`Cell ${i+1}: ${model.dial?['north','east','south','west'][v]:v?'on':'off'}`);b.disabled=done;});status.textContent=done?'SYSTEM ONLINE · Gate unlocked':`${turns} moves · ${model.cells.filter(Boolean).length} ${model.dial?'misaligned':'active'}`;}
 model.cells.forEach((_,i)=>{const b=document.createElement('button');b.className='relay-cell';b.onclick=()=>{if(done)return;model.turn(i);history.push(i);turns++;done=model.cells.every(v=>v===0);render();if(done)onSolved();};board.append(b);});
 for(const [label,fn] of [['UNDO',()=>{if(history.length){model.turn(history.pop(),-1);turns++;}}],['RESET',()=>{model.cells.splice(0,model.cells.length,...model.initial);history.length=0;turns=0;}],['HINT',()=>{onAssist();status.textContent=model.dial?'Work around the ring: each dial is affected only by itself and the previous dial. Record how many quarter-turns each needs.':'Try clearing the top row first. Click the cell directly below each lit cell, then repeat row by row. If the bottom stays lit, adjust the first-row pattern.';return true;}]]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{if(done)return;if(!fn())render();};actions.append(b);}
 host.append(desc,board,status,actions);render();board.firstElementChild.focus();return model;
}
