export type PlatformKind='web'|'android'|'ios'|'windows'|'macos';
export interface PlatformAdapter{kind:PlatformKind;isNative:boolean;pickFile(accept?:string[]):Promise<File|null>;capturePhoto():Promise<File|null>;openPdf(url:string):Promise<void>;share(data:{title?:string;text?:string;url?:string}):Promise<void>;openExternal(url:string):Promise<void>;network():Promise<boolean>;version():Promise<string>;}
export const SAFE_SCHEMES=new Set(['https:','mailto:','tel:']);
export function safeExternalUrl(value:string){const u=new URL(value,location.origin);if(!SAFE_SCHEMES.has(u.protocol))throw new Error('Unsafe external navigation');return u.toString();}
