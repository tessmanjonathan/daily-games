import{c as l,j as e,g as c}from"./index-CPaSSW1A.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=l("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=l("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=l("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),x=({isOpen:a,onClose:s,title:t="How to Play",children:r})=>{const o=n=>{n&&localStorage.setItem("gamesAlwaysShowInstructions","false"),localStorage.setItem("gamesShowInstructions","false"),s()};return a?e.jsx("div",{className:"fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50",children:e.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full relative",children:[e.jsx("button",{onClick:()=>o(!1),className:"absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",children:e.jsx(d,{className:"w-5 h-5"})}),e.jsx("h2",{className:"text-xl font-bold mb-4 dark:text-white",children:t}),e.jsxs("div",{className:"space-y-4 dark:text-gray-200",children:[r,e.jsxs("div",{className:"mt-6 flex items-center gap-2",children:[e.jsx("input",{type:"checkbox",id:"dontShowAgain",className:"rounded dark:bg-gray-700 dark:border-gray-600",onChange:n=>o(n.target.checked)}),e.jsx("label",{htmlFor:"dontShowAgain",className:"text-sm text-gray-600 dark:text-gray-400",children:"Don't show instructions again"})]})]})]})}):null},m=({gameName:a})=>{const s=new Date().getFullYear(),t=c.games[a.toLowerCase()];if(!t)return null;const r=t.lastUpdated?new Date(t.lastUpdated).toLocaleDateString():"Initial Release";return e.jsxs("div",{className:"text-center mt-8 text-gray-400 text-sm space-y-1",children:[e.jsxs("p",{children:[t.title," -  Version ",t.version," (",r,")"]}),e.jsxs("p",{children:["© ",s]}),!1]})};export{h as C,g as I,m as V,x as a};
