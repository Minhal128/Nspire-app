const fs = require('fs');
const file = 'src/screens/AnalyticsScreen.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(
  `      // Filter by selected property if one is selected
      if (property) {
        inspectionsList = inspectionsList.filter((inspection: any) => {
          const propId = typeof inspection.property === 'object' ? inspection.property?._id : inspection.property;
          return propId === property;
        });
      }`,
  `      // Filter by selected property if one is selected
      if (property) {
        inspectionsList = inspectionsList.filter((inspection: any) => {
          const propId = typeof inspection.property === 'object' ? (inspection.property?._id || inspection.property?.id) : (inspection.property || inspection.propertyId);
          return propId === property;
        });
      }`
);

fs.writeFileSync(file, txt);
