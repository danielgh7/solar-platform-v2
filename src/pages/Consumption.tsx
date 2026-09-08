import { FileText, Upload, Zap } from 'lucide-react';
import { ConsumptionChart } from '../components/Charts';
import { WorkflowStrip } from '../components/ProjectContext';
import { project } from '../data';

export function Consumption(){
  return <main className="page project-page"><div className="page-header"><div><span className="eyebrow">ENERGY BASELINE</span><h1>Consumption</h1><p>CFE service profile used to size and validate the solar system.</p></div><div className="data-quality"><small>DATA SOURCE</small><b>Manual / mock</b><span>12 months complete</span></div></div><WorkflowStrip active="Consumption"/>
    <section className="consumption-summary"><div><small>CFE TARIFF</small><b>DAC</b><span>Residential high consumption</span></div><div><small>ANNUAL ENERGY</small><b>21,840 kWh</b><span>Monthly history complete</span></div><div><small>ANNUAL CFE COST</small><b>MX$ 66,050</b><span>Illustrative R0 baseline</span></div><div><small>PEAK MONTH</small><b>2,250 kWh</b><span>June</span></div></section>
    <div className="consumption-grid"><section className="energy-chart-panel"><header><div><small>12-MONTH CFE HISTORY</small><h2>Monthly energy consumption</h2></div><span>kWh / month</span></header><ConsumptionChart/></section><aside className="service-panel"><header><small>SERVICE METRICS</small><h2>Electrical context</h2></header><dl><div><dt>Service class</dt><dd>Residential</dd></div><div><dt>Tariff</dt><dd>DAC</dd></div><div><dt>Demand</dt><dd>N/A for this service</dd></div><div><dt>Power factor</dt><dd>N/A for this service</dd></div><div><dt>Billing period</dt><dd>Bimonthly source / monthly model</dd></div></dl><div className="service-note"><Zap size={15}/><span><b>Commercial / industrial services</b><small>Demand and power factor fields appear when tariff type requires them.</small></span></div></aside></div>
    <section className="bill-import"><div><FileText size={19}/><span><small>CFE SOURCE DOCUMENT</small><b>Attach bill to support the baseline</b><em>R0.1 keeps this workflow visual only; no parsing is performed.</em></span></div><button className="secondary"><Upload size={14}/>Upload CFE bill</button></section>
  </main>;
}
