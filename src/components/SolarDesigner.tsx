import { useMemo, useState } from 'react';
import { Grid3X3, Layers3, Minus, MousePointer2, Move, PanelTop, PencilRuler, Plus, Redo2, Ruler, Save, Trash2, Undo2 } from 'lucide-react';
import { project } from '../data';

type Orientation='portrait'|'landscape';
type Tool='select'|'measure'|'roof'|'obstruction'|'panels'|'string'|'erase';
type Module={id:number;x:number;y:number;orientation:Orientation;selected?:boolean;string:number};

const initial:Module[]=[
  {id:1,x:32,y:32,orientation:'portrait',string:1},{id:2,x:39,y:30,orientation:'portrait',string:1},{id:3,x:46,y:28,orientation:'portrait',string:1},{id:4,x:53,y:26,orientation:'portrait',string:1},
  {id:5,x:31,y:43,orientation:'portrait',string:1},{id:6,x:38,y:41,orientation:'portrait',string:1},{id:7,x:45,y:39,orientation:'portrait',string:1},{id:8,x:52,y:37,orientation:'portrait',string:1},
  {id:9,x:59,y:35,orientation:'portrait',string:2},{id:10,x:30,y:54,orientation:'portrait',string:2},{id:11,x:37,y:52,orientation:'portrait',string:2},{id:12,x:44,y:50,orientation:'portrait',string:2},
  {id:13,x:51,y:48,orientation:'portrait',string:2},{id:14,x:58,y:46,orientation:'portrait',string:2},{id:15,x:36,y:63,orientation:'portrait',string:2},{id:16,x:43,y:61,orientation:'portrait',string:2},
  {id:17,x:50,y:59,orientation:'portrait',string:2},{id:18,x:57,y:57,orientation:'portrait',string:2},{id:19,x:64,y:55,orientation:'portrait',string:2},{id:20,x:63,y:44,orientation:'portrait',string:2}
];

const tools:[Tool,string,React.ReactNode][]=[['select','Select',<MousePointer2 size={17}/>],['measure','Measure',<Ruler size={17}/>],['roof','Roof',<PencilRuler size={17}/>],['obstruction','Obstacle',<Grid3X3 size={17}/>],['panels','Modules',<PanelTop size={17}/>],['string','String',<Layers3 size={17}/>],['erase','Erase',<Trash2 size={17}/>]];

