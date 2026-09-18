import type{PlatformAdapter,PlatformKind}from'./types';import{safeExternalUrl}from'./types';
const unavailable=async()=>null;
export function nativePlatform(kind:Exclude<PlatformKind,'web'>):PlatformAdapter{return{kind,isNative:true,pickFile:unavailable,capturePhoto:unavailable,openPdf:async u=>{location.href=safeExternalUrl(u)},share:async d=>{if(navigator.share)await navigator.share(d)},openExternal:async u=>{location.href=safeExternalUrl(u)},network:async()=>navigator.onLine,version:async()=>__APP_VERSION__}}
export function detectPlatform():PlatformKind{const ua=navigator.userAgent.toLowerCase();if(/android/.test(ua))return'android';if(/iphone|ipad|ipod/.test(ua))return'ios';if(/windows/.test(ua))return'windows';if(/macintosh|mac os x/.test(ua))return'macos';return'web'}
