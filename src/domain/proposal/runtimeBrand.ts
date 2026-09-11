import type {ProposalBranding} from './types';
let current:ProposalBranding|undefined;
export function setRuntimeProposalBrand(brand:ProposalBranding){current=structuredClone(brand)}
export function getRuntimeProposalBrand(){return current?structuredClone(current):undefined}
