const fs = require('fs');
let txt = fs.readFileSync('src/screens/BuildingInspectionScreen.tsx', 'utf8');

const find = "progressData: {\n          outsideProgress,\n          insideProgress,\n          unitProgress,\n          outsideTotal: OUTSIDE_ITEMS.length,\n          insideTotal: INSIDE_ITEMS.length,\n          unitTotal: unitTotalItems\n        }";

const replace = "progressData: {\n          outsideProgress,\n          insideProgress,\n          unitProgress,\n          outsideTotal: OUTSIDE_ITEMS.length,\n          insideTotal: INSIDE_ITEMS.length,\n          unitTotal: unitTotalItems,\n          buildingProgressMap: buildingProgressMap || {}\n        }";

if(txt.includes(find)){
  txt = txt.replace(find, replace);
  fs.writeFileSync('src/screens/BuildingInspectionScreen.tsx', txt);
  console.log("Replaced!");
} else {
  console.log("Not found.");
}
