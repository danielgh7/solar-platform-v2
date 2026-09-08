import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cashflow, monthly } from '../data';

export function ConsumptionChart(){
  return <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly} margin={{top:12,right:14,left:-18,bottom:0}}><CartesianGrid vertical={false} stroke="#e7ebed"/><XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={10}/><YAxis tickLine={false} axisLine={false} fontSize={10}/><Tooltip/><Bar dataKey="kwh" fill="#305f55" radius={[2,2,0,0]}/></BarChart></ResponsiveContainer></div>;
}

export function CashflowChart(){
  return <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={cashflow} margin={{top:12,right:14,left:-12,bottom:0}}><defs><linearGradient id="cash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#315f55" stopOpacity=".22"/><stop offset="1" stopColor="#315f55" stopOpacity=".02"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e7ebed"/><XAxis dataKey="y" tickLine={false} axisLine={false} fontSize={10}/><YAxis tickFormatter={(v)=>`${Math.round(v/1000)}k`} tickLine={false} axisLine={false} fontSize={10}/><Tooltip formatter={(v)=>`MX$ ${Number(v).toLocaleString()}`}/><Area type="monotone" dataKey="cum" stroke="#315f55" fill="url(#cash)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div>;
}
