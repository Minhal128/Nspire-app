const fs = require('fs');
const path = 'src/screens/ReportsScreen.tsx';
let data = fs.readFileSync(path, 'utf8');

const regex = /const handleViewReport \= async \([^\{]+\{[\s\S]+?\}\s*catch\s*\(err\)\s*\{[\s\S]+?\}\s*\};/m;

const newFunc = `const handleViewReport = async (report: Report) => {
      try {
        setLoading(true);
        setCurrentReportTitle(\`\${report.property} Report\`);
        
        // Mock full property if only ID is present
        const reportData = { ...report.rawData } as any;
        if (typeof reportData.property === 'string') {
          reportData.property = { _id: reportData.property, name: report.property } as any;
        }
        
        // Convert to standard NSPIRE format
        const nspireReport = generateNSPIREReport(reportData as any);
        
        // Generate HTML preview
        const html = generateNSPIREReportHTML(nspireReport as any, {
          authorName: user?.first_name ? \`\${user.first_name} \${user.last_name || ''}\` : 'Inspector'
        });
        
        setPreviewHtml(html);
        setPreviewModalVisible(true);
      } catch (err) {
        console.error('Failed to generate preview', err);
        Alert.alert('Error', 'Failed to generate report preview.');
      } finally {
        setLoading(false);
      }
    };`

data = data.replace(regex, newFunc);
fs.writeFileSync(path, data);
console.log('Fixed typings!');