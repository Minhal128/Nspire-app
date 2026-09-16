/**
 * Unit distribution for the building-division step of Add Property.
 *
 * Mirrors the web BuildingDivisionModal (inspire-web components/PropertyModals.tsx).
 * The total entered on Add Property is fixed: editing one building's units moves
 * the difference to the other buildings instead of changing the total.
 */

export interface BuildingData {
  name: string;
  units: number;
}

/** Spread `totalUnits` across `numBuildings`, giving the remainder to the first ones. */
export const divideUnitsEvenly = (totalUnits: number, numBuildings: number): BuildingData[] => {
  const count = Math.max(numBuildings, 1);
  const unitsPerBuilding = Math.floor(totalUnits / count);
  const remainder = totalUnits % count;

  const buildings: BuildingData[] = [];
  for (let i = 0; i < count; i++) {
    buildings.push({
      name: `B${i + 1}`,
      units: unitsPerBuilding + (i < remainder ? 1 : 0),
    });
  }
  return buildings;
};

/** Re-apply the even split to an existing list, keeping the names the user typed. */
export const redivideKeepingNames = (
  buildings: BuildingData[],
  totalUnits: number,
): BuildingData[] => {
  const split = divideUnitsEvenly(totalUnits, buildings.length);
  return buildings.map((b, i) => ({ ...b, units: split[i].units }));
};

/**
 * Set building `index` to `newUnits` and take the difference out of (or add it
 * back to) the other buildings, so the overall total is unchanged.
 *
 * The total can still fall short when the other buildings have no units left to
 * give — the screen shows that as a red banner and blocks saving.
 */
export const redistributeUnits = (
  buildings: BuildingData[],
  index: number,
  newUnits: number,
): BuildingData[] => {
  const updated = buildings.map((b) => ({ ...b }));
  const oldUnits = updated[index].units;
  const diff = newUnits - oldUnits;

  updated[index].units = newUnits;
  if (diff === 0) return updated;

  let remainingDiff = -diff;

  for (let i = 0; i < updated.length; i++) {
    if (i === index) continue;

    if (remainingDiff > 0) {
      updated[i].units += remainingDiff;
      remainingDiff = 0;
      break;
    } else if (remainingDiff < 0) {
      const available = updated[i].units;
      if (available > 0) {
        const toSubtract = Math.min(available, Math.abs(remainingDiff));
        updated[i].units -= toSubtract;
        remainingDiff += toSubtract;
        if (remainingDiff === 0) break;
      }
    }
  }
  return updated;
};

export const totalUnitsOf = (buildings: BuildingData[]): number =>
  buildings.reduce((total, b) => total + (b.units || 0), 0);
