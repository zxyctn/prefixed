if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,o)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let f={};const d=e=>n(e,s),c={module:{uri:s},exports:f,require:d};i[s]=Promise.all(r.map((e=>c[e]||d(e)))).then((e=>(o(...e),f)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"b6e80a7bd12862dfad0acef4031b0f0b"},{url:"android-chrome-192x192.png",revision:"41f4e8fd38afbb58a5d62755fc0edb70"},{url:"android-chrome-512x512.png",revision:"7673b2c601cec3a31f189e0bf7b4f9d9"},{url:"apple-touch-icon.png",revision:"2493f10655af240ca3178177d87796e0"},{url:"assets/browser-eO_HliAn.js",revision:null},{url:"assets/index-vnyu0xwJ.css",revision:null},{url:"assets/index-Wsdv1h3s.js",revision:null},{url:"favicon.ico",revision:"01f6a520575e86edfe21e3ceb9743953"},{url:"index.html",revision:"331ddc9ce698999b9081d2fcb84a6f4a"},{url:"logo_black.png",revision:"1050b566d7d7e6f496e461b2382746eb"},{url:"logo_min_black.png",revision:"6f79d2e325d3fb8647fbffd0749b4df0"},{url:"logo_min_white.png",revision:"b6fade128d132483907f03323ab54fa8"},{url:"logo_white.png",revision:"0e0925871a25bf23660c184ac681403c"},{url:"registerSW.js",revision:"9a811cc3906a4917a4d6595e7435bbc6"},{url:"favicon.ico",revision:"01f6a520575e86edfe21e3ceb9743953"},{url:"apple-touch-icon.png",revision:"2493f10655af240ca3178177d87796e0"},{url:"android-chrome-192x192.png",revision:"41f4e8fd38afbb58a5d62755fc0edb70"},{url:"android-chrome-512x512.png",revision:"7673b2c601cec3a31f189e0bf7b4f9d9"},{url:"manifest.webmanifest",revision:"670af0752a41033f81b7178ebf698041"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
