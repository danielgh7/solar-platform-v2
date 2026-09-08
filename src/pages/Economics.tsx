import { CashflowChart } from '../components/Charts';
import { WorkflowStrip } from '../components/ProjectContext';

export function Economics(){
  return <main className="page project-page"><div className="page-header"><div><span className="eyebrow">CURRENT PROJECT SCENARIO</span><h1>Economics</h1><p>Illustrative financial view derived from the active 12.80 kWp solar scenario.</p></div><span className="scenario-tag">R0 mock scenario</span></div><WorkflowStrip active="Economics"/>
    <section className="economics-kpis"><div><small>INVESTMENT</small><b>MX$ 278,400</b></div><div><small>ANNUAL SAVINGS</small><b>MX$ 58,520</b></div><div><small>PAYBACK</small><b>4.7 years</b></div><div><small>ROI</small><b>21.0%</b></div><div><small>IRR</small><b>19.4%</b></div><div><small>NPV</small><b>MX$ 412,600</b></div></section>
    <div className="economics-grid"><section className="cashflow-panel"><header><div><small>10-YEAR CUMULATIVE CASH FLOW</small><h2>Project cash position</h2></div><span>MXN</span></header><CashflowChart/></section><aside className="assumption-panel"><header><small>SCENARIO ASSUMPTIONS</small><h2>Current technical inputs</h2></header><dl><div><dt>PV system</dt><dd>12.80 kWp</dd></div><div><dt>Annual production</dt><dd>20,890 kWh</dd></div><div><dt>CFE baseline</dt><dd>MX$ 66,050 / yr</dd></div><div><dt>Energy offset</dt><dd>95.6%</dd></div><div><dt>Annual degradation</dt><dd>0.45%</dd></div><div><dt>Analysis horizon</dt><dd>25 years</dd></div></dl><p>All economics remain illustrative R0.1 mock values; no financial engine is introduced.</p></aside></div>
  </main>;
}
