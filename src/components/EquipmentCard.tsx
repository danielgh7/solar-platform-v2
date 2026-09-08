import { Check } from 'lucide-react';

type Item={maker:string;model:string;power?:string;capacity?:string;eff:string;voc?:string;isc?:string;mppt?:string;voltage?:string;warranty:string};

export function EquipmentCard({item,selected,onSelect}:{item:Item;selected:boolean;onSelect:()=>void}){
  return <button className={`equipment-row ${selected?'selected':''}`} onClick={onSelect}>
    <span className="equipment-radio">{selected&&<Check size={12}/>}</span>
    <span className="equipment-name"><small>{item.maker}</small><b>{item.model}</b></span>
    <span><small>RATING</small><b>{item.power||item.capacity}</b></span>
    <span><small>EFF.</small><b>{item.eff}</b></span>
    <span><small>DC / MPPT</small><b>{item.voc ? `Voc ${item.voc} · Isc ${item.isc}` : item.mppt ? `${item.mppt} · ${item.voltage}` : 'Battery storage'}</b></span>
    <span><small>WARRANTY</small><b>{item.warranty}</b></span>
  </button>;
}
