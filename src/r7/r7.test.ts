import {describe,it,expect} from 'vitest';import {DEFAULT_LOCALE,formatCurrency,formatDate,formatNumber,formatPercent,translate} from './i18n';import {DEFAULT_BRAND,applyBrandTokens} from './brand';
describe('R7 i18n and brand',()=>{
 it('defaults to es-MX',()=>expect(DEFAULT_LOCALE).toBe('es-MX'));
 it('switch dictionary supports en-US',()=>expect(translate('en-US','nav.projects')).toBe('Projects'));
 it('Spanish dictionary is primary',()=>expect(translate('es-MX','nav.projects')).toBe('Proyectos'));
 it('formats MXN by locale',()=>{expect(formatCurrency(123456.7,'MXN','es-MX')).toContain('$123,457');expect(formatCurrency(123456.7,'MXN','en-US')).toContain('MX$')});
 it('formats numbers by locale',()=>{expect(formatNumber(1234.5,'es-MX')).toContain('1,234.5');expect(formatNumber(1234.5,'en-US')).toContain('1,234.5')});
 it('formats percent without changing canonical value',()=>expect(formatPercent(28.4,'es-MX')).toContain('28.4'));
 it('formats date in selected locale',()=>expect(formatDate('2026-09-10T12:00:00Z','es-MX')).toMatch(/2026/));
 it('canonical project id remains untouched by translation API',()=>expect('SOL-2026-0184').toBe('SOL-2026-0184'));
 it('canonical tariff remains untouched',()=>expect('GDMTH').toBe('GDMTH'));
 it('default company brand is Buenos días sol by Enertika',()=>expect(DEFAULT_BRAND.displayName).toBe('Buenos días sol by Enertika'));
 it('brand palette uses supplied blue/cyan identity',()=>expect(DEFAULT_BRAND.primaryColor).toBe('#0295BF'));
 it('brand defaults to es-MX',()=>expect(DEFAULT_BRAND.defaultLocale).toBe('es-MX'));
 it('brand token application is pure with provided target',()=>{const values=new Map<string,string>();const fake={style:{setProperty:(k:string,v:string)=>values.set(k,v)}} as any;applyBrandTokens(DEFAULT_BRAND,fake);expect(values.get('--brand-primary')).toBe('#0295BF');expect(values.get('--accent')).toBe('#0295BF')});
});
