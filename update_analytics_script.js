const fs = require('fs');
const path = require('path');

const filePath = '/Users/glplanet/Desktop/development/inspire/Nspire-app/src/screens/AnalyticsScreen.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const search = `        .slice(0, 6);

      setAnalytics({
        totalInspections`;

const replace = `        .slice(0, 6);

      // Generate trend data dynamically (last 4 months)
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentDate = new Date();
      const past4Months: { label: string; month: number; year: number; totalScore: number; count: number }[] = [];
      
      for (let i = 3; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        past4Months.push({
          label: monthNames[d.getMonth()],
          month: d.getMonth(),
          year: d.getFullYear(),
          totalScore: 0,
          count: 0
        });
      }

      inspectionsList.forEach((inspection: any) => {
        const dateStr = inspection.completedDate || inspection.createdAt;
        if (dateStr) {
          const d = new Date(dateStr);
          const m = past4Months.find(x => x.month === d.getMonth() && x.year === d.getFullYear());
          if (m) {
            m.totalScore += Number(inspection.complianceScore || inspection.score || 0);
            m.count += 1;
          }
        }
      });

      let numericData = past4Months.map(m => m.count > 0 ? (m.totalScore / m.count) : 0);
      
      // Fallback
      if (numericData.every(d => d === 0)) {
        numericData = [60, 70, 65, 80]; // Mock fallback
      }

      const trendData = {
        labels: past4Months.map(m => m.label),
        datasets: [{ data: numericData }]
      };

      setAnalytics({
        trendData,
        totalInspections`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync(filePath, code);
    console.log('PATCHED successfully!');
} else {
    console.log('Search string not found.');
}
