const fs = require('fs');

let content = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');

// 1. Add nspirePDFService to import
content = content.replace(
    "import { generateNSPIREReportHTML } from '../services/nspirePDFService';",
    "import { generateNSPIREReportHTML, nspirePDFService } from '../services/nspirePDFService';"
);

// 2. Add handleShareReport
const handleShareStr = `  const handleShareReport = async (report: Report) => {
    try {
      setLoading(true);
      
      const reportData = { ...report.rawData } as any;
      if (typeof reportData.property === 'string') {
        reportData.property = { _id: reportData.property, name: report.property };
      }
      
      reportData.findings = reportData.findings || reportData.deficiencies || [];
      reportData.inspectorName = report.inspector;

      const nspireReport = generateNSPIREReport(reportData);
      
      const result = await nspirePDFService.generateAndSharePDF(nspireReport as any, { includeImages: true });
      
      if (!result.success) {
        Alert.alert('Share Failed', result.error || 'Could not share the report.');
      }
    } catch (err: any) {
      console.error('Failed to share report', err);
      Alert.alert('Error', \`Failed to share report: \${err.message}\`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport`;

content = content.replace("  const handleViewReport", handleShareStr);

// 3. Update the share button onPress
content = content.replace(
    "onPress={() => console.log('Share report:', report.property)}",
    "onPress={() => handleShareReport(report)}"
);

fs.writeFileSync('src/screens/ReportsScreen.tsx', content, 'utf8');
