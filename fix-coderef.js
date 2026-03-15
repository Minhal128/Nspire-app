// Script to remove secondary codeReference fields from outsideDeficiencyMapping.ts
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'outsideDeficiencyMapping.ts');
let content = fs.readFileSync(filePath, 'utf8');

// IDs that should NOT have codeReference (blank in user's JSON)
const idsToRemove = [
  'chim_out_2', 'dryer_out_2', 'dryer_out_3',
  'door_out_3',
  'drain_out_2', 'drain_out_3', 'drain_out_4',
  'elec_out_3', 'elec_out_4', 'elec_out_6', 'elec_out_7',
  'fence_out_2', 'fence_out_3',
  'fire_out_4', 'fire_out_5', 'fire_out_8', 'fire_out_9', 'fire_out_10',
  'found_out_2', 'found_out_3', 'found_out_4',
  'leak_sew_out_2', 'leak_sew_out_3', 'leak_sew_out_4',
  'leak_water_out_2',
  'light_out_2',
  'park_out_2', 'park_out_3', 'park_out_4',
  'paint_out_2',
  'rail_out_2', 'rail_out_4', 'rail_out_5', 'rail_out_6',
  'roof_out_2', 'roof_out_3', 'roof_out_4', 'roof_out_5', 'roof_out_6',
  'side_out_2',
  'stair_out_2', 'stair_out_3',
  'ret_out_2', 'ret_out_3', 'ret_out_4', 'ret_out_5',
  'wh_out_2', 'wh_out_3', 'wh_out_4',
];

let removedCount = 0;

for (const id of idsToRemove) {
  // Find the deficiency block by its id
  const idPattern = new RegExp(`id: '${id}'`);
  const idMatch = idPattern.exec(content);
  if (!idMatch) {
    console.log(`WARNING: Could not find id '${id}'`);
    continue;
  }
  
  // Find the codeReference field after this id
  const searchStart = idMatch.index;
  // Find the closing of this deficiency object (next `    },` or `    }\n  ]`)
  const restContent = content.substring(searchStart);
  
  // Match codeReference: `...` (template literal) or codeReference: '...' or codeReference: "..."
  // Template literals can span multiple lines
  const codeRefMatch = restContent.match(/,\s*\n\s*codeReference:\s*`[^`]*`/);
  if (codeRefMatch) {
    const fullMatch = codeRefMatch[0];
    const absoluteIndex = searchStart + codeRefMatch.index;
    content = content.substring(0, absoluteIndex) + content.substring(absoluteIndex + fullMatch.length);
    removedCount++;
    console.log(`Removed codeReference from '${id}' (${fullMatch.length} chars)`);
  } else {
    // Try single-line string
    const codeRefMatch2 = restContent.match(/,\s*\n\s*codeReference:\s*['"][^'"]*['"]/);
    if (codeRefMatch2) {
      const fullMatch = codeRefMatch2[0];
      const absoluteIndex = searchStart + codeRefMatch2.index;
      content = content.substring(0, absoluteIndex) + content.substring(absoluteIndex + fullMatch.length);
      removedCount++;
      console.log(`Removed codeReference from '${id}' (single-line, ${fullMatch.length} chars)`);
    } else {
      console.log(`WARNING: Could not find codeReference for id '${id}'`);
    }
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nDone! Removed ${removedCount} codeReference fields out of ${idsToRemove.length} targets.`);
