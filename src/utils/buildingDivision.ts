/**
 * Unit distribution for the building-division step of Add Property.
 *
 * Mirrors the web BuildingDivisionModal (inspire-web components/PropertyModals.tsx).
 * The even split is only the starting point: each building's unit count is then
 * edited by hand and nothing else moves. The running total is validated on save.
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

export const totalUnitsOf = (buildings: BuildingData[]): number =>
  buildings.reduce((total, b) => total + (b.units || 0), 0);
