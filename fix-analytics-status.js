const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/AnalyticsScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldStr = `const filters: any = { status: 'completed' };
        // Handle property filtering on the frontend to ensure database nested IDs don't cause 0 results
        inspectionsData = await inspectionService.getInspections(filters);`;

const newStr = `const filters: any = {}; // Fetch all inspections (in-progress and completed)
        // Handle property filtering on the frontend to ensure database nested IDs don't cause 0 results
        inspectionsData = await inspectionService.getInspections(filters);`;

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed status filter in AnalyticsScreen");
} else {
    console.log("Could not find string");
}

