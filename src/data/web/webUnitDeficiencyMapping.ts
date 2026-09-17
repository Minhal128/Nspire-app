import { ALL_UNIT_CATEGORIES } from './insideAppData';
import type { DeficiencyDetail } from './webDeficiencyMapping';

/**
 * Helper to convert AppData deficiency options to the format used by the UI.
 */
function convertToUIDetail(d: any): DeficiencyDetail {
    return {
        id: d.id,
        selected: d.name,
        detail: d.detail || d.name,
        criteria: d.criteria,
        codeAndCompliance: d.code ? `NSPIRE - ${d.code}` : 'NSPIRE',
        healthAndSafety: d.severity,
        repairBy: d.repairBy,
        pointsFormula: d.points,
    };
}

// Populate unitDeficiencyMapping dynamically from ALL_UNIT_CATEGORIES
export const unitDeficiencyMapping: Record<string, DeficiencyDetail[]> = {};

ALL_UNIT_CATEGORIES.forEach(categoryObj => {
    const categoryName = categoryObj.category.replace(/^\d+\.\s*/, '').trim();
    let allCategoryDefs: DeficiencyDetail[] = [];

    categoryObj.items.forEach(item => {
        let itemDefs: DeficiencyDetail[] = [];

        const mappedDefs = item.deficiencies.map(d => ({
            ...convertToUIDetail(d),
            selected: d.name,
            detail: d.detail,
            subcategory: item.itemName
        }));
        itemDefs = [...itemDefs, ...mappedDefs];

        const itemAny = item as any;
        if (itemAny.subcategories) {
            itemAny.subcategories.forEach((sub: any) => {
                const subName = sub.name || sub.itemName || item.itemName;
                const subDefs = sub.deficiencies.map((d: any) => ({
                    ...convertToUIDetail(d),
                    selected: (d as any).name || subName,
                    detail: (d as any).detail || (d as any).name,
                    subcategory: subName
                }));
                itemDefs = [...itemDefs, ...subDefs];
            });
        }

        // Key by specific item name
        unitDeficiencyMapping[item.itemName] = itemDefs;

        // Also accumulate for the category
        allCategoryDefs = [...allCategoryDefs, ...itemDefs];
    });

    // Key by the main category name (e.g., "Door")
    unitDeficiencyMapping[categoryName] = allCategoryDefs;
});
