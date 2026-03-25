const fs = require('fs');
const file = 'src/services/enhancedNspirePDFService.ts';
let content = fs.readFileSync(file, 'utf8');

const updatedMakeCodeRefLink = `const makeCodeRefLink = (nspireCode: string, codeReference?: any) => {
    let lbl = nspireCode && nspireCode !== '-' ? nspireCode : 'HS-12';
    const rawRef = typeof codeReference === 'string' ? codeReference : (codeReference?.text || codeReference?.source || '');
    const url = \`https://inspirebackend-eight.vercel.app/api/code-ref?code=\${encodeURIComponent(lbl)}&ref=\${encodeURIComponent(rawRef)}\`;
    return \`<a href="\${url}" style="color:#0E7490;font-weight:600;text-decoration:underline;" target="_blank">\${esc(lbl)}</a>\`;
  };`;

content = content.replace(
    "const makeCodeRefLink = (nspireCode: string, codeReference?: { source?: string, text?: string }) => {\n    let lbl = nspireCode && nspireCode !== '-' ? nspireCode : 'HCV';\n    return lbl;\n  };",
    updatedMakeCodeRefLink
);

content = content.replace(
    /function makeCodeRefLink\(nspireCode: string, codeReference\?: string\): string \{\n  const shortCode = esc\(nspireCode \|\| '-'\);\n  if \(\!codeReference\) return shortCode;\n  const url = `https:\/\/inspirebackend-eight.vercel.app\/api\/code-ref\?code=\$\{encodeURIComponent\(nspireCode\)\}&ref=\$\{encodeURIComponent\(codeReference\)\}`;\n  return `<a href="\$\{url\}" style="color:#0E7490;font-weight:600;text-decoration:underline;">\$\{shortCode\}<\/a>`;\n\}/g,
    `function makeCodeRefLink(nspireCode: string, codeReference?: any): string {
  const shortCode = esc(nspireCode && nspireCode !== '-' ? nspireCode : 'HS-12');
  const rawRef = typeof codeReference === 'string' ? codeReference : (codeReference?.text || codeReference?.source || '');
  const url = \`https://inspirebackend-eight.vercel.app/api/code-ref?code=\${encodeURIComponent(shortCode)}&ref=\${encodeURIComponent(rawRef)}\`;
  return \`<a href="\${url}" style="color:#0E7490;font-weight:600;text-decoration:underline;" target="_blank">\${shortCode}</a>\`;
}`
);

fs.writeFileSync(file, content);
console.log('PDF link fixed');
