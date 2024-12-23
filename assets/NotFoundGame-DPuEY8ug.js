import{c as u,r as h,j as e}from"./index-r1yXczDT.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=u("Cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=u("Ghost",[["path",{d:"M9 10h.01",key:"qbtxuw"}],["path",{d:"M15 10h.01",key:"1qmjsl"}],["path",{d:"M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",key:"uwwb07"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=u("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=u("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=u("Star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=u("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=u("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),M=[{icon:L,name:"cloud"},{icon:F,name:"star"},{icon:Z,name:"moon"},{icon:H,name:"sun"},{icon:q,name:"heart"},{icon:W,name:"zap"}],y=3,o=48,S=64,Y=404,C=15e3,$=()=>{const[c,m]=h.useState("waiting"),[N,v]=h.useState(0),[j,p]=h.useState([]),[s,I]=h.useState({width:0,height:0}),b=h.useRef(null);h.useEffect(()=>{const t=document.createElement("style");return t.textContent=`
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      .animate-fade-in {
        animation: fadeIn 1s ease-out forwards;
      }
      .animate-fade-out {
        animation: fadeOut 1s ease-out forwards;
      }
    `,document.head.appendChild(t),()=>document.head.removeChild(t)},[]),h.useEffect(()=>{if(c!=="waiting")return;const t=document.querySelector(".ghost-container"),a=setTimeout(()=>{t&&t.classList.add("animate-fade-out")},C-1e3),n=setTimeout(()=>{m("intro")},C);return()=>{clearTimeout(a),clearTimeout(n)}},[c]);const E=h.useCallback(()=>{if(!s.width||!s.height)return 30;const t=s.width*s.height,a=o*o;return Math.min(Math.floor(t/(a*6)),40)},[s]);h.useEffect(()=>{const t=()=>{b.current&&I({width:b.current.clientWidth,height:b.current.clientHeight})};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]);const T=t=>{for(let a=0;a<t.length;a++)for(let n=a+1;n<t.length;n++){const r=t[a],i=t[n],l=i.x-r.x,d=i.y-r.y,x=Math.sqrt(l*l+d*d);if(x<o){const g=r.dx,G=r.dy;r.dx=i.dx,r.dy=i.dy,i.dx=g,i.dy=G;const w=o-x,k=Math.atan2(d,l);r.x-=w/2*Math.cos(k),r.y-=w/2*Math.sin(k),i.x+=w/2*Math.cos(k),i.y+=w/2*Math.sin(k)}}return[...t]},z=()=>{const t={id:0,x:Math.random()*(s.width-o),y:Math.random()*(s.height-o),dx:(Math.random()-.5)*y,dy:(Math.random()-.5)*y,type:"ghost"};p([t]),m("playing")};h.useEffect(()=>{if(c!=="playing")return;let t;const a=()=>{p(n=>{const r=n.map(i=>{let{x:l,y:d,dx:x,dy:g}=i;return l+=x,d+=g,(l<=0||l>=s.width-o)&&(x=-x,l=l<=0?0:s.width-o),(d<=0||d>=s.height-o)&&(g=-g,d=d<=0?0:s.height-o),{...i,x:l,y:d,dx:x,dy:g}});return T(r)}),t=requestAnimationFrame(a)};return a(),()=>cancelAnimationFrame(t)},[c,s]);const A=t=>{if(t.type==="ghost"){const a=N+1;if(v(a),a>=Y){m("win");return}const n=j.map(r=>r.type==="ghost"?{...r,x:Math.random()*(s.width-o),y:Math.random()*(s.height-o),dx:(Math.random()-.5)*y,dy:(Math.random()-.5)*y}:r);if(j.length<E()){const r=M[Math.floor(Math.random()*M.length)],i={id:j.length,x:Math.random()*(s.width-o),y:Math.random()*(s.height-o),dx:(Math.random()-.5)*y,dy:(Math.random()-.5)*y,type:r.name};n.push(i)}p(n)}else m("gameOver")},O=t=>{var a;return t==="ghost"?f:((a=M.find(n=>n.name===t))==null?void 0:a.icon)||f};return e.jsx("div",{className:"p-6",children:e.jsxs("div",{ref:b,className:"relative h-96 bg-white dark:bg-gray-900 rounded-lg overflow-hidden",children:[c==="waiting"&&e.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center text-center",children:[e.jsx("div",{className:"ghost-container animate-fade-in",children:e.jsx(f,{className:"w-32 h-32 text-gray-400 mb-8 transition-all duration-1000 animate-float"})}),e.jsx("h1",{className:"text-5xl font-bold text-gray-700 dark:text-gray-100 mb-6 animate-fade-in",children:"No game here..."}),e.jsx("p",{className:"text-2xl text-gray-500 dark:text-gray-400 animate-fade-in",children:"Maybe try one of our other games?"})]}),c==="intro"&&e.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center text-center animate-fade-in",children:[e.jsx("h2",{className:"text-4xl font-bold text-gray-700 dark:text-gray-100 mb-6",children:"Wait... where did our ghost go?"}),e.jsx("p",{className:"text-xl text-gray-600 dark:text-gray-300 mb-8",children:"It was just here a moment ago..."}),e.jsx("button",{onClick:()=>m("instructions"),className:"px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium",children:"Help us find it!"})]}),c==="instructions"&&e.jsx("div",{className:"absolute inset-0 flex flex-col items-center justify-center p-8 text-center",children:e.jsxs("div",{className:"max-w-md space-y-6",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-700 dark:text-gray-100",children:"A strange game was found..."}),e.jsxs("div",{className:"space-y-4 text-gray-600 dark:text-gray-300",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{children:"It seems our ghost icon has developed a mind of its own!"}),e.jsx("p",{children:"Click on the ghost to score points"}),e.jsx("p",{children:"But beware of the other objects that it attracts..."}),e.jsx("p",{children:"Can you capture the ghost enough times?"})]}),e.jsx("button",{onClick:z,className:"px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-medium",children:"Start Game"})]})]})}),c==="playing"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"absolute top-4 left-4 z-10",children:e.jsxs("div",{className:"text-lg font-bold text-gray-600 dark:text-gray-300",children:["Score: ",N]})}),j.map(t=>{const a=O(t.type),n=t.type==="ghost";return e.jsx("div",{className:`absolute cursor-pointer text-gray-700 dark:text-gray-100 hover:opacity-80 transition-opacity
                    ${n?"z-50":"z-0"}`,style:{transform:`translate(${t.x}px, ${t.y}px)`,width:`${n?S:o}px`,height:`${n?S:o}px`,padding:n?"12px":"0",margin:n?"-12px":"0"},onClick:()=>A(t),children:e.jsx(a,{className:"w-full h-full"})},t.id)})]}),c==="gameOver"&&e.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center space-y-6 p-8",children:[e.jsx(f,{className:"w-16 h-16 text-gray-400 dark:text-gray-500"}),e.jsxs("div",{className:"text-center space-y-4",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-600 dark:text-gray-300",children:"Oops! Our ghost got away..."}),e.jsxs("p",{className:"text-gray-500 dark:text-gray-400",children:["Final Score: ",N]}),e.jsx("p",{className:"text-lg text-gray-600 dark:text-gray-300",children:"Now don't spoil our little secret ghost game for your friends..."}),e.jsxs("div",{className:"flex gap-3 justify-center mt-6",children:[e.jsx("button",{onClick:()=>{v(0),p([]),m("intro")},className:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors",children:"Try Again"}),e.jsx("a",{href:"#tiles",className:"px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors",children:"Play Today's Tiles"})]})]})]}),c==="win"&&e.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center space-y-6 p-8",children:[e.jsx(f,{className:"w-16 h-16 text-blue-400 animate-bounce"}),e.jsxs("div",{className:"text-center space-y-4",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-600 dark:text-gray-300",children:"404 Points! You Win!"}),e.jsx("p",{className:"text-lg text-gray-600 dark:text-gray-300",children:"You've mastered the ghost game!"}),e.jsxs("div",{className:"flex gap-3 justify-center mt-6",children:[e.jsx("button",{onClick:()=>{v(0),p([]),m("intro")},className:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors",children:"Play Again"}),e.jsx("a",{href:"#tiles",className:"px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors",children:"Try Today's Tiles"})]})]})]})]})})};export{$ as default};
