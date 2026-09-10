import {useEffect,useMemo,useState} from 'react';
import type {Proposal} from './types';
export const proposalStorageKey=(projectId:string)=>`solar-platform-v2:r5:proposal:${projectId}`;
export function loadProposal(projectId:string,storage:Pick<Storage,'getItem'>=localStorage):Proposal|null{try{const raw=storage.getItem(proposalStorageKey(projectId));return raw?JSON.parse(raw) as Proposal:null}catch{return null}}
export function saveProposal(p:Proposal,storage:Pick<Storage,'setItem'>=localStorage){storage.setItem(proposalStorageKey(p.projectId),JSON.stringify(p));}
export function useProposalState(projectId:string){const [proposal,setProposal]=useState<Proposal|null>(()=>loadProposal(projectId));useEffect(()=>{if(proposal)saveProposal(proposal)},[proposal]);return useMemo(()=>({proposal,setProposal}),[proposal]);}
