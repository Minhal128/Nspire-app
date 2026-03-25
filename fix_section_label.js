const fs = require('fs');
const file = 'src/screens/DeficiencyDetailScreen.tsx';

let content = fs.readFileSync(file, 'utf8');

const targetStyle = `  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 8,
    letterSpacing: 0.5,
  },`;

const replacementStyle = `  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    letterSpacing: 0.5,
  },`;

if (content.includes(targetStyle)) {
  content = content.replace(targetStyle, replacementStyle);
  fs.writeFileSync(file, content);
  console.log("Replaced sectionLabel style!");
} else {
  console.log("Could not find the target styling.");
}
