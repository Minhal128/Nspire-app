const fs = require('fs');
const path = './src/screens/AnalyticsScreen.tsx';

let code = fs.readFileSync(path, 'utf8');

const oldTop = `      const deficiencySummary = {
        lifeThreatening: 0,
        severe: 0,
        moderate: 0,
        low: 0,
      };`;

const newTop = `      let totalFindings = 0;
      const allFindings: any[] = [];`;

let indexTop = code.indexOf(oldTop);
if (indexTop !== -1) {
  code = code.replace(oldTop, newTop);
  console.log('Replaced oldTop');
} else {
  console.log('oldTop NOT FOUND');
}

// I will just rip out everything between "Extract common issues from findings" to "const trendData ="
const regex = /\/\/ Extract common issues from findings[\s\S]*?(?=const trendData =)/;

const newMiddle = `// Extract common issues from findings
        const findings = inspection.findings || inspection.deficiencies || [];
        // console.log('Inspection findings for property:', propId, 'Count:', findings.length);
        findings.forEach((finding: any) => {
          totalFindings++;
          allFindings.push(finding);
        });
      });

      // Calculate summary using the shared utility function (same as Export PDF)
      const formattedDeficiencies = convertFindingsToDeficiencies(allFindings, { building: 'A', unit: '-' });
      const calculatedSummary = calculateDeficiencySummary(formattedDeficiencies);
      const deficiencySummary = {
        lifeThreatening: calculatedSummary.lifeThreatening,
        severe: calculatedSummary.severe,
        moderate: calculatedSummary.moderate,
        low: calculatedSummary.low,
      };

      `;

if (regex.test(code)) {
  code = code.replace(regex, newMiddle);
  console.log('Replaced middle block');
} else {
  console.log('Middle not found');
}

fs.writeFileSync(path, code);