export function SolarDesigner(){
  const [tool,setTool]=useState<Tool>('select'); const [mods,setMods]=useState(initial); const [history,setHistory]=useState<Module[][]>([]); const [future,setFuture]=useState<Module[][]>([]);
  const [orientation,setOrientation]=useState<Orientation>('portrait'); const [zoom,setZoom]=useState(100); const [pan,setPan]=useState({x:0,y:0});
  const [layers,setLayers]=useState({obstacles:true,setbacks:true,strings:true,heatmap:true}); const selected=mods.filter(m=>m.selected);
  const snapshot=(next:Module[])=>{setHistory(h=>[...h,mods]);setMods(next);setFuture([])};
  const undo=()=>{if(!history.length)return; const prev=history.at(-1)!; setFuture(f=>[mods,...f]); setMods(prev); setHistory(h=>h.slice(0,-1));};
  const redo=()=>{if(!future.length)return; const next=future[0]; setHistory(h=>[...h,mods]); setMods(next); setFuture(f=>f.slice(1));};
  const clickModule=(id:number,shift:boolean)=>{if(tool==='erase'){snapshot(mods.filter(m=>m.id!==id));return;} if(tool!=='select')return; setMods(mods.map(m=>({...m,selected:m.id===id?true:(shift?m.selected:false)})));};
  const canvasClick=(e:React.MouseEvent<HTMLDivElement>)=>{if(tool!=='panels' && tool!=='obstruction')return; if(tool==='obstruction'){setLayers(l=>({...l,obstacles:true}));return;} const r=e.currentTarget.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*100; const y=(e.clientY-r.top)/r.height*100; snapshot([...mods,{id:Date.now(),x,y,orientation,string:2,selected:true}].map((m,i,a)=>({...m,selected:i===a.length-1})));};
  const removeSelected=()=>selected.length&&snapshot(mods.filter(m=>!m.selected));
  const rotateSelected=(o:Orientation)=>{setOrientation(o); if(selected.length)snapshot(mods.map(m=>m.selected?{...m,orientation:o}:m));};
  const kwp=(mods.length*.64).toFixed(2); const production=Math.round(mods.length*.64*1632); const offset=Math.min(100,production/project.consumption*100).toFixed(1);
  const inspector=useMemo(()=>selected.length?`${selected.length} module${selected.length>1?'s':''} selected`:'Roof plane A', [selected.length]);

  return <main className="designer-page">
    <div className="designer-top"><div><small>{project.id} / DESIGN</small><b>{project.name}</b><span>{project.address}</span></div><div className="designer-actions"><button onClick={undo} className={!history.length?'disabled':''}><Undo2 size={15}/>Undo</button><button onClick={redo} className={!future.length?'disabled':''}><Redo2 size={15}/>Redo</button><button><Save size={15}/>Saved</button></div></div>
    <div className="designer-body">
      <aside className="tool-rail">{tools.map(([id,label,icon])=><button key={id} title={label} className={tool===id?'active':''} onClick={()=>setTool(id)}>{icon}<span>{label}</span></button>)}</aside>
      <section className="design-stage">
        <div className="canvas-toolbar"><span>2D roof plan</span><div><button className={layers.heatmap?'on':''} onClick={()=>setLayers(l=>({...l,heatmap:!l.heatmap}))}>Irradiance</button><button className={layers.setbacks?'on':''} onClick={()=>setLayers(l=>({...l,setbacks:!l.setbacks}))}>Setbacks</button><button className={layers.strings?'on':''} onClick={()=>setLayers(l=>({...l,strings:!l.strings}))}>Strings</button><button className={layers.obstacles?'on':''} onClick={()=>setLayers(l=>({...l,obstacles:!l.obstacles}))}>Obstacles</button></div></div>
        <div className="canvas-wrap" onClick={canvasClick}>
          <div className="map-grid" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom/100})`}}>
            <div className="site-road r1"/><div className="site-road r2"/><div className="tree t1"/><div className="tree t2"/>
            <div className="roof-plane"><div className="roof-inner"/>{layers.setbacks&&<div className="setback-line"/>}{layers.heatmap&&<div className="irradiance-map"><i/><i/><i/></div>}
              {layers.obstacles&&<><div className="obstacle chimney"><span>CHIMNEY</span></div><div className="obstacle hvac"><span>HVAC</span></div></>}
              {layers.strings&&<svg className="string-overlay" viewBox="0 0 100 100" preserveAspectRatio="none"><path className="string-one" d="M31 30 C42 20,54 24,61 34 S51 48,38 47"/><path className="string-two" d="M29 54 C42 45,60 48,66 55 S49 67,38 63"/><text x="24" y="27">S1 / MPPT1</text><text x="61" y="67">S2 / MPPT2</text></svg>}
              {mods.map(m=><button key={m.id} className={`pv-module ${m.orientation} ${m.selected?'selected':''} string-${m.string}`} style={{left:`${m.x}%`,top:`${m.y}%`}} onClick={e=>{e.stopPropagation();clickModule(m.id,e.shiftKey)}}><i/><i/><i/></button>)}
            </div>
          </div>
          <div className="zoom-control"><button onClick={()=>setZoom(z=>Math.max(70,z-10))}><Minus size={14}/></button><b>{zoom}%</b><button onClick={()=>setZoom(z=>Math.min(150,z+10))}><Plus size={14}/></button><button onClick={()=>setPan(p=>({x:p.x+12,y:p.y+6}))}><Move size={14}/></button></div>
          <div className={`tool-feedback ${tool}`}>{tool==='panels'?'Click roof to place module':tool==='erase'?'Click a module to erase':tool==='measure'?'Measure tool active':tool==='string'?'String tool active':tool==='roof'?'Roof tool active':tool==='obstruction'?'Obstacle tool active':'Select modules · Shift for multi-select'}</div>
        </div>
      </section>
      <aside className="inspector"><div className="inspector-head"><small>INSPECTOR</small><h3>{inspector}</h3><span>{selected.length?'Module properties':'Solar surface properties'}</span></div>
        {selected.length?<><div className="property"><small>MODULE</small><b>Jinko Tiger Neo 640 W</b></div><div className="property two"><span><small>COUNT</small><b>{selected.length}</b></span><span><small>DC POWER</small><b>{(selected.length*.64).toFixed(2)} kWp</b></span></div><div className="property"><small>ORIENTATION</small><div className="segmented"><button className={orientation==='portrait'?'on':''} onClick={()=>rotateSelected('portrait')}>Portrait</button><button className={orientation==='landscape'?'on':''} onClick={()=>rotateSelected('landscape')}>Landscape</button></div></div><div className="property two"><span><small>STRING</small><b>S{selected[0].string}</b></span><span><small>MPPT</small><b>{selected[0].string===1?'1':'2'}</b></span></div><button className="danger-action" onClick={removeSelected}><Trash2 size={14}/>Delete selected</button></>:<><div className="property two"><span><small>AZIMUTH</small><b>184°</b></span><span><small>TILT</small><b>11°</b></span></div><div className="property two"><span><small>USABLE AREA</small><b>92.4 m²</b></span><span><small>ROOF TYPE</small><b>Flat</b></span></div><div className="property"><small>SETBACK</small><b>0.60 m perimeter · 0.90 m access path</b></div><div className="property"><small>IRRADIANCE</small><b>1,842 kWh/m²/yr · 3.8% shade loss</b></div></>}
      </aside>
    </div>
    <footer className="designer-kpis"><span><small>MODULES</small><b>{mods.length}</b></span><span><small>DC SIZE</small><b>{kwp} kWp</b></span><span><small>ANNUAL PRODUCTION</small><b>{production.toLocaleString()} kWh</b></span><span><small>SPECIFIC YIELD</small><b>1,632 kWh/kWp</b></span><span><small>OFFSET</small><b>{offset}%</b></span><span><small>SHADE LOSS</small><b>3.8%</b></span></footer>
  </main>;
}
