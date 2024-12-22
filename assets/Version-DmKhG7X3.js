import{r as l,j as a,g}from"./index-CfbWFn8l.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),i=(...s)=>s.filter((t,e,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===e).join(" ").trim();/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var f={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=l.forwardRef(({color:s="currentColor",size:t=24,strokeWidth:e=2,absoluteStrokeWidth:r,className:o="",children:n,iconNode:d,...m},h)=>l.createElement("svg",{ref:h,...f,width:t,height:t,stroke:s,strokeWidth:r?Number(e)*24/Number(t):e,className:i("lucide",o),...m},[...d.map(([u,x])=>l.createElement(u,x)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=(s,t)=>{const e=l.forwardRef(({className:r,...o},n)=>l.createElement(y,{ref:n,iconNode:t,className:i(`lucide-${p(s)}`,r),...o}));return e.displayName=`${s}`,e};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=c("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=c("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=c("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),v=({isOpen:s,onClose:t,title:e="How to Play",children:r})=>{const o=n=>{n&&localStorage.setItem("gamesAlwaysShowInstructions","false"),localStorage.setItem("gamesShowInstructions","false"),t()};return s?a.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",children:a.jsxs("div",{className:"bg-white rounded-lg p-6 max-w-md w-full relative",children:[a.jsx("button",{onClick:()=>o(!1),className:"absolute right-4 top-4 text-gray-500 hover:text-gray-700",children:a.jsx(w,{className:"w-5 h-5"})}),a.jsx("h2",{className:"text-xl font-bold mb-4",children:e}),a.jsxs("div",{className:"space-y-4",children:[r,a.jsxs("div",{className:"mt-6 flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",id:"dontShowAgain",className:"rounded",onChange:n=>o(n.target.checked)}),a.jsx("label",{htmlFor:"dontShowAgain",className:"text-sm text-gray-600",children:"Don't show instructions again"})]})]})]})}):null},C=({gameName:s})=>{const t=new Date().getFullYear(),e=g.games[s.toLowerCase()];if(!e)return null;const r=e.lastUpdated?new Date(e.lastUpdated).toLocaleDateString():"Initial Release";return a.jsxs("div",{className:"text-center mt-8 text-gray-400 text-sm space-y-1",children:[a.jsxs("p",{children:[e.title," -  Version ",e.version," (",r,")"]}),a.jsxs("p",{children:["© ",t]}),!1]})};export{b as C,j as I,C as V,v as a,c};
