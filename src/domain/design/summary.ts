import type {DesignSummary,SiteDesign} from './types';
import {polygonArea} from './math';
import {obstructionArea,restrictedArea,usableRoofPolygon} from './collision';
import {roofCapacity} from './layout';
export function summarizeDesign(design:SiteDesign):DesignSummary{const roof=design.roofs[0];const grossArea=roof?polygonArea(roof.points):0;const setbackArea=roof?polygonArea(usableRoofPolygon(roof)):0;const blocked=design.obstructions.reduce((s,o)=>s+obstructionArea(o),0)+design.restrictedZones.reduce((s,z)=>s+restrictedArea(z),0);const usableArea=Math.max(0,setbackArea-blocked);const placedCount=design.layout.placements.length;const capacity=roof?roofCapacity(design,roof):0;const placedDcKwp=placedCount*design.panelWattage/1000;const deltaPanels=placedCount-design.targetPanelCount;const status=deltaPanels<0?'Under target':deltaPanels>0?'Over target':'On target';return{grossArea,usableArea,placedCount,capacity,placedDcKwp,targetDcKwp:design.targetDcKwp,deltaPanels,status};}
