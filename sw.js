if(!self.define){let e,i={};const r=(r,n)=>(r=new URL(r+".js",n).href,i[r]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=i,document.head.appendChild(e)}else e=r,importScripts(r),i()})).then((()=>{let e=i[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(n,o)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(i[f])return;let s={};const d=e=>r(e,f),l={module:{uri:f},exports:s,require:d};i[f]=Promise.all(n.map((e=>l[e]||d(e)))).then((e=>(o(...e),s)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"b6e80a7bd12862dfad0acef4031b0f0b"},{url:"android-chrome-192x192.png",revision:"41f4e8fd38afbb58a5d62755fc0edb70"},{url:"android-chrome-512x512.png",revision:"7673b2c601cec3a31f189e0bf7b4f9d9"},{url:"apple-touch-icon.png",revision:"2493f10655af240ca3178177d87796e0"},{url:"assets/browser-3oJrA1Xx.js",revision:null},{url:"assets/index-IHp8flyN.css",revision:null},{url:"assets/index-rz0Op4I1.js",revision:null},{url:"favicon.ico",revision:"01f6a520575e86edfe21e3ceb9743953"},{url:"index.html",revision:"9531c1862fa765ebf0e1322dd6a0fea1"},{url:"logo_black.png",revision:"1050b566d7d7e6f496e461b2382746eb"},{url:"logo_min_black.png",revision:"6f79d2e325d3fb8647fbffd0749b4df0"},{url:"logo_min_white.png",revision:"b6fade128d132483907f03323ab54fa8"},{url:"logo_white.png",revision:"0e0925871a25bf23660c184ac681403c"},{url:"registerSW.js",revision:"9a811cc3906a4917a4d6595e7435bbc6"},{url:"favicon.ico",revision:"01f6a520575e86edfe21e3ceb9743953"},{url:"apple-touch-icon.png",revision:"2493f10655af240ca3178177d87796e0"},{url:"android-chrome-192x192.png",revision:"41f4e8fd38afbb58a5d62755fc0edb70"},{url:"android-chrome-512x512.png",revision:"7673b2c601cec3a31f189e0bf7b4f9d9"},{url:"manifest.webmanifest",revision:"670af0752a41033f81b7178ebf698041"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
