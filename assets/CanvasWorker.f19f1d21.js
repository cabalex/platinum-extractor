var ur=Object.defineProperty;var cr=(D,T,P)=>T in D?ur(D,T,{enumerable:!0,configurable:!0,writable:!0,value:P}):D[T]=P;var h=(D,T,P)=>(cr(D,typeof T!="symbol"?T+"":T,P),P);(function(){"use strict";const D={R8G8B8A8_UNORM:[4,1,1,1],BC1_UNORM:[8,4,4,1],BC2_UNORM:[16,4,4,1],BC3_UNORM:[16,4,4,1],BC4_UNORM:[8,4,4,1],BC1_UNORM_SRGB:[8,4,4,1],BC2_UNORM_SRGB:[16,4,4,1],BC3_UNORM_SRGB:[16,4,4,1],BC4_SNORM:[8,4,4,1],BC6H_UF16:[16,4,4,1],ASTC_4x4_UNORM:[16,4,4,1],ASTC_6x6_UNORM:[16,6,6,1],ASTC_8x8_UNORM:[16,8,8,1],ASTC_10x10_UNORM:[16,10,10,1],ASTC_12x12_UNORM:[16,12,12,1],ASTC_4x4_SRGB:[16,4,4,1],ASTC_6x6_SRGB:[16,6,6,1],ASTC_8x8_SRGB:[16,8,8,1],ASTC_10x10_SRGB:[16,10,10,1],ASTC_12x12_SRGB:[16,12,12,1]};function T(e){return D[e]}function P(e){return e-=1,e|=e>>1,e|=e>>2,e|=e>>4,e|=e>>8,e|=e>>16,e+1}function I(e,t){return Math.floor((e+t-1)/t)}function Xe(e,t,r){return e.slice(t,t+r)}function N(e,t){return(e-1|t-1)+1}function $e(e,t,r,i,l,o,n,s,u,c,d,m){let y=1<<c,A,p;e=I(e,i),t=I(t,l),u==1?(A=n==1?N(e*s,32):e*s,p=N(A*t,32)):(A=N(e*s,64),p=A*N(t,y*8));let _=new Uint8Array(p);for(let S=0;S<t;S++)for(let v=0;v<e;v++){let O=u==1?S*A+v*s:Ke(v,S,e,s,0,y),j=(S*e+v)*s;if(O+s<=p)if(m==1)for(let R=0;R<s;R++)_[O+R]=d[j+R];else for(let R=0;R<s;R++)_[j+R]=d[O+R]}return _.slice(0,e*t*s).buffer}function Je(e,t,r,i,l,o,n,s,u,c,d){return $e(e,t,r,i,l,o,n,s,u,c,new Uint8Array(d),0)}function Ke(e,t,r,i,l,o){let n=I(r*i,64),s=l+Math.floor(t/(8*o))*512*o*n+Math.floor(e*i/64)*512*o+Math.floor(t%(8*o)/8)*512;return e*=i,s+Math.floor(e%64/32)*256+Math.floor(t%8/2)*64+Math.floor(e%32/16)*32+t%2*16+e%16}function Ze(e,t,r,i,l,o,n,s,u=1,c=!1){let[d,m,y,A]=T(e),p=I(r,y),_=0,S=512,v=c?1:0,O=i>1?i:1,j=(1<<Math.round(s))*8,R=0;for(let de=0;de<O;de++)for(let q=0;q<l;q++){let U=0,W=0,L=[];for(let F=0;F<o;F++){t=Math.max(1,t>>F),r=Math.max(1,r>>F),i=Math.max(1,i>>F),P(I(r,m))<j&&(W+=1);let H=I(t,m),Re=I(r,y),me=new Uint8Array(N(U,S)-U);U+=me.length,L.push(U);let Ae=Math.round((L[0]+n.byteLength-L[F])/l),ne=Xe(n,R+L[F],Ae);try{return _=N(H*d,64),U+=_*N(Re,Math.max(1,p>>W)*8),Je(t,r,i,m,y,A,u,d,v,Math.max(0,s-W),ne)}catch(ie){return console.error("Failed to unswizzle!",ie),!1}}R+=n.byteLength/l}return!1}var a=typeof a<"u"?a:{},be=Object.assign({},a),pe=typeof window=="object",V=typeof importScripts=="function",ae=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string",Ee=!pe&&!ae&&!V;if(a.ENVIRONMENT)throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");var b="";function Qe(e){return a.locateFile?a.locateFile(e,b):b+e}var oe,X,Y;if(ae){if(typeof process>"u"||!process.release||process.release.name!=="node")throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");var we=process.versions.node,$=we.split(".").slice(0,3);if($=$[0]*1e4+$[1]*100+$[2].split("-")[0]*1,$<101900)throw new Error("This emscripten-generated code requires node v10.19.19.0 (detected v"+we+")");var ve=require("fs"),_e=require("path");V?b=_e.dirname(b)+"/":b=__dirname+"/",oe=(e,t)=>(e=ee(e)?new URL(e):_e.normalize(e),ve.readFileSync(e,t?void 0:"utf8")),Y=e=>{var t=oe(e,!0);return t.buffer||(t=new Uint8Array(t)),f(t.buffer),t},X=(e,t,r)=>{e=ee(e)?new URL(e):_e.normalize(e),ve.readFile(e,function(i,l){i?r(i):t(l.buffer)})},!a.thisProgram&&process.argv.length>1&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),typeof module<"u"&&(module.exports=a),process.on("uncaughtException",function(e){if(e!=="unwind"&&!(e instanceof Be)&&!(e.context instanceof Be))throw e});var et=process.versions.node.split(".")[0];et<15&&process.on("unhandledRejection",function(e){throw e}),a.inspect=function(){return"[Emscripten Module object]"}}else if(Ee){if(typeof process=="object"&&typeof require=="function"||typeof window=="object"||typeof importScripts=="function")throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");typeof read<"u"&&(oe=function(t){return read(t)}),Y=function(t){let r;return typeof readbuffer=="function"?new Uint8Array(readbuffer(t)):(r=read(t,"binary"),f(typeof r=="object"),r)},X=function(t,r,i){setTimeout(()=>r(Y(t)),0)},typeof clearTimeout>"u"&&(globalThis.clearTimeout=e=>{}),typeof scriptArgs<"u"&&scriptArgs,typeof print<"u"&&(typeof console>"u"&&(console={}),console.log=print,console.warn=console.error=typeof printErr<"u"?printErr:print)}else if(pe||V){if(V?b=self.location.href:typeof document<"u"&&document.currentScript&&(b=document.currentScript.src),b.indexOf("blob:")!==0?b=b.substr(0,b.replace(/[?#].*/,"").lastIndexOf("/")+1):b="",!(typeof window=="object"||typeof importScripts=="function"))throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");oe=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},V&&(Y=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),X=(e,t,r)=>{var i=new XMLHttpRequest;i.open("GET",e,!0),i.responseType="arraybuffer",i.onload=()=>{if(i.status==200||i.status==0&&i.response){t(i.response);return}r()},i.onerror=r,i.send(null)}}else throw new Error("environment detection error");a.print||console.log.bind(console);var g=a.printErr||console.warn.bind(console);Object.assign(a,be),be=null,Ft(),a.arguments&&a.arguments,C("arguments","arguments_"),a.thisProgram&&a.thisProgram,C("thisProgram","thisProgram"),a.quit&&a.quit,C("quit","quit_"),f(typeof a.memoryInitializerPrefixURL>"u","Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"),f(typeof a.pthreadMainPrefixURL>"u","Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"),f(typeof a.cdInitializerPrefixURL>"u","Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"),f(typeof a.filePackagePrefixURL>"u","Module.filePackagePrefixURL option was removed, use Module.locateFile instead"),f(typeof a.read>"u","Module.read option was removed (modify read_ in JS)"),f(typeof a.readAsync>"u","Module.readAsync option was removed (modify readAsync in JS)"),f(typeof a.readBinary>"u","Module.readBinary option was removed (modify readBinary in JS)"),f(typeof a.setWindowTitle>"u","Module.setWindowTitle option was removed (modify setWindowTitle in JS)"),f(typeof a.TOTAL_MEMORY>"u","Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"),C("read","read_"),C("readAsync","readAsync"),C("readBinary","readBinary"),C("setWindowTitle","setWindowTitle"),f(!Ee,"shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");var J;a.wasmBinary&&(J=a.wasmBinary),C("wasmBinary","wasmBinary"),a.noExitRuntime,C("noExitRuntime","noExitRuntime"),typeof WebAssembly!="object"&&E("no native wasm support detected");var K,se=!1;function f(e,t){e||E("Assertion failed"+(t?": "+t:""))}var Ce,le,B;function Ue(){var e=K.buffer;a.HEAP8=Ce=new Int8Array(e),a.HEAP16=new Int16Array(e),a.HEAP32=new Int32Array(e),a.HEAPU8=le=new Uint8Array(e),a.HEAPU16=new Uint16Array(e),a.HEAPU32=B=new Uint32Array(e),a.HEAPF32=new Float32Array(e),a.HEAPF64=new Float64Array(e)}f(!a.STACK_SIZE,"STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"),f(typeof Int32Array<"u"&&typeof Float64Array<"u"&&Int32Array.prototype.subarray!=null&&Int32Array.prototype.set!=null,"JS engine does not provide full typed array support"),f(!a.wasmMemory,"Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"),f(!a.INITIAL_MEMORY,"Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");var Fe;function tt(){var e=Te();f((e&3)==0),e==0&&(e+=4),B[e>>2]=34821223,B[e+4>>2]=2310721022,B[0]=1668509029}function ye(){if(!se){var e=Te();e==0&&(e+=4);var t=B[e>>2],r=B[e+4>>2];(t!=34821223||r!=2310721022)&&E("Stack overflow! Stack cookie has been overwritten at "+te(e)+", expected hex dwords 0x89BACDFE and 0x2135467, but received "+te(r)+" "+te(t)),B[0]!==1668509029&&E("Runtime error: The application has corrupted its heap memory area (address zero)!")}}(function(){var e=new Int16Array(1),t=new Int8Array(e.buffer);if(e[0]=25459,t[0]!==115||t[1]!==99)throw"Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)"})();var Me=[],xe=[],Oe=[],he=!1;function rt(){if(a.preRun)for(typeof a.preRun=="function"&&(a.preRun=[a.preRun]);a.preRun.length;)at(a.preRun.shift());ge(Me)}function nt(){f(!he),he=!0,ye(),ge(xe)}function it(){if(ye(),a.postRun)for(typeof a.postRun=="function"&&(a.postRun=[a.postRun]);a.postRun.length;)st(a.postRun.shift());ge(Oe)}function at(e){Me.unshift(e)}function ot(e){xe.unshift(e)}function st(e){Oe.unshift(e)}f(Math.imul,"This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"),f(Math.fround,"This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"),f(Math.clz32,"This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"),f(Math.trunc,"This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");var k=0,G=null,Z=null,Q={};function lt(e){k++,a.monitorRunDependencies&&a.monitorRunDependencies(k),e?(f(!Q[e]),Q[e]=1,G===null&&typeof setInterval<"u"&&(G=setInterval(function(){if(se){clearInterval(G),G=null;return}var t=!1;for(var r in Q)t||(t=!0,g("still waiting on run dependencies:")),g("dependency: "+r);t&&g("(end of list)")},1e4))):g("warning: run dependency added without ID")}function ut(e){if(k--,a.monitorRunDependencies&&a.monitorRunDependencies(k),e?(f(Q[e]),delete Q[e]):g("warning: run dependency removed without ID"),k==0&&(G!==null&&(clearInterval(G),G=null),Z)){var t=Z;Z=null,t()}}function E(e){a.onAbort&&a.onAbort(e),e="Aborted("+e+")",g(e),se=!0;var t=new WebAssembly.RuntimeError(e);throw t}var w={error:function(){E("Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM")},init:function(){w.error()},createDataFile:function(){w.error()},createPreloadedFile:function(){w.error()},createLazyFile:function(){w.error()},open:function(){w.error()},mkdev:function(){w.error()},registerDevice:function(){w.error()},analyzePath:function(){w.error()},ErrnoError:function(){w.error()}};a.FS_createDataFile=w.createDataFile,a.FS_createPreloadedFile=w.createPreloadedFile;var ct="data:application/octet-stream;base64,";function Le(e){return e.startsWith(ct)}function ee(e){return e.startsWith("file://")}function z(e,t){return function(){var r=e,i=t;return t||(i=a.asm),f(he,"native function `"+r+"` called before runtime initialization"),i[e]||f(i[e],"exported native function `"+r+"` not found"),i[e].apply(null,arguments)}}var M;M="astc_decomp.wasm",Le(M)||(M=Qe(M));function De(e){try{if(e==M&&J)return new Uint8Array(J);if(Y)return Y(e);throw"both async and sync fetching of the wasm failed"}catch(t){E(t)}}function ft(e){if(!J&&(pe||V)){if(typeof fetch=="function"&&!ee(e))return fetch(e,{credentials:"same-origin"}).then(function(t){if(!t.ok)throw"failed to load wasm binary file at '"+e+"'";return t.arrayBuffer()}).catch(function(){return De(e)});if(X)return new Promise(function(t,r){X(e,function(i){t(new Uint8Array(i))},r)})}return Promise.resolve().then(function(){return De(e)})}function Pe(e,t,r){return ft(e).then(function(i){return WebAssembly.instantiate(i,t)}).then(function(i){return i}).then(r,function(i){g("failed to asynchronously prepare wasm: "+i),ee(M)&&g("warning: Loading from a file URI ("+M+") is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing"),E(i)})}function dt(e,t,r,i){return!e&&typeof WebAssembly.instantiateStreaming=="function"&&!Le(t)&&!ee(t)&&!ae&&typeof fetch=="function"?fetch(t,{credentials:"same-origin"}).then(function(l){var o=WebAssembly.instantiateStreaming(l,r);return o.then(i,function(n){return g("wasm streaming compile failed: "+n),g("falling back to ArrayBuffer instantiation"),Pe(t,r,i)})}):Pe(t,r,i)}function mt(){var e={env:ze,wasi_snapshot_preview1:ze};function t(l,o){var n=l.exports;return a.asm=n,K=a.asm.memory,f(K,"memory not found in wasm exports"),Ue(),Fe=a.asm.__indirect_function_table,f(Fe,"table not found in wasm exports"),ot(a.asm.__wasm_call_ctors),ut("wasm-instantiate"),n}lt("wasm-instantiate");var r=a;function i(l){f(a===r,"the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"),r=null,t(l.instance)}if(a.instantiateWasm)try{return a.instantiateWasm(e,t)}catch(l){return g("Module.instantiateWasm callback failed with error: "+l),!1}return dt(J,M,e,i),{}}function C(e,t){Object.getOwnPropertyDescriptor(a,e)||Object.defineProperty(a,e,{configurable:!0,get:function(){E("Module."+e+" has been replaced with plain "+t+" (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}function pt(e){Object.getOwnPropertyDescriptor(a,e)&&E("`Module."+e+"` was supplied but `"+e+"` not included in INCOMING_MODULE_JS_API")}function Ie(e){return e==="FS_createPath"||e==="FS_createDataFile"||e==="FS_createPreloadedFile"||e==="FS_unlink"||e==="addRunDependency"||e==="FS_createLazyFile"||e==="FS_createDevice"||e==="removeRunDependency"}function _t(e,t){typeof globalThis<"u"&&Object.defineProperty(globalThis,e,{configurable:!0,get:function(){x("`"+e+"` is not longer defined by emscripten. "+t)}})}_t("buffer","Please use HEAP8.buffer or wasmMemory.buffer");function yt(e){typeof globalThis<"u"&&!Object.getOwnPropertyDescriptor(globalThis,e)&&Object.defineProperty(globalThis,e,{configurable:!0,get:function(){var t="`"+e+"` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line",r=e;r.startsWith("_")||(r="$"+e),t+=" (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE="+r+")",Ie(e)&&(t+=". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"),x(t)}}),Ne(e)}function Ne(e){Object.getOwnPropertyDescriptor(a,e)||Object.defineProperty(a,e,{configurable:!0,get:function(){var t="'"+e+"' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";Ie(e)&&(t+=". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"),E(t)}})}function Be(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function ge(e){for(;e.length>0;)e.shift()(a)}function te(e){return f(typeof e=="number"),"0x"+e.toString(16).padStart(8,"0")}function x(e){x.shown||(x.shown={}),x.shown[e]||(x.shown[e]=1,ae&&(e="warning: "+e),g(e))}var ke=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0;function ht(e,t,r){for(var i=t+r,l=t;e[l]&&!(l>=i);)++l;if(l-t>16&&e.buffer&&ke)return ke.decode(e.subarray(t,l));for(var o="";t<l;){var n=e[t++];if(!(n&128)){o+=String.fromCharCode(n);continue}var s=e[t++]&63;if((n&224)==192){o+=String.fromCharCode((n&31)<<6|s);continue}var u=e[t++]&63;if((n&240)==224?n=(n&15)<<12|s<<6|u:((n&248)!=240&&x("Invalid UTF-8 leading byte "+te(n)+" encountered when deserializing a UTF-8 string in wasm memory to a JS string!"),n=(n&7)<<18|s<<12|u<<6|e[t++]&63),n<65536)o+=String.fromCharCode(n);else{var c=n-65536;o+=String.fromCharCode(55296|c>>10,56320|c&1023)}}return o}function ue(e,t){return f(typeof e=="number"),e?ht(le,e,t):""}function gt(e,t,r,i){E("Assertion failed: "+ue(e)+", at: "+[t?ue(t):"unknown filename",r,i?ue(i):"unknown function"])}function Tt(){return 2147483648}function St(e){var t=K.buffer;try{return K.grow(e-t.byteLength+65535>>>16),Ue(),1}catch(r){g("emscripten_realloc_buffer: Attempted to grow heap from "+t.byteLength+" bytes to "+e+" bytes, but got error: "+r)}}function Rt(e){var t=le.length;e=e>>>0,f(e>t);var r=Tt();if(e>r)return g("Cannot enlarge memory, asked to go up to "+e+" bytes, but the limit is "+r+" bytes!"),!1;let i=(u,c)=>u+(c-u%c)%c;for(var l=1;l<=4;l*=2){var o=t*(1+.2/l);o=Math.min(o,e+100663296);var n=Math.min(r,i(Math.max(e,o),65536)),s=St(n);if(s)return!0}return g("Failed to grow the heap from "+t+" bytes to "+n+" bytes, not enough memory!"),!1}function At(e){var t=a["_"+e];return f(t,"Cannot call unknown function "+e+", make sure it is exported"),t}function bt(e,t){f(e.length>=0,"writeArrayToMemory array must have a length (should be an array or typed array)"),Ce.set(e,t)}function Et(e){for(var t=0,r=0;r<e.length;++r){var i=e.charCodeAt(r);i<=127?t++:i<=2047?t+=2:i>=55296&&i<=57343?(t+=4,++r):t+=3}return t}function wt(e,t,r,i){if(!(i>0))return 0;for(var l=r,o=r+i-1,n=0;n<e.length;++n){var s=e.charCodeAt(n);if(s>=55296&&s<=57343){var u=e.charCodeAt(++n);s=65536+((s&1023)<<10)|u&1023}if(s<=127){if(r>=o)break;t[r++]=s}else if(s<=2047){if(r+1>=o)break;t[r++]=192|s>>6,t[r++]=128|s&63}else if(s<=65535){if(r+2>=o)break;t[r++]=224|s>>12,t[r++]=128|s>>6&63,t[r++]=128|s&63}else{if(r+3>=o)break;s>1114111&&x("Invalid Unicode code point "+te(s)+" encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."),t[r++]=240|s>>18,t[r++]=128|s>>12&63,t[r++]=128|s>>6&63,t[r++]=128|s&63}}return t[r]=0,r-l}function vt(e,t,r){return f(typeof r=="number","stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"),wt(e,le,t,r)}function Ct(e){var t=Et(e)+1,r=He(t);return vt(e,r,t),r}function Ge(e,t,r,i,l){var o={string:p=>{var _=0;return p!=null&&p!==0&&(_=Ct(p)),_},array:p=>{var _=He(p.length);return bt(p,_),_}};function n(p){return t==="string"?ue(p):t==="boolean"?Boolean(p):p}var s=At(e),u=[],c=0;if(f(t!=="array",'Return type should not be "array".'),i)for(var d=0;d<i.length;d++){var m=o[r[d]];m?(c===0&&(c=Mt()),u[d]=m(i[d])):u[d]=i[d]}var y=s.apply(null,u);function A(p){return c!==0&&xt(c),n(p)}return y=A(y),y}function Ut(e,t,r,i){return function(){return Ge(e,t,r,arguments)}}function Ft(){pt("fetchSettings")}var ze={__assert_fail:gt,emscripten_resize_heap:Rt};mt(),a._decompressImageData=z("decompressImageData"),a._malloc=z("malloc"),a._free=z("free"),a._fflush=z("fflush");var We=function(){return(We=a.asm.emscripten_stack_init).apply(null,arguments)},Te=function(){return(Te=a.asm.emscripten_stack_get_end).apply(null,arguments)},Mt=z("stackSave"),xt=z("stackRestore"),He=z("stackAlloc");a.ccall=Ge,a.cwrap=Ut;var Ot=["zeroMemory","exitJS","isLeapYear","ydayFromDate","arraySum","addDays","setErrNo","inetPton4","inetNtop4","inetPton6","inetNtop6","readSockaddr","writeSockaddr","getHostByName","initRandomFill","randomFill","traverseStack","getCallstack","emscriptenLog","convertPCtoSourceLocation","readEmAsmArgs","jstoi_q","jstoi_s","getExecutableName","listenOnce","autoResumeAudioContext","dynCallLegacy","getDynCaller","dynCall","handleException","runtimeKeepalivePush","runtimeKeepalivePop","callUserCallback","maybeExit","safeSetTimeout","asmjsMangle","asyncLoad","alignMemory","mmapAlloc","HandleAllocator","getNativeTypeSize","STACK_SIZE","STACK_ALIGN","POINTER_SIZE","ASSERTIONS","writeI53ToI64","writeI53ToI64Clamped","writeI53ToI64Signaling","writeI53ToU64Clamped","writeI53ToU64Signaling","readI53FromI64","readI53FromU64","convertI32PairToI53","convertI32PairToI53Checked","convertU32PairToI53","uleb128Encode","sigToWasmTypes","generateFuncType","convertJsFunctionToWasm","getEmptyTableSlot","updateTableMap","getFunctionAddress","addFunction","removeFunction","reallyNegative","unSign","strLen","reSign","formatString","intArrayFromString","intArrayToString","AsciiToString","stringToAscii","UTF16ToString","stringToUTF16","lengthBytesUTF16","UTF32ToString","stringToUTF32","lengthBytesUTF32","stringToNewUTF8","getSocketFromFD","getSocketAddress","registerKeyEventCallback","maybeCStringToJsString","findEventTarget","findCanvasEventTarget","getBoundingClientRect","fillMouseEventData","registerMouseEventCallback","registerWheelEventCallback","registerUiEventCallback","registerFocusEventCallback","fillDeviceOrientationEventData","registerDeviceOrientationEventCallback","fillDeviceMotionEventData","registerDeviceMotionEventCallback","screenOrientation","fillOrientationChangeEventData","registerOrientationChangeEventCallback","fillFullscreenChangeEventData","registerFullscreenChangeEventCallback","JSEvents_requestFullscreen","JSEvents_resizeCanvasForFullscreen","registerRestoreOldStyle","hideEverythingExceptGivenElement","restoreHiddenElements","setLetterbox","softFullscreenResizeWebGLRenderTarget","doRequestFullscreen","fillPointerlockChangeEventData","registerPointerlockChangeEventCallback","registerPointerlockErrorEventCallback","requestPointerLock","fillVisibilityChangeEventData","registerVisibilityChangeEventCallback","registerTouchEventCallback","fillGamepadEventData","registerGamepadEventCallback","registerBeforeUnloadEventCallback","fillBatteryEventData","battery","registerBatteryEventCallback","setCanvasElementSize","getCanvasElementSize","demangle","demangleAll","jsStackTrace","stackTrace","getEnvStrings","checkWasiClock","flush_NO_FILESYSTEM","wasiRightsToMuslOFlags","wasiOFlagsToMuslOFlags","createDyncallWrapper","setImmediateWrapped","clearImmediateWrapped","polyfillSetImmediate","getPromise","makePromise","makePromiseCallback","ExceptionInfo","exception_addRef","exception_decRef","setMainLoop","_setNetworkCallback","heapObjectForWebGLType","heapAccessShiftForWebGLHeap","webgl_enable_ANGLE_instanced_arrays","webgl_enable_OES_vertex_array_object","webgl_enable_WEBGL_draw_buffers","webgl_enable_WEBGL_multi_draw","emscriptenWebGLGet","computeUnpackAlignedImageSize","colorChannelsInGlTextureFormat","emscriptenWebGLGetTexPixelData","__glGenObject","emscriptenWebGLGetUniform","webglGetUniformLocation","webglPrepareUniformLocationsBeforeFirstUse","webglGetLeftBracePos","emscriptenWebGLGetVertexAttrib","__glGetActiveAttribOrUniform","writeGLArray","registerWebGlEventCallback","runAndAbortIfError","SDL_unicode","SDL_ttfContext","SDL_audio","GLFW_Window","ALLOC_NORMAL","ALLOC_STACK","allocate","writeStringToMemory","writeAsciiToMemory"];Ot.forEach(yt);var Lt=["run","addOnPreRun","addOnInit","addOnPreMain","addOnExit","addOnPostRun","addRunDependency","removeRunDependency","FS_createFolder","FS_createPath","FS_createDataFile","FS_createPreloadedFile","FS_createLazyFile","FS_createLink","FS_createDevice","FS_unlink","out","err","callMain","abort","keepRuntimeAlive","wasmMemory","stackAlloc","stackSave","stackRestore","getTempRet0","setTempRet0","writeStackCookie","checkStackCookie","ptrToString","getHeapMax","emscripten_realloc_buffer","ENV","MONTH_DAYS_REGULAR","MONTH_DAYS_LEAP","MONTH_DAYS_REGULAR_CUMULATIVE","MONTH_DAYS_LEAP_CUMULATIVE","ERRNO_CODES","ERRNO_MESSAGES","DNS","Protocols","Sockets","timers","warnOnce","UNWIND_CACHE","readEmAsmArgsArray","getCFunc","freeTableIndexes","functionsInTableMap","setValue","getValue","PATH","PATH_FS","UTF8Decoder","UTF8ArrayToString","UTF8ToString","stringToUTF8Array","stringToUTF8","lengthBytesUTF8","UTF16Decoder","stringToUTF8OnStack","writeArrayToMemory","SYSCALLS","JSEvents","specialHTMLTargets","currentFullscreenStrategy","restoreOldWindowedStyle","ExitStatus","dlopenMissingError","promiseMap","uncaughtExceptionCount","exceptionLast","exceptionCaught","Browser","wget","FS","MEMFS","TTY","PIPEFS","SOCKFS","tempFixedLengthArray","miniTempWebGLFloatBuffers","miniTempWebGLIntBuffers","GL","emscripten_webgl_power_preferences","AL","GLUT","EGL","GLEW","IDBStore","SDL","SDL_gfx","GLFW","allocateUTF8","allocateUTF8OnStack"];Lt.forEach(Ne);var ce;Z=function e(){ce||Ve(),ce||(Z=e)};function Dt(){We(),tt()}function Ve(){if(k>0||(Dt(),rt(),k>0))return;function e(){ce||(ce=!0,a.calledRun=!0,!se&&(nt(),a.onRuntimeInitialized&&a.onRuntimeInitialized(),f(!a._main,'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'),it()))}a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1),e()},1)):e(),ye()}if(a.preInit)for(typeof a.preInit=="function"&&(a.preInit=[a.preInit]);a.preInit.length>0;)a.preInit.pop()();Ve(),a.onRuntimeInitialized=()=>{console.log("Module initialized")};function Pt(e,t,r,i){let l=new Uint8Array(16).buffer,o=new DataView(l),n=T(e);return o.setUint32(0,1554098963,!0),o.setUint8(4,n[1]),o.setUint8(5,n[2]),o.setUint8(6,n[3]),o.setUint16(7,t),o.setUint16(10,r),o.setUint16(13,i),l}function It(e,t,r,i,l){let o=Pt(e,t,r,i),n=new Uint8Array(o.byteLength+l.byteLength);return n.set(new Uint8Array(o)),n.set(new Uint8Array(l),o.byteLength),n.buffer}function Nt(e,t,r,i,l,o){o||(o=document.createElement("canvas"));let n=o.getContext("2d");if(!n)throw new Error("Could not get 2D context from canvas");o.width=t,o.height=r;let s=T(e)[1],u=T(e)[2],c=T(e)[0],d=a.cwrap("decompressImageData","boolean",["number","number","boolean","number","number","number","number","number","number"]);const m=a._malloc(l.byteLength),y=a._malloc(t*r*4);new Uint8Array(a.HEAPU8.buffer,m,l.byteLength).set(new Uint8Array(l)),d(y,m,!1,l.byteLength,t,r,c,s,u)||console.warn("Decompressed incorrectly");let _=new Uint8Array(a.HEAPU8.buffer,y,t*r*4);a._free(m),a._free(y);let S=n.createImageData(t,r);return S.data.set(_),n.putImageData(S,0,0),o}var re=(e=>(e[e.PlatinumGeneric=0]="PlatinumGeneric",e[e.AstralChain=1]="AstralChain",e[e.NieRReplicant=2]="NieRReplicant",e[e.NieRAutomata=3]="NieRAutomata",e[e.NieRAutomataSwitch=4]="NieRAutomataSwitch",e[e.MetalGearRisingRevengence=5]="MetalGearRisingRevengence",e[e.Bayonetta1PC=6]="Bayonetta1PC",e[e.Bayonetta1Switch=7]="Bayonetta1Switch",e[e.Bayonetta2WiiU=8]="Bayonetta2WiiU",e[e.Bayonetta2Switch=9]="Bayonetta2Switch",e[e.Bayonetta3=10]="Bayonetta3",e[e.StarFoxZero=11]="StarFoxZero",e[e.StarFoxGuard=12]="StarFoxGuard",e[e.TransformersDevastation=13]="TransformersDevastation",e[e.Vanquish=14]="Vanquish",e[e.Wonderful101=15]="Wonderful101",e[e.Wonderful101Remastered=16]="Wonderful101Remastered",e[e.Wonderful101RemasteredSwitch=17]="Wonderful101RemasteredSwitch",e))(re||{});const Bt={[0]:{platform:0,name:"Unknown Platinum Game",deswizzlingRequired:!1,astc:!1},[1]:{platform:1,name:"Astral Chain",deswizzlingRequired:!0,astc:!0},[2]:{platform:0,name:"NieR Replicant",deswizzlingRequired:!1,astc:!1},[3]:{platform:0,name:"NieR Automata",deswizzlingRequired:!1,astc:!1},[4]:{platform:1,name:"NieR Automata Switch",deswizzlingRequired:!0,astc:!0},[5]:{platform:0,name:"Metal Gear Rising: Revengence",deswizzlingRequired:!1,astc:!1},[6]:{platform:0,name:"Bayonetta 1 PC",deswizzlingRequired:!1,astc:!1},[7]:{platform:1,name:"Bayonetta 1 Switch",deswizzlingRequired:!0,astc:!0},[8]:{platform:2,name:"Bayonetta 2 Wii U",deswizzlingRequired:!1,astc:!1},[9]:{platform:1,name:"Bayonetta 2 Switch",deswizzlingRequired:!0,astc:!0},[10]:{platform:1,name:"Bayonetta 3",deswizzlingRequired:!0,astc:!0},[11]:{platform:2,name:"Star Fox Zero",deswizzlingRequired:!1,astc:!1},[12]:{platform:2,name:"Star Fox Guard",deswizzlingRequired:!1,astc:!1},[13]:{platform:0,name:"Transformers Devastation",deswizzlingRequired:!1,astc:!1},[14]:{platform:0,name:"Vanquish",deswizzlingRequired:!1,astc:!1},[15]:{platform:2,name:"Wonderful 101",deswizzlingRequired:!1,astc:!1},[16]:{platform:0,name:"Wonderful 101 Remastered PC",deswizzlingRequired:!0,astc:!0},[17]:{platform:1,name:"Wonderful 101 Remastered Switch",deswizzlingRequired:!0,astc:!0}};/* @license twgl.js 5.3.1 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */function kt(...e){console.error(...e)}const Gt=function(){const e={},t={};function r(i){const l=i.constructor.name;if(!e[l]){for(const o in i)if(typeof i[o]=="number"){const n=t[i[o]];t[i[o]]=n?`${n} | ${o}`:o}e[l]=!0}}return function(l,o){return r(l),t[o]||(typeof o=="number"?`0x${o.toString(16)}`:o)}}(),Se=kt;function zt(e){return typeof document<"u"&&document.getElementById?document.getElementById(e):null}const Wt=35713,Ht=35714,Vt=35632,Yt=35633,jt=35981,qt=/ERROR:\s*\d+:(\d+)/gi;function Xt(e,t="",r=0){const i=[...t.matchAll(qt)],l=new Map(i.map((o,n)=>{const s=parseInt(o[1]),u=i[n+1],c=u?u.index:t.length,d=t.substring(o.index,c);return[s-1,d]}));return e.split(`
`).map((o,n)=>{const s=l.get(n);return`${n+1+r}: ${o}${s?`

^^^ ${s}`:""}`}).join(`
`)}const Ye=/^[ \t]*\n/;function je(e){let t=0;return Ye.test(e)&&(t=1,e=e.replace(Ye,"")),{lineOffset:t,shaderSource:e}}function $t(e,t,r,i){if(i=i||Se,!e.getShaderParameter(r,Wt)){const o=e.getShaderInfoLog(r),{lineOffset:n,shaderSource:s}=je(e.getShaderSource(r)),u=`${Xt(s,o,n)}
Error compiling ${Gt(e,t)}: ${o}`;return i(u),u}return""}function qe(e,t,r){let i,l,o;if(typeof t=="function"&&(r=t,t=void 0),typeof e=="function")r=e,e=void 0;else if(e&&!Array.isArray(e)){const c=e;r=c.errorCallback,e=c.attribLocations,i=c.transformFeedbackVaryings,l=c.transformFeedbackMode,o=c.callback}const n=r||Se,s=[],u={errorCallback(c,...d){s.push(c),n(c,...d)},transformFeedbackVaryings:i,transformFeedbackMode:l,callback:o,errors:s};{let c={};Array.isArray(e)?e.forEach(function(d,m){c[d]=t?t[m]:m}):c=e||{},u.attribLocations=c}return u}const Jt=["VERTEX_SHADER","FRAGMENT_SHADER"];function Kt(e,t){if(t.indexOf("frag")>=0)return Vt;if(t.indexOf("vert")>=0)return Yt}function Zt(e,t,r){const i=e.getAttachedShaders(t);for(const l of i)r.has(l)&&e.deleteShader(l);e.deleteProgram(t)}const Qt=(e=0)=>new Promise(t=>setTimeout(t,e));function er(e,t,r){const i=e.createProgram(),{attribLocations:l,transformFeedbackVaryings:o,transformFeedbackMode:n}=qe(r);for(let s=0;s<t.length;++s){let u=t[s];if(typeof u=="string"){const c=zt(u),d=c?c.text:u;let m=e[Jt[s]];c&&c.type&&(m=Kt(e,c.type)||m),u=e.createShader(m),e.shaderSource(u,je(d).shaderSource),e.compileShader(u),e.attachShader(i,u)}}Object.entries(l).forEach(([s,u])=>e.bindAttribLocation(i,u,s));{let s=o;s&&(s.attribs&&(s=s.attribs),Array.isArray(s)||(s=Object.keys(s)),e.transformFeedbackVaryings(i,s,n||jt))}return e.linkProgram(i),i}function tr(e,t,r,i,l){const o=qe(r,i,l),n=new Set(t),s=er(e,t,o);function u(c,d){const m=nr(c,d,o.errorCallback);return m&&Zt(c,d,n),m}if(o.callback){rr(e,s).then(()=>{const c=u(e,s);o.callback(c,c?void 0:s)});return}return u(e,s)?void 0:s}async function rr(e,t){const r=e.getExtension("KHR_parallel_shader_compile"),i=r?(o,n)=>o.getProgramParameter(n,r.COMPLETION_STATUS_KHR):()=>!0;let l=0;do await Qt(l),l=1e3/60;while(!i(e,t))}function nr(e,t,r){if(r=r||Se,!e.getProgramParameter(t,Ht)){const l=e.getProgramInfoLog(t);r(`Error in program linking: ${l}`);const n=e.getAttachedShaders(t).map(s=>$t(e,e.getShaderParameter(s,e.SHADER_TYPE),s,r));return`${l}
${n.filter(s=>s).join(`
`)}`}}function ir(e,t,r,i){let l,o=[];return e==="BC6H_UF16"?(l=808540228,o=[95,3,0,1,0]):e.startsWith("BC1")?l=827611204:e.startsWith("BC2")?l=861165636:l=894720068,Uint32Array.from([542327876,124,1+2+4+4096+131072+524288,r,t,e=="R8G8B8A8_UNORM"?(t+1>>1)*4:Math.round(Math.max(1,(t+3)/4)*T(e)[0]),i,1,0,0,0,0,0,0,0,0,0,0,0,32,4,l,0,0,0,0,0,4198408,0,0,0,0,...o]).buffer}function ar(e,t,r,i,l){let o=ir(e,t,r,i),n=new Uint8Array(o.byteLength+l.byteLength);return n.set(new Uint8Array(o)),n.set(new Uint8Array(l),o.byteLength),n.buffer}function or(e,t,r,i,l,o){o||(o=document.createElement("canvas"));let n=o.getContext("webgl");if(n===null)return alert("Unable to initialize WebGL or Canvas2D. Your browser or machine may not support it."),o;o.width=t,o.height=r;let s=n.getExtension("WEBGL_compressed_texture_s3tc");n.viewport(0,0,t,r);var d=tr(n,[`
        attribute vec2 a_position;
        attribute vec2 a_texCoord;

        uniform vec2 u_resolution;

        varying vec2 v_texCoord;

        void main() {
            // convert the rectangle from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            // convert from 0->2 to -1->+1 (clipspace)
            vec2 clipSpace = zeroToTwo - 1.0;

            gl_Position = vec4(clipSpace * vec2(1, 1), 0, 1);

            // pass the texCoord to the fragment shader
            // The GPU will interpolate this value between points.
            v_texCoord = a_texCoord;
        }
    `,`
        precision mediump float;

        // our texture
        uniform sampler2D u_image;

        // the texCoords passed in from the vertex shader.
        varying vec2 v_texCoord;

        void main() {
            gl_FragColor = texture2D(u_image, v_texCoord);
        }
    `]),m=n.getAttribLocation(d,"a_position"),y=n.getAttribLocation(d,"a_texCoord"),A=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,A);var p=0,_=t,S=0,v=r;n.bufferData(n.ARRAY_BUFFER,new Float32Array([p,S,_,S,p,v,p,v,_,S,_,v]),n.STATIC_DRAW);var O=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,O),n.bufferData(n.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),n.STATIC_DRAW);let j=n.createTexture();n.bindTexture(n.TEXTURE_2D,j);let R=e.includes("BC1")?s.COMPRESSED_RGBA_S3TC_DXT1_EXT:s.COMPRESSED_RGBA_S3TC_DXT5_EXT;n.compressedTexImage2D(n.TEXTURE_2D,0,R,t,r,0,new DataView(l)),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST);var de=n.getUniformLocation(d,"u_resolution");n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(d),n.enableVertexAttribArray(m),n.bindBuffer(n.ARRAY_BUFFER,A);var q=2,U=n.FLOAT,W=!1,L=0,H=0;n.vertexAttribPointer(m,q,U,W,L,H),n.enableVertexAttribArray(y),n.bindBuffer(n.ARRAY_BUFFER,O);var q=2,U=n.FLOAT,W=!1,L=0,H=0;n.vertexAttribPointer(y,q,U,W,L,H),n.uniform2f(de,t,r);var F=n.TRIANGLES,H=0,Re=6;n.drawArrays(F,H,Re);let me=new Uint8Array(t*r*4);n.readPixels(0,0,t,r,n.RGBA,n.UNSIGNED_BYTE,me);let Ae=new ImageData(new Uint8ClampedArray(me),t,r),ne=new OffscreenCanvas(t,r),ie=ne.getContext("2d");return ie===null?(alert("Unable to initialize WebGL or Canvas2D. Your browser or machine may not support it."),ne):(ie.putImageData(Ae,0,0),ne)}const sr=["T_1D","T_2D","T_3D","T_Cube","T_1D_Array","TD_2D_Array","T_2D_Multisample","T_2D_Multisample_Array","T_Cube_Array"],lr={37:"R8G8B8A8_UNORM",56:"R8_G8_B8_A8_SRGB",66:"BC1_UNORM",67:"BC2_UNORM",68:"BC3_UNORM",69:"BC4_UNORM",70:"BC1_SRGB",71:"BC2_SRGB",72:"BC3_SRGB",73:"BC4_SRGB",75:"BC5_UNORM",76:"BC5_SRGB",77:"BC7_UNORM",78:"BC7_SRGB",79:"BC6H_F16",80:"BC6H_UF16",121:"ASTC_4x4_UNORM",122:"ASTC_5x4_UNORM",123:"ASTC_5x5_UNORM",124:"ASTC_6x5_UNORM",125:"ASTC_6x6_UNORM",126:"ASTC_8x5_UNORM",127:"ASTC_8x6_UNORM",128:"ASTC_8x8_UNORM",129:"ASTC_10x5_UNORM",130:"ASTC_10x6_UNORM",131:"ASTC_10x8_UNORM",132:"ASTC_10x10_UNORM",133:"ASTC_12x10_UNORM",134:"ASTC_12x12_UNORM",135:"ASTC_4x4_SRGB",136:"ASTC_5x4_SRGB",137:"ASTC_5x5_SRGB",138:"ASTC_6x5_SRGB",139:"ASTC_6x6_SRGB",140:"ASTC_8x5_SRGB",141:"ASTC_8x6_SRGB",142:"ASTC_8x8_SRGB",143:"ASTC_10x5_SRGB",144:"ASTC_10x6_SRGB",145:"ASTC_10x8_SRGB",146:"ASTC_10x10_SRGB",147:"ASTC_12x10_SRGB",148:"ASTC_12x12_SRGB",45:"ASTC_4x4_UNORM",58:"ASTC_12x12_UNORM"};class fe{constructor(t,r,i,l){h(this,"identifier","0");h(this,"offset",0);h(this,"size",0);h(this,"unknownArrayValue",0);h(this,"magic",3232856);h(this,"imageSize",0);h(this,"headerSize",0);h(this,"mipCount",1);h(this,"type",68);h(this,"format",1);h(this,"width",0);h(this,"height",0);h(this,"depth",1);h(this,"textureLayout",0);h(this,"textureLayout2",0);h(this,"arrayCount",1);this.identifier=t.toString(16),this.offset=r,this.size=i,this.unknownArrayValue=l}get game(){switch(this.magic){case 3232856:return re.AstralChain;case 2019914798:return re.NieRAutomataSwitch;case 71:return re.NieRAutomata;default:return re.PlatinumGeneric}}get _format(){return lr[this.format]}get _type(){return sr[this.type]}static recreate(t){let r=new fe(0,t.wtpOffset,t.wtpSize,t.unknownArrayValue);return Object.assign(r,t),r}static extract(t,r,i,l,o,n){let s=t.getUint32(r,!0),u=new fe(o,i,l,n);switch(u.magic=s,s){case 3232856:return u.imageSize=t.getUint32(r+8,!0),u.headerSize=t.getUint32(r+16,!0),u.mipCount=t.getUint32(r+20,!0),u.type=t.getUint32(r+24,!0),u.format=t.getUint32(r+28,!0),u.width=t.getUint32(r+32,!0),u.height=t.getUint32(r+36,!0),u.depth=t.getUint32(r+40,!0),u.textureLayout=t.getUint32(r+48,!0),["T_Cube","T_Cube_Array"].includes(u._type)&&(u.arrayCount=6),[u,r+56];case 2019914798:return u.format=t.getUint32(r+4,!0),u.width=t.getUint32(r+12,!0),u.height=t.getUint32(r+16,!0),u.depth=t.getUint32(r+20,!0),u.mipCount=t.getUint32(r+24,!0),u.type=1,u.textureLayout=4,u.height>256?u.arrayCount=1:u.height>128?u.arrayCount=4:u.arrayCount=2,console.log(u.format),[u,r+256];case 71:return u.format=66,[u,r+20];case 74:return u.format=66,[u,r+20];case 77:return u.format=66,[u,r+20];default:console.warn("Unknown texture magic: "+s)}return[u,r+256]}getTextureData(t){let r=t.slice(this.offset,this.offset+this.size);if(Bt[this.game].deswizzlingRequired){let i=this.textureLayout&7;if(r=Ze(this._format,this.width,this.height,this.depth,this.arrayCount,this.mipCount,r,i)||new ArrayBuffer(0),r.byteLength===0)throw new Error("Texture swizzling failed!")}else if(this.width===0||this.height===0){let i=new DataView(r);if(i.getUint32(0,!0)!==542327876)throw new Error("Invalid DDS header!");switch(this.headerSize=i.getUint32(4,!0),this.width=i.getUint32(12,!0),this.height=i.getUint32(16,!0),this.depth=1,console.log(`Unknown texture: ${this.identifier} (${this.width}x${this.height}x${this.depth})`),i.getUint32(84,!0)){case 827611204:this.format=66;break;case 861165636:this.format=67;break;case 894720068:this.format=68;break;case 959535172:this.format=80;break;default:console.warn(`Unknown DDS format: ${i.getUint32(84,!0)}. This texture may not load correctly.`)}r=r.slice(Math.ceil(this.headerSize/16)*16)}return r}load(t,r){let i=this.getTextureData(t);return this._format.includes("ASTC")?r=Nt(this._format,this.width,this.height,this.depth,i,r):r=or(this._format,this.width,this.height,this.depth,i,r),r}download(t){let r=this.getTextureData(t);return this._format.includes("ASTC")?It(this._format,this.width,this.height,this.depth,r):ar(this._format,this.width,this.height,this.depth,r)}}self.onmessage=e=>{const t=e.data.canvas;fe.recreate(e.data.texture).load(e.data.wtpFile,t)},console.log("Hello world!")})();