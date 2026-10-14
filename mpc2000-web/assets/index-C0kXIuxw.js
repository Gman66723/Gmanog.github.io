(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function l(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();const U=["A","B","C","D"],B=["1","2","3","4","q","w","e","r","a","s","d","f","z","x","c","v"],u=U.map(()=>Array.from({length:16},()=>({steps:Array(16).fill(!1)})));let h,c=0,m=0,v=-1,P=0,O,L=!1,R=!1,w=120,T=54;const Y=document.querySelector("#app");Y.innerHTML=`
  <main class="machine">
    <header class="topbar">
      <div class="brand"><span>AKAI-style</span><strong>MPC 2000 WEB</strong></div>
      <div class="status-dot" title="Web Audio sampler"></div>
    </header>

    <section class="work-area">
      <div class="left-panel">
        <div class="display-shell">
          <div class="display">
            <div class="display-head"><span>PROGRAM 01</span><span id="clock">STOP</span></div>
            <div class="screen-main">
              <div><small>PAD</small><b id="screen-pad">A01</b></div>
              <div class="sample-name"><small>SAMPLE</small><b id="screen-name">— EMPTY —</b></div>
              <div><small>BPM</small><b id="screen-bpm">120.0</b></div>
            </div>
            <canvas id="waveform" width="640" height="108"></canvas>
            <div class="soft-labels"><span>LOAD</span><span>TRIM</span><span>PARAMS</span><span>SEQUENCE</span></div>
          </div>
        </div>

        <div class="editor">
          <label class="load-button"><span id="load-label">ASSIGN SAMPLE TO A01</span><input id="file-input" type="file" accept="audio/*" hidden></label>
          <button id="clear-sample">CLEAR PAD</button>
          <div class="parameter"><label>START <output id="start-out">0%</output></label><input id="sample-start" type="range" min="0" max="95" value="0"></div>
          <div class="parameter"><label>END <output id="end-out">100%</output></label><input id="sample-end" type="range" min="5" max="100" value="100"></div>
          <div class="parameter"><label>LEVEL <output id="level-out">100%</output></label><input id="sample-level" type="range" min="0" max="150" value="100"></div>
          <div class="parameter"><label>TUNE <output id="tune-out">0 st</output></label><input id="sample-tune" type="range" min="-24" max="24" value="0"></div>
        </div>
      </div>

      <div class="right-panel">
        <div class="bank-row" id="banks"></div>
        <div class="pads" id="pads"></div>
        <div class="drop-hint">Drop an audio file onto any pad · Keys 1–4 / Q–R / A–F / Z–V</div>
      </div>
    </section>

    <section class="sequencer-panel">
      <div class="transport">
        <button id="play" class="transport-button">▶ PLAY</button>
        <button id="stop" class="transport-button">■ STOP</button>
        <button id="record" class="transport-button record">● REC</button>
      </div>
      <div class="tempo-control"><label>BPM <input id="bpm" type="number" min="40" max="300" value="120" step="0.1"></label><label>SWING <input id="swing" type="number" min="50" max="75" value="54">%</label></div>
      <div class="steps-wrap">
        <div class="steps-label"><span id="sequence-label">PAD A01</span><span>1 BAR / 16 STEPS</span></div>
        <div class="steps" id="steps"></div>
      </div>
      <button id="export" class="export-button">EXPORT LOOP</button>
    </section>
  </main>
  <footer>Independent browser sampler inspired by the MPC2000XL workflow. No Akai firmware required.</footer>
`;const s=e=>document.querySelector(e),y=s("#pads"),I=s("#banks"),j=s("#steps"),x=s("#file-input"),C=s("#waveform");function A(){return h||(h=new AudioContext),h.state==="suspended"&&h.resume(),h}function g(e=m){return`${U[c]}${String(e+1).padStart(2,"0")}`}function q(){I.innerHTML=U.map((e,t)=>`<button class="bank ${t===c?"active":""}" data-bank="${t}">BANK ${e}</button>`).join("")}function S(){y.innerHTML=u[c].map((e,t)=>{var n;return`
    <button class="pad ${t===m?"selected":""} ${e.sample?"loaded":""}" data-pad="${t}" title="${e.sample?`Replace ${e.sample.name}`:`Assign a sample to ${g(t)}`}">
      <span class="pad-number">${t+1}</span>
      <span class="pad-name">${((n=e.sample)==null?void 0:n.name)??B[t].toUpperCase()}</span>
    </button>`}).join("")}function b(){const e=u[c][m].steps;j.innerHTML=e.map((t,n)=>`<button class="step ${t?"on":""} ${n===v?"current":""}" data-step="${n}"><span>${n+1}</span></button>`).join("")}function E(){const e=u[c][m].sample;s("#screen-pad").textContent=g(),s("#sequence-label").textContent=`PAD ${g()}`,s("#screen-name").textContent=(e==null?void 0:e.name.toUpperCase())??"— EMPTY —",s("#load-label").textContent=e?`REPLACE SAMPLE ON ${g()}`:`ASSIGN SAMPLE TO ${g()}`;const t=s("#sample-start"),n=s("#sample-end"),l=s("#sample-level"),a=s("#sample-tune");t.value=String(Math.round(((e==null?void 0:e.start)??0)*100)),n.value=String(Math.round(((e==null?void 0:e.end)??1)*100)),l.value=String(Math.round(((e==null?void 0:e.level)??1)*100)),a.value=String((e==null?void 0:e.tune)??0),$(),G()}function $(){s("#start-out").textContent=`${s("#sample-start").value}%`,s("#end-out").textContent=`${s("#sample-end").value}%`,s("#level-out").textContent=`${s("#sample-level").value}%`,s("#tune-out").textContent=`${s("#sample-tune").value} st`}function G(){const e=C.getContext("2d"),t=C.width,n=C.height;e.clearRect(0,0,t,n),e.fillStyle="#a8c89b",e.fillRect(0,0,t,n),e.strokeStyle="rgba(23, 43, 29, .18)";for(let o=0;o<t;o+=40)e.beginPath(),e.moveTo(o,0),e.lineTo(o,n),e.stroke();const l=u[c][m].sample;if(!l){e.fillStyle="#314735",e.font="18px monospace",e.textAlign="center",e.fillText("LOAD OR DROP A SAMPLE",t/2,n/2+6);return}const a=l.buffer.getChannelData(0),r=Math.max(1,Math.floor(a.length/t));e.strokeStyle="#172b1d",e.lineWidth=1.5,e.beginPath();for(let o=0;o<t;o++){let i=0;for(let d=0;d<r;d++)i=Math.max(i,Math.abs(a[o*r+d]??0));e.moveTo(o,n/2-i*n*.45),e.lineTo(o,n/2+i*n*.45)}e.stroke(),e.fillStyle="rgba(190, 56, 36, .38)",e.fillRect(0,0,l.start*t,n),e.fillRect(l.end*t,0,(1-l.end)*t,n)}async function W(e,t=m){if(!e.type.startsWith("audio/"))return;const l=await A().decodeAudioData(await e.arrayBuffer()),a=u[c][t].sample;a&&URL.revokeObjectURL(a.url),u[c][t].sample={name:e.name.replace(/\.[^.]+$/,"").slice(0,18),buffer:l,start:0,end:1,level:1,tune:0,url:URL.createObjectURL(e)},m=t,S(),b(),E(),k(t,1)}function k(e,t=.88,n,l){const a=u[c][e].sample,r=document.querySelector(`.pad[data-pad="${e}"]`);if(r==null||r.classList.add("hit"),window.setTimeout(()=>r==null?void 0:r.classList.remove("hit"),90),R&&L&&n===void 0&&v>=0&&(u[c][e].steps[v]=!0,e===m&&b()),!a)return;const o=A(),i=o.createBufferSource(),d=o.createGain();i.buffer=a.buffer,i.playbackRate.value=2**(a.tune/12),d.gain.value=a.level*t,i.connect(d).connect(o.destination);const f=a.start*a.buffer.duration,p=Math.max(.01,(a.end-a.start)*a.buffer.duration);i.start(n??o.currentTime,f,p)}function H(e){m=e,S(),b(),E()}function N(){return 60/w/4}function V(e,t){u[c].forEach((l,a)=>{l.steps[e]&&k(a,.9,t)});const n=Math.max(0,(t-A().currentTime)*1e3);window.setTimeout(()=>{v=e,b(),s("#clock").textContent=`PLAY ${String(e+1).padStart(2,"0")}`},n)}function Q(){const e=A();for(;P<e.currentTime+.1;){v=(v+1)%16,V(v,P);const t=v%2===0?(T-50)/50:-(T-50)/50;P+=N()*(1+t*.34)}}function K(){L||(L=!0,v=-1,P=A().currentTime+.05,O=window.setInterval(Q,25),s("#play").classList.add("active"))}function F(){L=!1,O&&window.clearInterval(O),v=-1,s("#clock").textContent="STOP",s("#play").classList.remove("active"),b()}async function X(){const e=60/w*4,t=44100,n=new OfflineAudioContext(2,Math.ceil(e*t),t);for(let o=0;o<16;o++){const i=o*N(),d=o%2===1?N()*((T-50)/50)*.34:0;u[c].forEach(f=>{const p=f.sample;if(!f.steps[o]||!p)return;const M=n.createBufferSource(),D=n.createGain();M.buffer=p.buffer,M.playbackRate.value=2**(p.tune/12),D.gain.value=p.level*.9,M.connect(D).connect(n.destination),M.start(i+d,p.start*p.buffer.duration,Math.max(.01,(p.end-p.start)*p.buffer.duration))})}const l=await n.startRendering(),a=z(l),r=document.createElement("a");r.href=URL.createObjectURL(a),r.download=`mpc-loop-${Math.round(w)}bpm.wav`,r.click(),window.setTimeout(()=>URL.revokeObjectURL(r.href),1e3)}function z(e){const t=Math.min(2,e.numberOfChannels),n=44+e.length*t*2,l=new ArrayBuffer(n),a=new DataView(l),r=(i,d)=>[...d].forEach((f,p)=>a.setUint8(i+p,f.charCodeAt(0)));r(0,"RIFF"),a.setUint32(4,n-8,!0),r(8,"WAVE"),r(12,"fmt "),a.setUint32(16,16,!0),a.setUint16(20,1,!0),a.setUint16(22,t,!0),a.setUint32(24,e.sampleRate,!0),a.setUint32(28,e.sampleRate*t*2,!0),a.setUint16(32,t*2,!0),a.setUint16(34,16,!0),r(36,"data"),a.setUint32(40,n-44,!0);let o=44;for(let i=0;i<e.length;i++)for(let d=0;d<t;d++){const f=Math.max(-1,Math.min(1,e.getChannelData(d)[i]));a.setInt16(o,f<0?f*32768:f*32767,!0),o+=2}return new Blob([l],{type:"audio/wav"})}I.addEventListener("click",e=>{const t=e.target.closest("[data-bank]");t&&(c=Number(t.dataset.bank),q(),S(),b(),E())});y.addEventListener("pointerdown",e=>{const t=e.target.closest("[data-pad]");if(!t)return;const n=Number(t.dataset.pad);H(n),k(n)});y.addEventListener("dragover",e=>{var t;e.preventDefault(),(t=e.target.closest(".pad"))==null||t.classList.add("drag")});y.addEventListener("dragleave",e=>{var t;return(t=e.target.closest(".pad"))==null?void 0:t.classList.remove("drag")});y.addEventListener("drop",e=>{var l;e.preventDefault();const t=e.target.closest("[data-pad]");t==null||t.classList.remove("drag");const n=(l=e.dataTransfer)==null?void 0:l.files[0];t&&n&&W(n,Number(t.dataset.pad))});j.addEventListener("click",e=>{const t=e.target.closest("[data-step]");if(!t)return;const n=Number(t.dataset.step);u[c][m].steps[n]=!u[c][m].steps[n],b()});x.addEventListener("change",()=>{var e;(e=x.files)!=null&&e[0]&&W(x.files[0]),x.value=""});s("#clear-sample").addEventListener("click",()=>{const e=u[c][m];e.sample&&URL.revokeObjectURL(e.sample.url),delete e.sample,S(),E()});for(const e of["sample-start","sample-end","sample-level","sample-tune"])s(`#${e}`).addEventListener("input",()=>{const t=u[c][m].sample;if(!t)return $();const n=Number(s("#sample-start").value)/100,l=Number(s("#sample-end").value)/100;t.start=Math.min(n,l-.01),t.end=Math.max(l,n+.01),t.level=Number(s("#sample-level").value)/100,t.tune=Number(s("#sample-tune").value),$(),G()});s("#play").addEventListener("click",K);s("#stop").addEventListener("click",F);s("#record").addEventListener("click",()=>{R=!R,s("#record").classList.toggle("active",R)});s("#export").addEventListener("click",()=>void X());s("#bpm").addEventListener("input",e=>{w=Math.max(40,Math.min(300,Number(e.target.value))),s("#screen-bpm").textContent=w.toFixed(1)});s("#swing").addEventListener("input",e=>{T=Math.max(50,Math.min(75,Number(e.target.value)))});window.addEventListener("keydown",e=>{if(e.repeat||["INPUT","BUTTON"].includes(e.target.tagName))return;const t=B.indexOf(e.key.toLowerCase());t>=0&&(e.preventDefault(),k(t,1)),e.code==="Space"&&(e.preventDefault(),L?F():K())});q();S();b();E();
