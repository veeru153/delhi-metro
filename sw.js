if(!self.define){let e,i={};const c=(c,f)=>(c=new URL(c+".js",f).href,i[c]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=i,document.head.appendChild(e)}else e=c,importScripts(c),i()})).then((()=>{let e=i[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(f,n)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let s={};const o=e=>c(e,r),a={module:{uri:r},exports:s,require:o};i[r]=Promise.all(f.map((e=>a[e]||o(e)))).then((e=>(n(...e),s)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"180.png",revision:"09c2f5415374709fa2e0bb23b05b9cca"},{url:"192.png",revision:"7b4a5f0db21a426c119f35f6b3b4346f"},{url:"512.png",revision:"3eda29b39e80cbc9c208bf7989d11396"},{url:"64.png",revision:"d6d7a8fcfb241336f7c075ecfc84c94e"},{url:"assets/index-CpwL7fas.js",revision:null},{url:"assets/index-VQW047fj.css",revision:null},{url:"favicon.ico",revision:"e4c652c6ffbe5a9a3966da8eebfe0fc3"},{url:"icon.svg",revision:"59cd2404a63a77f4a47e7f905b9dc394"},{url:"index.html",revision:"5ff117212568f74c7baaf1c52c635e15"},{url:"manifest.webmanifest",revision:"7e418a3384b38317afecfa106dc2f467"},{url:"registerSW.js",revision:"2cadffd2e2284d4c47774a5e6656c189"},{url:"64.png",revision:"d6d7a8fcfb241336f7c075ecfc84c94e"},{url:"180.png",revision:"09c2f5415374709fa2e0bb23b05b9cca"},{url:"192.png",revision:"7b4a5f0db21a426c119f35f6b3b4346f"},{url:"512.png",revision:"3eda29b39e80cbc9c208bf7989d11396"},{url:"favicon.ico",revision:"e4c652c6ffbe5a9a3966da8eebfe0fc3"},{url:"icon.svg",revision:"59cd2404a63a77f4a47e7f905b9dc394"},{url:"manifest.webmanifest",revision:"7e418a3384b38317afecfa106dc2f467"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
