// Conversion Script: JSON -> TypeScript for insideDeficiencyMapping.ts
// Run: node convert-json-to-ts.js

const fs = require('fs');

// Read the JSON - I'll load the full data directly here since the JSON is large
// The JSON structure from the user is stored in a variable

// ============================================================
// YOUR JSON DATA - COPY THE FULL JSON HERE
// ============================================================
const jsonData = require('./temp-unit-data.json');

// ============================================================
// TRANSFORMATION FUNCTIONS
// ============================================================

function generateId(categoryIndex, subcategoryIndex, deficiencyIndex) {
    return `unit_${categoryIndex}_${subcategoryIndex}_${deficiencyIndex}`;
}

function normalizeSeverity(severity) {
    const map = {
        'Life-Threatening': 'Life-Threatening',
        'Life Threatening': 'Life-Threatening',
        'Life threatening': 'Life-Threatening',
        'severe': 'Severe',
        'Severe': 'Severe',
        'MODERATE': 'Moderate',
        'Moderate': 'Moderate',
        'Low': 'Low',
        'low': 'Low'
    };
    return map[severity] || 'Moderate';
}

function transformCategory(categoryObj, catIndex) {
    const subcategoryMap = {};
    const deficiencies = categoryObj.deficiencies || [];

    deficiencies.forEach((def, defIndex) => {
        const subName = def.deficiency_selected || 'General';
        if (!subcategoryMap[subName]) {
            subcategoryMap[subName] = [];
        }

        subcategoryMap[subName].push({
            id: generateId(catIndex, subName.replace(/\s+/g, '_'), defIndex),
            name: def.deficiency_detail || def.deficiency_selected,
            detail: def.deficiency_detail || '',
            criteria: def.deficiency_detail || '',
            severity: normalizeSeverity(def.health_safety),
            repairBy: def.repair_by || '30 Day',
            points: def.score_formula || '5.0/n',
            code: `${categoryObj.name.toUpperCase().replace(/\s+/g, '-').substring(0, 10)}-${defIndex + 1}`,
            codeReference: def.how_to_inspect || ''
        });
    });

    const subcategories = Object.keys(subcategoryMap).map(name => ({
        name,
        deficiencies: subcategoryMap[name]
    }));

    return {
        itemName: categoryObj.name,
        subcategories
    };
}

function generateTypeScript(categories) {
    const lines = [];
    lines.push('// Auto-generated Unit Deficiency Mapping');
    lines.push('// Generated from NSPIRE Standards JSON');
    lines.push('');
    lines.push('export interface InsideDeficiencyOption {');
    lines.push('    id: string;');
    lines.push('    name: string;');
    lines.push('    detail: string;');
    lines.push('    criteria: string;');
    lines.push('    severity: \'Life-Threatening\' | \'Severe\' | \'Moderate\' | \'Low\';');
    lines.push('    repairBy: string;');
    lines.push('    points: string;');
    lines.push('    code?: string;');
    lines.push('    codeReference?: string;');
    lines.push('}');
    lines.push('');
    lines.push('export interface InsideSubcategory {');
    lines.push('    name: string;');
    lines.push('    deficiencies: InsideDeficiencyOption[];');
    lines.push('}');
    lines.push('');
    lines.push('export interface InsideItemDeficiencies {');
    lines.push('    itemName: string;');
    lines.push('    subcategories?: InsideSubcategory[];');
    lines.push('    deficiencies?: InsideDeficiencyOption[];');
    lines.push('}');
    lines.push('');

    // Generate category exports
    const categoryExports = [];

    categories.forEach((cat, index) => {
        const constName = cat.itemName
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '_')
            .substring(0, 30) + '_DEFICIENCIES';

        categoryExports.push(constName);

        lines.push(`// ==========================================`);
        lines.push(`// ${index + 1}. ${cat.itemName.toUpperCase()}`);
        lines.push(`// ==========================================`);
        lines.push(`export const ${constName}: InsideItemDeficiencies = {`);
        lines.push(`    itemName: '${cat.itemName}',`);
        lines.push('    subcategories: [');

        cat.subcategories.forEach((sub, subIndex) => {
            const subConstName = sub.name
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '_')
                .substring(0, 30);

            lines.push(`        {`);
            lines.push(`            name: '${sub.name}',`);
            lines.push(`            deficiencies: [`);

            sub.deficiencies.forEach((def, defIndex) => {
                lines.push(`                {`);
                lines.push(`                    id: '${def.id}',`);
                lines.push(`                    name: \`${def.name}\`,`);
                lines.push(`                    detail: \`${def.detail}\`,`);
                lines.push(`                    criteria: \`${def.criteria}\`,`);
                lines.push(`                    severity: '${def.severity}',`);
                lines.push(`                    repairBy: '${def.repairBy}',`);
                lines.push(`                    points: '${def.points}',`);
                lines.push(`                    code: '${def.code}',`);
                lines.push(`                    codeReference: \`${def.codeReference}\``);
                lines.push(`                }${defIndex < sub.deficiencies.length - 1 ? ',' : ''}`);
            });

            lines.push(`            ]`);
            lines.push(`        }${subIndex < cat.subcategories.length - 1 ? ',' : ''}`);
        });

        lines.push('    ]');
        lines.push('};');
        lines.push('');
    });

    // Generate ALL_UNITS_CATEGORIES array
    lines.push('// ==========================================');
    lines.push('// ALL UNIT CATEGORIES');
    lines.push('// ==========================================');
    lines.push('export const ALL_UNIT_CATEGORIES: InsideItemDeficiencies[] = [');
    categoryExports.forEach((exp, index) => {
        lines.push(`    ${exp}${index < categoryExports.length - 1 ? ',' : ''}`);
    });
    lines.push('];');

    lines.push('');
    lines.push('// ==========================================');
    lines.push('// HELPER FUNCTIONS');
    lines.push('// ==========================================');
    lines.push('');
    lines.push('export function getAllDeficiencies(): InsideDeficiencyOption[] {');
    lines.push('    const allDefs: InsideDeficiencyOption[] = [];');
    lines.push('    ALL_UNIT_CATEGORIES.forEach(cat => {');
    lines.push('        if (cat.subcategories) {');
    lines.push('            cat.subcategories.forEach(sub => {');
    lines.push('                allDefs.push(...sub.deficiencies);');
    lines.push('            });');
    lines.push('        }');
    lines.push('    });');
    lines.push('    return allDefs;');
    lines.push('}');
    lines.push('');
    lines.push('export function getDeficiencyById(id: string): InsideDeficiencyOption | undefined {');
    lines.push('    const allDefs = getAllDeficiencies();');
    lines.push('    return allDefs.find(d => d.id === id);');
    lines.push('}');
    lines.push('');
    lines.push('export function getCategoriesList(): string[] {');
    lines.push('    return ALL_UNIT_CATEGORIES.map(c => c.itemName);');
    lines.push('}');

    return lines.join('\n');
}

// Main execution
console.log('Starting conversion...');
console.log('Categories found:', jsonData.categories?.length || 0);

try {
    const categories = jsonData.categories.map((cat, index) => transformCategory(cat, index));
    const tsCode = generateTypeScript(categories);

    fs.writeFileSync('./src/data/unitDeficiencyMapping.ts', tsCode);
    console.log('SUCCESS: Generated src/data/unitDeficiencyMapping.ts');
    console.log('File contains', categories.length, 'categories');
} catch (error) {
    console.error('ERROR:', error.message);
}
