const fs = require('fs');

let content = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');

const oldHandle = `      const reportData = { ...report.rawData } as any;
      if (typeof reportData.property === 'string') {
        reportData.property = { _id: reportData.property, name: report.property };
      }

      const nspireReport = generateNSPIREReport(reportData);`;

const newHandle = `      const reportData = { ...report.rawData } as any;
      if (typeof reportData.property === 'string') {
        reportData.property = { _id: reportData.property, name: report.property };
      }
      
      // Ensure findings array exists for the generator
      reportData.findings = reportData.findings || reportData.deficiencies || [];
      reportData.inspectorName = report.inspector;

      const nspireReport = generateNSPIREReport(reportData);`;

content = content.replace(oldHandle, newHandle);
fs.writeFileSync('src/screens/ReportsScreen.tsx', content, 'utf8');
