const fs = require('fs');
const fn = 'src/services/enhancedNspirePDFService.ts';
let d = fs.readFileSync(fn, 'utf8');

d = d.replace(/const makeCodeRefLink = \([\s\S]*?return `<a href=\"\${url}\"[\s\S]*?<\/a>\`;\n  };/, 
  `const makeCodeRefLink = (nspireCode: string, codeReference?: any) => {
    const rawRef = typeof codeReference === 'string' ? codeReference : (codeReference?.text || codeReference?.source || '');
    let lbl = nspireCode && nspireCode !== '-' ? nspireCode : (rawRef ? 'How to Inspect' : '-');
    if (!rawRef && lbl === '-') return '-';
    if (!rawRef) return esc(lbl);
    const url = \`https://inspirebackend-eight.vercel.app/api/code-ref?code=\${encodeURIComponent(lbl)}&ref=\${encodeURIComponent(rawRef)}\`;
    return \`<a href="\${url}" style="color:#0E7490;font-weight:600;text-decoration:underline;" target="_blank">\${esc(lbl)}</a>\`;
  };`
);

fs.writeFileSync(fn, d);
console.log("Cleanup makeCodeRefLink done");
