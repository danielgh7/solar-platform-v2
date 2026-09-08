export type HistoryState<T>={past:T[];present:T;future:T[]};
export function createHistory<T>(present:T):HistoryState<T>{return{past:[],present,future:[]};}
export function commitHistory<T>(h:HistoryState<T>,next:T):HistoryState<T>{return{past:[...h.past,structuredClone(h.present)],present:next,future:[]};}
export function undoHistory<T>(h:HistoryState<T>):HistoryState<T>{if(!h.past.length)return h;const prev=h.past[h.past.length-1];return{past:h.past.slice(0,-1),present:structuredClone(prev),future:[structuredClone(h.present),...h.future]};}
export function redoHistory<T>(h:HistoryState<T>):HistoryState<T>{if(!h.future.length)return h;const next=h.future[0];return{past:[...h.past,structuredClone(h.present)],present:structuredClone(next),future:h.future.slice(1)};}
