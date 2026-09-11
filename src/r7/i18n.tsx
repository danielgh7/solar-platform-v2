import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
export type Locale='es-MX'|'en-US';
const STORAGE='solar-platform-v2:r7:locale';
export const DEFAULT_LOCALE:Locale='es-MX';
const es={
 'nav.projects':'Proyectos','nav.crm':'CRM solar','nav.equipment':'Equipos','nav.operations':'Operaciones','nav.settings':'Configuración','nav.signOut':'Cerrar sesión',
 'auth.signIn':'Iniciar sesión','auth.title':'Abre tu espacio de trabajo solar','auth.subtitle':'Continúa con proyectos activos, ingeniería y operación.','auth.email':'Correo electrónico','auth.password':'Contraseña','auth.submit':'Entrar','auth.loading':'Validando sesión…','auth.invalid':'No fue posible iniciar sesión. Verifica tus credenciales.','auth.secure':'Sesión protegida por servidor',
 'projects.title':'Proyectos solares','projects.new':'Nuevo proyecto','settings.title':'Configuración de la empresa','settings.brand':'Marca y preferencias','settings.save':'Guardar cambios','settings.cancel':'Cancelar','settings.preview':'Vista previa','settings.logo':'Logo oficial','settings.defaultLanguage':'Idioma predeterminado','settings.saved':'Cambios guardados','settings.conflict':'Conflicto de edición: vuelve a cargar antes de guardar.',
 'state.loading':'Cargando…','state.saving':'Guardando…','state.saved':'Guardado','state.retry':'Reintentar','state.conflict':'Conflicto de concurrencia','state.forbidden':'No tienes permiso para realizar esta acción.','state.offline':'Sin conexión con el servidor. No se descartaron tus cambios.',
 'locale.es':'Español (México)','locale.en':'English (United States)','common.search':'Buscar','common.notifications':'Notificaciones','common.open':'Abrir','common.ready':'Listo','common.blocked':'Bloqueado','common.yes':'Sí','common.no':'No',
 'rbac.deniedTitle':'Acceso restringido','rbac.deniedBody':'Tu rol no tiene permiso para ver esta información interna.','rbac.costs':'Los costos y márgenes internos están protegidos por autorización del servidor.',
 'brand.tagline':'Energía que conecta.'
} as const;
const en:Record<keyof typeof es,string>={
 'nav.projects':'Projects','nav.crm':'Solar CRM','nav.equipment':'Equipment','nav.operations':'Operations','nav.settings':'Settings','nav.signOut':'Sign out',
 'auth.signIn':'Sign in','auth.title':'Open your solar workspace','auth.subtitle':'Continue with active projects, engineering and operations.','auth.email':'Email','auth.password':'Password','auth.submit':'Sign in','auth.loading':'Validating session…','auth.invalid':'Unable to sign in. Check your credentials.','auth.secure':'Server-protected session',
 'projects.title':'Solar projects','projects.new':'New project','settings.title':'Company settings','settings.brand':'Brand and preferences','settings.save':'Save changes','settings.cancel':'Cancel','settings.preview':'Preview','settings.logo':'Official logo','settings.defaultLanguage':'Default language','settings.saved':'Changes saved','settings.conflict':'Edit conflict: reload before saving.',
 'state.loading':'Loading…','state.saving':'Saving…','state.saved':'Saved','state.retry':'Retry','state.conflict':'Concurrency conflict','state.forbidden':'You do not have permission to perform this action.','state.offline':'Server unavailable. Your local changes were not discarded.',
 'locale.es':'Español (México)','locale.en':'English (United States)','common.search':'Search','common.notifications':'Notifications','common.open':'Open','common.ready':'Ready','common.blocked':'Blocked','common.yes':'Yes','common.no':'No',
 'rbac.deniedTitle':'Restricted access','rbac.deniedBody':'Your role cannot view this internal information.','rbac.costs':'Internal costs and margins are protected by server authorization.',
 'brand.tagline':'Energy that connects.'
};
const dictionaries={ 'es-MX':es,'en-US':en } as const;export type TranslationKey=keyof typeof es;
export function translate(locale:Locale,key:TranslationKey){return dictionaries[locale][key]??key}
export function formatCurrency(value:number,currency='MXN',locale:Locale=DEFAULT_LOCALE){return new Intl.NumberFormat(locale,{style:'currency',currency,maximumFractionDigits:0}).format(value)}
export function formatNumber(value:number,locale:Locale=DEFAULT_LOCALE,maximumFractionDigits=2){return new Intl.NumberFormat(locale,{maximumFractionDigits}).format(value)}
export function formatPercent(value:number,locale:Locale=DEFAULT_LOCALE){return new Intl.NumberFormat(locale,{style:'percent',maximumFractionDigits:1}).format(value/100)}
export function formatDate(value:string|Date,locale:Locale=DEFAULT_LOCALE){return new Intl.DateTimeFormat(locale,{year:'numeric',month:'short',day:'numeric'}).format(new Date(value))}
export function formatDateTime(value:string|Date,locale:Locale=DEFAULT_LOCALE){return new Intl.DateTimeFormat(locale,{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value))}

type I18nValue={locale:Locale;t:(k:TranslationKey)=>string;setLocale:(l:Locale)=>void};const Ctx=createContext<I18nValue|null>(null);
export function I18nProvider({children}:{children:React.ReactNode}){const [locale,setState]=useState<Locale>(()=>{const v=localStorage.getItem(STORAGE);return v==='en-US'||v==='es-MX'?v:DEFAULT_LOCALE});const setLocale=useCallback((l:Locale)=>{setState(l);localStorage.setItem(STORAGE,l);document.documentElement.lang=l},[]);useEffect(()=>{document.documentElement.lang=locale},[locale]);const value=useMemo(()=>({locale,t:(k:TranslationKey)=>translate(locale,k),setLocale}),[locale,setLocale]);return <Ctx.Provider value={value}>{children}</Ctx.Provider>}
export function useI18n(){const v=useContext(Ctx);if(!v)throw new Error('I18nProvider missing');return v}
export const LOCALE_STORAGE_KEY=STORAGE;
