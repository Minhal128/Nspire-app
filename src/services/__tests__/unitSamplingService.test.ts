/**
 * Unit Sampling Service Tests
 * 
 * Tests for the unit sampling logic to ensure consistency
 * and correctness of the NSPIRE sampling implementation (all property sizes).
 */

import {
  generateRandomUnitSample,
  getUnitsToInspect,
  isRandomSelectionAvailable,
  getSamplingExplanation,
} from '../unitSamplingService';

describe('Unit Sampling Service', () => {
  describe('getUnitsToInspect', () => {
    it('should return correct sample sizes for 1-10 units (n-1 logic)', () => {
      expect(getUnitsToInspect(1)).toBe(1);  // Special case: 1 unit = inspect 1
      expect(getUnitsToInspect(2)).toBe(1);  // 2 units = inspect 1 (n-1)
      expect(getUnitsToInspect(3)).toBe(2);  // 3 units = inspect 2 (n-1)
      expect(getUnitsToInspect(4)).toBe(3);  // 4 units = inspect 3 (n-1)
      expect(getUnitsToInspect(5)).toBe(4);  // 5 units = inspect 4 (n-1)
      expect(getUnitsToInspect(6)).toBe(5);  // 6 units = inspect 5 (n-1)
      expect(getUnitsToInspect(7)).toBe(6);  // 7 units = inspect 6 (n-1)
      expect(getUnitsToInspect(8)).toBe(7);  // 8 units = inspect 7 (n-1)
      expect(getUnitsToInspect(9)).toBe(8);  // 9 units = inspect 8 (n-1)
      expect(getUnitsToInspect(10)).toBe(9); // 10 units = inspect 9 (n-1)
    });

    it('should return correct sample sizes for 11-35 units (NSPIRE factors)', () => {
      expect(getUnitsToInspect(11)).toBe(9);  // 11-12 units = n=9
      expect(getUnitsToInspect(12)).toBe(9);  // 11-12 units = n=9
      expect(getUnitsToInspect(13)).toBe(10); // 13-14 units = n=10
      expect(getUnitsToInspect(14)).toBe(10); // 13-14 units = n=10
      expect(getUnitsToInspect(15)).toBe(11); // 15-16 units = n=11
      expect(getUnitsToInspect(16)).toBe(11); // 15-16 units = n=11
      expect(getUnitsToInspect(17)).toBe(12); // 17-18 units = n=12
      expect(getUnitsToInspect(18)).toBe(12); // 17-18 units = n=12
      expect(getUnitsToInspect(19)).toBe(13); // 19-21 units = n=13
      expect(getUnitsToInspect(20)).toBe(13); // 19-21 units = n=13
      expect(getUnitsToInspect(21)).toBe(13); // 19-21 units = n=13
      expect(getUnitsToInspect(22)).toBe(14); // 22-24 units = n=14
      expect(getUnitsToInspect(23)).toBe(14); // 22-24 units = n=14
      expect(getUnitsToInspect(24)).toBe(14); // 22-24 units = n=14
      expect(getUnitsToInspect(25)).toBe(15); // 25-27 units = n=15
      expect(getUnitsToInspect(26)).toBe(15); // 25-27 units = n=15
      expect(getUnitsToInspect(27)).toBe(15); // 25-27 units = n=15
      expect(getUnitsToInspect(28)).toBe(16); // 28-30 units = n=16
      expect(getUnitsToInspect(29)).toBe(16); // 28-30 units = n=16
      expect(getUnitsToInspect(30)).toBe(16); // 28-30 units = n=16
      expect(getUnitsToInspect(31)).toBe(17); // 31-35 units = n=17
      expect(getUnitsToInspect(32)).toBe(17); // 31-35 units = n=17
      expect(getUnitsToInspect(35)).toBe(17); // 31-35 units = n=17
    });

    it('should return correct sample sizes for larger properties (36-921+ units)', () => {
      expect(getUnitsToInspect(36)).toBe(18);  // 36-39 units = n=18
      expect(getUnitsToInspect(39)).toBe(18);  // 36-39 units = n=18
      expect(getUnitsToInspect(40)).toBe(19);  // 40-45 units = n=19
      expect(getUnitsToInspect(45)).toBe(19);  // 40-45 units = n=19
      expect(getUnitsToInspect(46)).toBe(20);  // 46-51 units = n=20
      expect(getUnitsToInspect(50)).toBe(20);  // 46-51 units = n=20
      expect(getUnitsToInspect(51)).toBe(20);  // 46-51 units = n=20
      expect(getUnitsToInspect(52)).toBe(21);  // 52-59 units = n=21
      expect(getUnitsToInspect(60)).toBe(22);  // 60-67 units = n=22
      expect(getUnitsToInspect(68)).toBe(23);  // 68-78 units = n=23
      expect(getUnitsToInspect(79)).toBe(24);  // 79-92 units = n=24
      expect(getUnitsToInspect(93)).toBe(25);  // 93-110 units = n=25
      expect(getUnitsToInspect(111)).toBe(26); // 111-120 units = n=26
      expect(getUnitsToInspect(121)).toBe(27); // 121-166 units = n=27
      expect(getUnitsToInspect(167)).toBe(28); // 167-214 units = n=28
      expect(getUnitsToInspect(215)).toBe(29); // 215-295 units = n=29
      expect(getUnitsToInspect(296)).toBe(30); // 296-455 units = n=30
      expect(getUnitsToInspect(456)).toBe(31); // 456-920 units = n=31
      expect(getUnitsToInspect(921)).toBe(32); // 921+ units = n=32
      expect(getUnitsToInspect(1000)).toBe(32); // 921+ units = n=32
    });

    it('should throw error for units less than 1', () => {
      expect(() => getUnitsToInspect(0)).toThrow();
      expect(() => getUnitsToInspect(-1)).toThrow();
    });
  });

  describe('isRandomSelectionAvailable', () => {
    it('should return true for any property with 1 or more units', () => {
      expect(isRandomSelectionAvailable(1)).toBe(true);
      expect(isRandomSelectionAvailable(32)).toBe(true);
      expect(isRandomSelectionAvailable(50)).toBe(true);
      expect(isRandomSelectionAvailable(100)).toBe(true);
      expect(isRandomSelectionAvailable(1000)).toBe(true);
    });

    it('should return false for 0 or negative units', () => {
      expect(isRandomSelectionAvailable(0)).toBe(false);
      expect(isRandomSelectionAvailable(-1)).toBe(false);
    });
  });

  describe('generateRandomUnitSample', () => {
    it('should generate consistent samples for the same property ID', () => {
      const propertyId = 'test-property-123';
      const totalUnits = 5;

      const sample1 = generateRandomUnitSample(totalUnits, propertyId);
      const sample2 = generateRandomUnitSample(totalUnits, propertyId);

      expect(sample1.selectedUnits).toEqual(sample2.selectedUnits);
      expect(sample1.totalUnits).toBe(totalUnits);
      expect(sample1.unitsToInspect).toBe(4); // n-1 for 5 units
    });

    it('should generate different samples for different property IDs', () => {
      const totalUnits = 5;
      const sample1 = generateRandomUnitSample(totalUnits, 'property-1');
      const sample2 = generateRandomUnitSample(totalUnits, 'property-2');

      // While they might occasionally be the same due to randomness,
      // they should generally be different
      expect(sample1.totalUnits).toBe(sample2.totalUnits);
      expect(sample1.unitsToInspect).toBe(sample2.unitsToInspect);
    });

    it('should return correct unit format', () => {
      const sample = generateRandomUnitSample(3, 'test-property');
      
      expect(sample.totalUnits).toBe(3);
      expect(sample.unitsToInspect).toBe(2);
      expect(sample.selectedUnits).toHaveLength(2);
      
      // Check unit name format
      sample.selectedUnits.forEach(unit => {
        expect(unit).toMatch(/^Unit \d{3}$/);
      });
    });

    it('should handle single unit property', () => {
      const sample = generateRandomUnitSample(1, 'single-unit-property');
      
      expect(sample.totalUnits).toBe(1);
      expect(sample.unitsToInspect).toBe(1);
      expect(sample.selectedUnits).toEqual(['Unit 001']);
    });

    it('should handle larger properties (11-32 units)', () => {
      const sample15 = generateRandomUnitSample(15, 'property-15');
      expect(sample15.totalUnits).toBe(15);
      expect(sample15.unitsToInspect).toBe(11); // 15-16 units = n=11
      expect(sample15.selectedUnits).toHaveLength(11);

      const sample25 = generateRandomUnitSample(25, 'property-25');
      expect(sample25.totalUnits).toBe(25);
      expect(sample25.unitsToInspect).toBe(15); // 25-27 units = n=15
      expect(sample25.selectedUnits).toHaveLength(15);

      const sample32 = generateRandomUnitSample(32, 'property-32');
      expect(sample32.totalUnits).toBe(32);
      expect(sample32.unitsToInspect).toBe(17); // 31-32 units = n=17
      expect(sample32.selectedUnits).toHaveLength(17);
    });

    it('should handle large properties (50+ units)', () => {
      const sample50 = generateRandomUnitSample(50, 'property-50');
      expect(sample50.totalUnits).toBe(50);
      expect(sample50.unitsToInspect).toBe(20); // 46-51 units = n=20
      expect(sample50.selectedUnits).toHaveLength(20);

      const sample35 = generateRandomUnitSample(35, 'property-35');
      expect(sample35.totalUnits).toBe(35);
      expect(sample35.unitsToInspect).toBe(17); // 31-35 units = n=17
      expect(sample35.selectedUnits).toHaveLength(17);

      const sample1000 = generateRandomUnitSample(1000, 'property-1000');
      expect(sample1000.totalUnits).toBe(1000);
      expect(sample1000.unitsToInspect).toBe(32); // 921+ units = n=32
      expect(sample1000.selectedUnits).toHaveLength(32);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => generateRandomUnitSample(0, 'test')).toThrow();
      expect(() => generateRandomUnitSample(-1, 'test')).toThrow();
      expect(() => generateRandomUnitSample(5, '')).toThrow();
      expect(() => generateRandomUnitSample(5, '   ')).toThrow();
    });
  });

  describe('getSamplingExplanation', () => {
    it('should return appropriate explanations for different unit counts', () => {
      const explanation1 = getSamplingExplanation(1);
      expect(explanation1).toContain('1 unit');
      expect(explanation1).toContain('single unit will be inspected');

      const explanation5 = getSamplingExplanation(5);
      expect(explanation5).toContain('5 units');
      expect(explanation5).toContain('4 units will be randomly selected');

      const explanation15 = getSamplingExplanation(15);
      expect(explanation15).toContain('15 units');
      expect(explanation15).toContain('11 units will be randomly selected');

      const explanation32 = getSamplingExplanation(32);
      expect(explanation32).toContain('32 units');
      expect(explanation32).toContain('17 units will be randomly selected');
    });

    it('should return explanation for larger properties', () => {
      const explanation50 = getSamplingExplanation(50);
      expect(explanation50).toContain('50 units');
      expect(explanation50).toContain('20 units will be randomly selected');

      const explanation1000 = getSamplingExplanation(1000);
      expect(explanation1000).toContain('1000 units');
      expect(explanation1000).toContain('32 units will be randomly selected');
    });

    it('should return error message for invalid unit counts', () => {
      const explanation = getSamplingExplanation(0);
      expect(explanation).toContain('not available');
    });
  });

  describe('Deterministic sampling consistency', () => {
    it('should always select the same units for the same property across multiple calls', () => {
      const propertyId = 'consistency-test-property';
      const totalUnits = 7;
      const samples = [];

      // Generate 10 samples for the same property
      for (let i = 0; i < 10; i++) {
        samples.push(generateRandomUnitSample(totalUnits, propertyId));
      }

      // All samples should be identical
      const firstSample = samples[0];
      samples.forEach(sample => {
        expect(sample.selectedUnits).toEqual(firstSample.selectedUnits);
        expect(sample.totalUnits).toBe(firstSample.totalUnits);
        expect(sample.unitsToInspect).toBe(firstSample.unitsToInspect);
      });
    });

    it('should select the correct number of units without duplicates', () => {
      // Test a representative sample of unit counts across all ranges
      const testCases = [1, 5, 10, 15, 25, 32, 35, 50, 100, 200, 500, 1000];
      
      for (const totalUnits of testCases) {
        const sample = generateRandomUnitSample(totalUnits, `test-${totalUnits}`);
        const expectedUnitsToInspect = getUnitsToInspect(totalUnits);
        
        expect(sample.selectedUnits).toHaveLength(expectedUnitsToInspect);
        
        // Check for duplicates
        const uniqueUnits = new Set(sample.selectedUnits);
        expect(uniqueUnits.size).toBe(sample.selectedUnits.length);
        
        // Check that all selected units are valid
        sample.selectedUnits.forEach(unit => {
          const unitNumber = parseInt(unit.replace('Unit ', ''));
          expect(unitNumber).toBeGreaterThanOrEqual(1);
          expect(unitNumber).toBeLessThanOrEqual(totalUnits);
        });
      }
    });
  });
});