export type Coordinate2D={x:number;y:number};
export type PolygonPoint=Coordinate2D & {id:string};
export type Orientation='portrait'|'landscape';
export type ModuleDimensions={width:number;height:number};
export type RoofPlane={id:string;name:string;points:PolygonPoint[];azimuth:number;tilt:number;roofType:'flat'|'metal'|'tile'|'concrete';setback:number};
export type Obstruction={id:string;kind:'rect'|'polygon';name:string;type:'skylight'|'HVAC'|'chimney'|'other';x?:number;y?:number;width?:number;height?:number;points?:PolygonPoint[];heightM?:number};
export type RestrictedZone={id:string;name:string;type:'access-path'|'no-module';points:PolygonPoint[]};
export type Setback={roofId:string;distance:number};
export type ModulePlacement={id:string;roofId:string;x:number;y:number;orientation:Orientation;rotation:number;valid:boolean};
export type ModuleLayout={placements:ModulePlacement[];orientation:Orientation;gap:number;rowSpacing:number};
export type PlacementValidation={valid:boolean;reason?:'outside-usable-roof'|'obstruction-overlap'|'restricted-zone-overlap'|'module-overlap'};
export type DesignSummary={grossArea:number;usableArea:number;placedCount:number;capacity:number;placedDcKwp:number;targetDcKwp:number;deltaPanels:number;status:'Under target'|'On target'|'Over target'};
export type LayerVisibility={roofs:boolean;setbacks:boolean;modules:boolean;obstructions:boolean;grid:boolean;labels:boolean};
export type Camera={zoom:number;panX:number;panY:number;snap:number};
export type Selection={type:'roof'|'module'|'obstruction'|'restricted'|null;ids:string[]};
export type SiteDesign={version:2;projectId:string;designBasisId?:string;roofs:RoofPlane[];obstructions:Obstruction[];restrictedZones:RestrictedZone[];layout:ModuleLayout;moduleDimensions:ModuleDimensions;panelWattage:number;targetPanelCount:number;targetDcKwp:number;targetOffset:number;layers:LayerVisibility;camera:Camera;selected:Selection;updatedAt:string};
const pt=(id:string,x:number,y:number):PolygonPoint=>({id,x,y});
export function createDefaultSiteDesign(panelWattage=640,targetPanelCount=20,targetDcKwp=12.8,targetOffset=95,designBasisId='recommended'):SiteDesign{return{version:2,projectId:'SOL-2026-0184',designBasisId,roofs:[{id:'roof-1',name:'Main roof',points:[pt('v1',5,4),pt('v2',22,4),pt('v3',23,15),pt('v4',6,16)],azimuth:184,tilt:11,roofType:'flat',setback:.6}],obstructions:[{id:'obs-1',kind:'rect',name:'HVAC',type:'HVAC',x:13,y:7,width:2.2,height:1.6,heightM:1.1}],restrictedZones:[{id:'rz-1',name:'Access path',type:'access-path',points:[pt('r1',5.6,12.1),pt('r2',22.3,11.4),pt('r3',22.5,12.3),pt('r4',5.8,13)]}],layout:{placements:[],orientation:'portrait',gap:.08,rowSpacing:.12},moduleDimensions:{width:1.13,height:2.28},panelWattage,targetPanelCount,targetDcKwp,targetOffset,layers:{roofs:true,setbacks:true,modules:true,obstructions:true,grid:true,labels:true},camera:{zoom:1,panX:0,panY:0,snap:.1},selected:{type:'roof',ids:['roof-1']},updatedAt:new Date(0).toISOString()};}
