export type ApiErrorCode='UNAUTHENTICATED'|'SESSION_EXPIRED_OR_FORBIDDEN'|'FORBIDDEN'|'VALIDATION_ERROR'|'CONFLICT'|'IMMUTABLE'|'NOT_FOUND'|'INTERNAL_ERROR'|'NETWORK_ERROR'|'ORIGIN_REJECTED'|'INVALID_CREDENTIALS';
export class ApiError extends Error{constructor(public code:ApiErrorCode,public status:number,public detail?:unknown){super(code)}}
const base=(import.meta as any).env?.VITE_API_URL||'http://127.0.0.1:8787';
async function request<T>(path:string,init:RequestInit={}):Promise<T>{let r:Response;try{r=await fetch(`${base}${path}`,{...init,credentials:'include',headers:{'Content-Type':'application/json',...(init.headers||{})}})}catch(e){throw new ApiError('NETWORK_ERROR',0,e)}const body=r.status===204?null:await r.json().catch(()=>null);if(!r.ok)throw new ApiError(body?.error?.code||'INTERNAL_ERROR',r.status,body?.error);return body as T}
export const api={
 signIn:(email:string,password:string)=>request<any>('/api/auth/sign-in',{method:'POST',body:JSON.stringify({email,password})}),
 signOut:()=>request<void>('/api/auth/sign-out',{method:'POST'}),
 me:()=>request<any>('/api/auth/me'),
 brand:(org:string)=>request<any>(`/api/orgs/${org}/branding`),
 updateBrand:(org:string,input:any)=>request<any>(`/api/orgs/${org}/branding`,{method:'PUT',body:JSON.stringify(input)}),
 saveLocale:(org:string,locale:'es-MX'|'en-US')=>request<any>(`/api/orgs/${org}/preferences`,{method:'PUT',body:JSON.stringify({locale})}),
 projects:(org:string)=>request<any[]>(`/api/orgs/${org}/projects`),
 projectState:(org:string,projectId:string)=>request<any>(`/api/orgs/${org}/projects/${projectId}/state`),
 saveProjectState:(org:string,projectId:string,state:any)=>request<any>(`/api/orgs/${org}/projects/${projectId}/state`,{method:'PUT',body:JSON.stringify(state)}),
 economics:(org:string,projectId:string)=>request<any>(`/api/orgs/${org}/projects/${projectId}/economics`),
 uploadLogo:async(org:string,file:File)=>{const data=new FormData();data.append('logo',file);let r:Response;try{r=await fetch(`${base}/api/orgs/${org}/branding/logo`,{method:'POST',credentials:'include',body:data})}catch(e){throw new ApiError('NETWORK_ERROR',0,e)}const body=await r.json().catch(()=>null);if(!r.ok)throw new ApiError(body?.error?.code||'INTERNAL_ERROR',r.status,body?.error);return body},
 assetUrl:(org:string,id:string)=>`${base}/api/orgs/${org}/assets/${id}`,
};
