import {useEffect,useMemo,useState} from 'react';
import type {SiteDesign} from './types';
import {createDefaultSiteDesign} from './types';
export const DESIGN_STORAGE_KEY='solar-platform-v2:r2:site-design:SOL-2026-0184';
export function loadSiteDesign(storage:Pick<Storage,'getItem'>=localStorage,fallback?:SiteDesign):SiteDesign{try{const raw=storage.getItem(DESIGN_STORAGE_KEY);if(!raw)return structuredClone(fallback||createDefaultSiteDesign());return JSON.parse(raw) as SiteDesign}catch{return structuredClone(fallback||createDefaultSiteDesign())}}
export function saveSiteDesign(design:SiteDesign,storage:Pick<Storage,'setItem'>=localStorage){storage.setItem(DESIGN_STORAGE_KEY,JSON.stringify(design));}
export function useSiteDesign(fallback:SiteDesign){const [design,setDesign]=useState<SiteDesign>(()=>loadSiteDesign(localStorage,fallback));useEffect(()=>saveSiteDesign(design),[design]);return useMemo(()=>({design,setDesign}),[design]);}
