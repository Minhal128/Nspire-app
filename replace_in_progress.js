const fs = require('fs');

const path = 'src/services/enhancedNspirePDFService.ts';
let code = fs.readFileSync(path, 'utf8');

const startStr = 'function generateInProgressDeficiencyTable(';
const startIdx = code.indexOf(startStr);
if (startIdx === -1) {
    console.error("Function not found");
    process.exit(1);
}

let braceCount = 0;
let started = false;
let endIdx = -1;

for (let i = startIdx; i < code.length; i++) {
    if (code[i] === '{') {
        braceCount++;
        started = true;
    } else if (code[i] === '}') {
        braceCount--;
        if (started && braceCount === 0) {
            endIdx = i + 1;
            break;
        }
    }
}

if (endIdx === -1) {
    console.error("End of function not found");
    process.exit(1);
}

const newMethod = `function generateInProgressDeficiencyTable(
  report: any,
  imageMap: Map<string, string>
): string {
  const m = report.metadata;
  const pData = m.progressData || { 
    outsideProgress: 0, insideProgress: 0, unitProgress: 0, 
    outsideTotal: 1, insideTotal: 1, unitTotal: 1,
    buildingProgressMap: {}
  };
  
  const bMap = pData.buildingProgressMap || {};

  const esc = (txt: string | undefined | null) => (txt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  const makeCodeRefLink = (nspireCode: string, codeReference?: { source?: string, text?: string }) => {
    let lbl = nspireCode && nspireCode !== '-' ? nspireCode : 'HCV';
    return lbl;
  };

  const deficiencies = report.deficiencies || [];
  if (!deficiencies.length) {
    return \`
  <div>
    <h3 class="section-title">Inspectable Areas Deficiencies</h3>
    <table class="dt">
      <thead>
        <tr>
          <th style="width:22%">Deficiency Details</th>
          <th style="width:10%">Code of Reference</th>
          <th style="width:16%">Deficiency Picture</th>
          <th style="width:9%">Deduction Pts.</th>
          <th style="width:11%">Repeat Indicator</th>
          <th style="width:9%">Severity</th>
          <th style="width:13%">Note</th>
        </tr>
      </thead>
      <tbody>
        <tr><td colspan="7" style="text-align:center;padding:20px;">No inspectable data available.</td></tr>
      </tbody>
    </table>
  </div>\`;
  }

  const detailsSeen = new Map<string, number>();
  const repeatFlags = deficiencies.map((def: any) => {
    const key = (def.deficiencyDetails || '').trim().toLowerCase();
    if (!key) return false;
    const count = detailsSeen.get(key) || 0;
    detailsSeen.set(key, count + 1);
    return count > 0;
  });

  interface GroupedDef { def: any; isRepeat: boolean; }
  const buildingsMap = new Map<string, Map<string, GroupedDef[]>>();

  // Create a bucket for every building that has deficiencies
  deficiencies.forEach((def: any, idx: number) => {
    const building = def.building || 'Building';
    if (!buildingsMap.has(building)) buildingsMap.set(building, new Map());
    
    // Within building, segment by 'Outside', 'Inside', 'Units', or 'General Comment'
    let area = def.area || '';
    if (def.isGeneralComment) {
       area = def.category || area || 'Other';
    }
    
    let subGroupKey = 'Other';
    const lArea = area.toLowerCase();
    if (lArea.includes('outside')) subGroupKey = 'Outside';
    else if (lArea.includes('inside')) subGroupKey = 'Inside';
    else if (lArea.includes('unit')) subGroupKey = 'Units';
    
    const buildingGroups = buildingsMap.get(building)!;
    if (!buildingGroups.has(subGroupKey)) buildingGroups.set(subGroupKey, []);
    buildingGroups.get(subGroupKey)!.push({ def, isRepeat: def.repeatIndicator || repeatFlags[idx] });
  });

  // Add empty buildings from progress map
  Object.keys(bMap).forEach((bName) => {
    if (!buildingsMap.has(bName)) buildingsMap.set(bName, new Map());
  });

  // Sort Buildings alphabetically
  const sortedBuildings = Array.from(buildingsMap.keys()).sort((a,b) => a.localeCompare(b));

  let rows = '';

  sortedBuildings.forEach(building => {
      const bProgress = bMap[building] || { out: 0, in: 0, un: 0 };
      
      const outPct = Math.min(100, Math.round((bProgress.out / (pData.outsideTotal || 1)) * 100));
      const inPct = Math.min(100, Math.round((bProgress.in / (pData.insideTotal || 1)) * 100));
      const unPct = Math.min(100, Math.round((bProgress.un / (pData.unitTotal || 1)) * 100));

      const buildingGroups = buildingsMap.get(building)!;
      
      // Enforce order: Outside -> Inside -> Units
      const ordering = [
         { key: 'Outside', pct: outPct },
         { key: 'Inside', pct: inPct },
         { key: 'Units', pct: unPct },
         { key: 'Other', pct: null }
      ];

      ordering.forEach(groupOrderDef => {
         const items = buildingGroups.get(groupOrderDef.key);
         if (!items || items.length === 0) {
             return; 
         }

         const displayGroupKey = groupOrderDef.pct !== null 
            ? \`\${building} - \${groupOrderDef.key} (\${groupOrderDef.pct}% Complete)\` 
            : \`\${building} - \${groupOrderDef.key}\`;

         rows += \`\\n<tr class="gh"><td colspan="7">\${esc(displayGroupKey)}</td></tr>\\n\`;

         items.forEach(({ def, isRepeat }) => {
            let imgSrc = '';
            if (def.imageUri) {
               if (def.imageUri.startsWith('data:')) {
                  imgSrc = def.imageUri;
               } else {
                  imgSrc = imageMap.get(def.imageUri) || '';
               }
            }
            const imgCell = imgSrc
               ? \`<img src="\${imgSrc}" style="width:80px;height:60px;object-fit:cover;border:1px solid #000;display:block;margin:0 auto" />\`
               : \`<div class="ip">Photo</div>\`;
            
            // Special handling for NO OD or General Comments
            const isNoOD = def.title === 'No OD' || def.deficiencyName === 'No OD';
            const isGC = !!def.isGeneralComment;
            
            if (isNoOD) {
                // Merge columns to say "No all OD" as requested
                rows += \`<tr class="avoid-break"><td colspan="7" style="text-align:center;font-weight:bold;padding:10px;">All NO OD (No Observable Deficiencies)</td></tr>\\n\`;
            } else {
                rows += \`<tr class="avoid-break">
  <td class="la">\${isGC ? '-' : esc(def.deficiencyDetails || 'No details available')}</td>
  <td class="la" style="text-align:center;vertical-align:middle;">\${isGC ? '-' : makeCodeRefLink(def.nspireCode, def.codeReference)}</td>
  <td>\${imgCell}</td>
  <td>\${isGC ? '-' : (def.deductionPts || '-')}</td>
  <td>\${isGC ? '-' : (isRepeat ? 'Repeat' : 'Not Repeat')}</td>
  <td>\${isGC ? '-' : esc(def.severity || '-')}</td>
  <td class="la">\${esc(def.note || def.comments || '-')}</td>
  </tr>\\n\`;
            }
         });
      });
  });

  if (!rows) {
     rows = '<tr><td colspan="7" style="text-align:center;padding:20px;">No inspectable areas data available.</td></tr>';
  }

  return \`
  <div>
    <h3 class="section-title">Inspectable Areas Deficiencies</h3>
    <table class="dt">
      <thead>
        <tr>
          <th style="width:22%">Deficiency Details</th>
          <th style="width:10%">Code of Reference</th>
          <th style="width:16%">Deficiency Picture</th>
          <th style="width:9%">Deduction Pts.</th>
          <th style="width:11%">Repeat Indicator</th>
          <th style="width:9%">Severity</th>
          <th style="width:13%">Note</th>
        </tr>
      </thead>
      <tbody>
        \${rows}
      </tbody>
    </table>
  </div>\`;
}`;

const newContent = code.substring(0, startIdx) + newMethod + code.substring(endIdx);
fs.writeFileSync(path, newContent);
console.log("PDF Service Updated!");
