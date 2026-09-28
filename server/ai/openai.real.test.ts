import {describe,it,expect} from 'vitest';import fs from 'node:fs';import path from 'node:path';import {OpenAIProvider} from './provider';
const key=process.env.OPENAI_API_KEY,run=process.env.RUN_OPENAI_REAL_EVALS==='true'&&Boolean(key),suite=run?describe:describe.skip;
suite('R8 opt-in OpenAI multimodal validation',()=>{
 const provider=()=>new OpenAIProvider(key!,process.env.OPENAI_MODEL||'gpt-5.1',60_000);
 it.each(['representative-pdf.pdf','photographed-bill.png','multi-page.pdf','rotated-image.png','low-resolution.png','ambiguous-needs-review.pdf'])('validates %s without customer data',async(filename)=>{const bytes=fs.readFileSync(path.resolve('fixtures/r8/real-provider',filename)),mimeType=filename.endsWith('.pdf')?'application/pdf':'image/png';const result=await provider().extractCfeBill({documentId:filename,filename,mimeType,bytes});expect(result.value.schemaVersion).toBe(1)});
});
