if(!self.define){let e,o={};const i=(i,n)=>(i=new URL(i+".js",n).href,o[i]||new Promise((o=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=o,document.head.appendChild(e)}else e=i,importScripts(i),o()})).then((()=>{let e=o[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(o[f])return;let l={};const c=e=>i(e,f),d={module:{uri:f},exports:l,require:c};o[f]=Promise.all(n.map((e=>d[e]||c(e)))).then((e=>(r(...e),l)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"b6e80a7bd12862dfad0acef4031b0f0b"},{url:"android-chrome-512x512.png",revision:"86201cbdcec8ced2fb53f55f4820937b"},{url:"apple-touch-icon.png",revision:"5f207da74b70a8a2e9f25f2bd6f06e0b"},{url:"assets/browser-9RNcWuLn.js",revision:null},{url:"assets/index-1TW23erp.js",revision:null},{url:"assets/index-jxlj4eSF.css",revision:null},{url:"favicon.ico",revision:"7167bc5928af2755f76d17facb52644c"},{url:"index.html",revision:"cdcff727e5a7df52a8984fdf34409063"},{url:"logo_old/android-chrome-192x192.png",revision:"41f4e8fd38afbb58a5d62755fc0edb70"},{url:"logo_old/android-chrome-512x512.png",revision:"7673b2c601cec3a31f189e0bf7b4f9d9"},{url:"logo_old/apple-touch-icon.png",revision:"2493f10655af240ca3178177d87796e0"},{url:"logo_old/favicon.ico",revision:"01f6a520575e86edfe21e3ceb9743953"},{url:"logo_old/logo_black.png",revision:"1050b566d7d7e6f496e461b2382746eb"},{url:"logo_old/logo_min_black.png",revision:"6f79d2e325d3fb8647fbffd0749b4df0"},{url:"logo_old/logo_min_white.png",revision:"b6fade128d132483907f03323ab54fa8"},{url:"logo_old/logo_white.png",revision:"0e0925871a25bf23660c184ac681403c"},{url:"registerSW.js",revision:"9a811cc3906a4917a4d6595e7435bbc6"},{url:"favicon.ico",revision:"7167bc5928af2755f76d17facb52644c"},{url:"apple-touch-icon.png",revision:"5f207da74b70a8a2e9f25f2bd6f06e0b"},{url:"android-chrome-512x512.png",revision:"86201cbdcec8ced2fb53f55f4820937b"},{url:"manifest.webmanifest",revision:"670af0752a41033f81b7178ebf698041"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
