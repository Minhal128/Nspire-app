/**
 * Unit distribution for the building-division step of Add Property.
 *
 * Mirrors the web BuildingDivisionModal (inspire-web components/PropertyModals.tsx).
 * The even split is only the starting point: editing one building's count
 * re-spreads the leftover over the buildings AFTER it and never touches the
 * ones before. The running total is validated on save.
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
 * Set one building's unit count and absorb the difference in the buildings
 * AFTER it. Everything before `index` stays exactly as the user left it, so
 * editing B8 can only move B9 onwards.
 */
export const setUnitsRebalancingAfter = (
  buildings: BuildingData[],
  index: number,
  units: number,
  totalUnits: number,
): BuildingData[] => {
  const edited = buildings.map((b, i) =>
    i === index ? { ...b, units: Math.max(0, units) } : b,
  );

  const tailStart = index + 1;
  // Nothing after the edited building: the running total is off and the screen's
  // mismatch warning is what tells the user.
  if (tailStart >= edited.length) return edited;

  const usedBefore = totalUnitsOf(edited.slice(0, tailStart));
  const split = divideUnitsEvenly(
    Math.max(0, totalUnits - usedBefore),
    edited.length - tailStart,
  );
  return edited.map((b, i) =>
    i < tailStart ? b : { ...b, units: split[i - tailStart].units },
  );
};

export const totalUnitsOf = (buildings: BuildingData[]): number =>
  buildings.reduce((total, b) => total + (b.units || 0), 0);
