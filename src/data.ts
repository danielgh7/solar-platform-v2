export const project = {
  id:'SOL-2026-0184', name:'Residencia Montebello', customer:'Mariana Torres', address:'C. 21 184, Montebello, Mérida, Yuc.',
  status:'Engineering', tariff:'DAC', service:'Residential · 3Φ', kwp:12.8, consumption:21840, production:20890, offset:95.6, savings:58520,
  panel:'Jinko Tiger Neo 640 W', inverter:'Huawei SUN2000-12K-MAP0', completeness:72
};

export const monthly = [
  {m:'Sep',kwh:1650},{m:'Oct',kwh:1710},{m:'Nov',kwh:1540},{m:'Dec',kwh:1480},{m:'Jan',kwh:1605},{m:'Feb',kwh:1690},
  {m:'Mar',kwh:1840},{m:'Apr',kwh:1975},{m:'May',kwh:2110},{m:'Jun',kwh:2250},{m:'Jul',kwh:2080},{m:'Aug',kwh:1910}
];

export const projects = [
  {...project, type:'Residential', stage:'Design', next:'Confirm module layout', modules:20},
  {id:'SOL-2026-0183',name:'Casa Altabrisa',customer:'Ricardo Nájera',address:'Mérida, Yucatán',tariff:'DAC',type:'Residential',stage:'Proposal',kwp:8.96,offset:91,next:'Review proposal',modules:14},
  {id:'SOL-2026-0182',name:'Clínica Santa Ana',customer:'Grupo Méderi',address:'Veracruz, Veracruz',tariff:'GDMTO',type:'Commercial',stage:'Design',kwp:31.36,offset:87,next:'String configuration',modules:49},
  {id:'SOL-2026-0181',name:'Bodega Córdoba',customer:'Logística del Golfo',address:'Córdoba, Veracruz',tariff:'GDMTH',type:'Industrial',stage:'Consumption',kwp:74.24,offset:78,next:'Validate demand profile',modules:116},
  {id:'SOL-2026-0179',name:'Residencia Lomas',customer:'Lucía Andrade',address:'Puebla, Puebla',tariff:'PDBT',type:'Residential',stage:'Equipment',kwp:10.24,offset:98,next:'Select inverter',modules:16}
];

export const equipment = {
  panels:[
    {maker:'Jinko Solar',model:'Tiger Neo N-type 64HL4M-BDV',power:'640 W',eff:'23.0%',voc:'46.11 V',isc:'13.94 A',warranty:'30 yr'},
    {maker:'LONGi',model:'Hi-MO 7 LR7-72HGD',power:'620 W',eff:'22.8%',voc:'52.28 V',isc:'15.08 A',warranty:'30 yr'},
    {maker:'Canadian Solar',model:'TOPHiKu6',power:'455 W',eff:'22.8%',voc:'39.5 V',isc:'14.56 A',warranty:'30 yr'}
  ],
  inverters:[
    {maker:'Huawei',model:'SUN2000-12K-MAP0',power:'12 kW',eff:'98.4%',mppt:'2 MPPT',voltage:'1100 V max DC',warranty:'10 yr'},
    {maker:'Sungrow',model:'SG12.0RT',power:'12 kW',eff:'98.5%',mppt:'2 MPPT',voltage:'1100 V max DC',warranty:'10 yr'},
    {maker:'Fronius',model:'Symo GEN24 12.0 Plus',power:'12 kW',eff:'98.2%',mppt:'3 MPPT',voltage:'1000 V max DC',warranty:'10 yr'}
  ],
  batteries:[
    {maker:'Huawei',model:'LUNA2000-14-S1',capacity:'14 kWh',power:'7 kW',eff:'95%',warranty:'15 yr'},
    {maker:'BYD',model:'Battery-Box Premium HVM 13.8',capacity:'13.8 kWh',power:'6 kW',eff:'96%',warranty:'10 yr'},
    {maker:'Tesla',model:'Powerwall 3',capacity:'13.5 kWh',power:'11.5 kW',eff:'97.5%',warranty:'10 yr'}
  ]
};

export const cashflow = [
  {y:0,cum:-278400},{y:1,cum:-219880},{y:2,cum:-159605},{y:3,cum:-97522},{y:4,cum:-33577},{y:5,cum:32286},
  {y:6,cum:100125},{y:7,cum:169999},{y:8,cum:241969},{y:9,cum:316098},{y:10,cum:392451}
];
