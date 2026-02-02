// Scoring Calculations for NSPIRE Unit-Level Inspections
// Based on a fixed 50-point base score for both Inside and Outside evaluations
// Calculations mirror Excel-based scoring behavior

export interface SeverityConfig {
    name: string;
    maxPointsLost: number;
}

// Severity levels with their fixed Max Points Lost values (matching Excel)
export const SEVERITY_LEVELS: { [key: string]: SeverityConfig } = {
    'Life-Threatening': { name: 'Life-Threatening', maxPointsLost: 60.00 },
    'Severe': { name: 'Severe', maxPointsLost: 14.80 },
    'Moderate': { name: 'Moderate', maxPointsLost: 5.50 },
    'Low': { name: 'Low', maxPointsLost: 2.40 },
};

export const POSSIBLE_SCORE = 50; // Fixed 50-point base score

export interface ScoringInput {
    totalSamples: number;      // n - total number of inspected units/samples
    deficiencies: number;      // v - number of selected deficiencies
    severity?: string;         // Severity level (defaults to Moderate)
}

export interface ScoringResult {
    allSample: number;         // Total samples (n)
    deficiencies: number;      // Number of deficiencies (v) - renamed from violations
    violations: number;        // Alias for deficiencies (for backward compatibility)
    ptsLostRaw: number;        // Points Lost (Raw) = maxPtsLost / n
    ptsLost: number;           // Total Points Lost = (maxPtsLost / n) × v
    possibleScore: number;     // Fixed at 50
    maxPtsLost: number;        // Max Points Lost based on severity
    score: number;             // Section Score = possibleScore - ptsLost (dynamic, not always 50)
    severity: string;          // Severity level
}

/**
 * Calculate scoring for a single unit/section inspection
 * Formula:
 *   Points Lost (Raw) = MaxPointsLost / n
 *   Total Points Lost = (MaxPointsLost / n) × v
 *   Section Score = 50 − TotalPointsLost
 * 
 * @param input Scoring input parameters
 * @returns Complete scoring result with all intermediate values
 */
export function calculateUnitScore(input: ScoringInput): ScoringResult {
    const { totalSamples, deficiencies, severity = 'Moderate' } = input;

    // Get max points lost based on severity
    const severityConfig = SEVERITY_LEVELS[severity] || SEVERITY_LEVELS['Moderate'];
    const maxPtsLost = severityConfig.maxPointsLost;

    // Ensure we don't divide by zero - minimum 1 sample
    const n = Math.max(totalSamples, 1);
    const v = Math.max(deficiencies, 0);

    // Calculate Points Lost (Raw) = MaxPointsLost / n
    const ptsLostRaw = maxPtsLost / n;

    // Calculate Total Points Lost = (MaxPointsLost / n) × v
    const ptsLost = ptsLostRaw * v;

    // Calculate Section Score = 50 − TotalPointsLost
    // Score can go negative if too many deficiencies
    const score = POSSIBLE_SCORE - ptsLost;

    return {
        allSample: n,
        deficiencies: v,
        violations: v, // Backward compatibility alias
        ptsLostRaw: parseFloat(ptsLostRaw.toFixed(2)),
        ptsLost: parseFloat(ptsLost.toFixed(2)),
        possibleScore: POSSIBLE_SCORE,
        maxPtsLost,
        score: parseFloat(score.toFixed(2)),
        severity: severityConfig.name,
    };
}

// Backward compatible function that accepts 'violations' parameter
export function calculateUnitScoreWithViolations(input: {
    totalSamples: number;
    violations: number;
    severity?: string;
}): ScoringResult {
    return calculateUnitScore({
        totalSamples: input.totalSamples,
        deficiencies: input.violations,
        severity: input.severity,
    });
}

export interface InspectionAreaScore {
    inside?: ScoringResult;
    outside?: ScoringResult;
}

export interface FinalInspectionScore {
    insideScore?: ScoringResult;
    outsideScore?: ScoringResult;
    finalScore: number;
    averageMethod: 'simple' | 'weighted';
    totalSamples: number;
    totalDeficiencies: number;
    // Breakdown for display
    insideContribution?: number;
    outsideContribution?: number;
}

/**
 * Calculate the final inspection score by combining Inside and Outside scores
 * 
 * Simple Average: (InsideScore + OutsideScore) / 2
 * Weighted Average: ((InsideScore × n_inside) + (OutsideScore × n_outside)) / (n_inside + n_outside)
 * 
 * @param areaScores Object containing inside and/or outside scoring results
 * @param useWeightedAverage If true, uses weighted average based on sample sizes; if false, uses simple average
 * @returns Final inspection score with breakdown
 */
export function calculateFinalInspectionScore(
    areaScores: InspectionAreaScore,
    useWeightedAverage: boolean = false
): FinalInspectionScore {
    const { inside, outside } = areaScores;

    let finalScore: number;
    let totalSamples = 0;
    let totalDeficiencies = 0;
    let insideContribution: number | undefined;
    let outsideContribution: number | undefined;

    if (inside) {
        totalSamples += inside.allSample;
        totalDeficiencies += inside.deficiencies;
    }

    if (outside) {
        totalSamples += outside.allSample;
        totalDeficiencies += outside.deficiencies;
    }

    if (inside && outside) {
        if (useWeightedAverage) {
            // Weighted average based on sample sizes
            // Formula: ((InsideScore × n_inside) + (OutsideScore × n_outside)) / (n_inside + n_outside)
            const totalWeight = inside.allSample + outside.allSample;
            insideContribution = (inside.score * inside.allSample) / totalWeight;
            outsideContribution = (outside.score * outside.allSample) / totalWeight;
            finalScore = insideContribution + outsideContribution;
        } else {
            // Simple average: (InsideScore + OutsideScore) / 2
            finalScore = (inside.score + outside.score) / 2;
            insideContribution = inside.score / 2;
            outsideContribution = outside.score / 2;
        }
    } else if (inside) {
        finalScore = inside.score;
        insideContribution = inside.score;
    } else if (outside) {
        finalScore = outside.score;
        outsideContribution = outside.score;
    } else {
        // No scores available - return base score
        finalScore = POSSIBLE_SCORE;
    }

    return {
        insideScore: inside,
        outsideScore: outside,
        finalScore: parseFloat(finalScore.toFixed(2)),
        averageMethod: useWeightedAverage ? 'weighted' : 'simple',
        totalSamples,
        totalDeficiencies,
        insideContribution: insideContribution !== undefined ? parseFloat(insideContribution.toFixed(2)) : undefined,
        outsideContribution: outsideContribution !== undefined ? parseFloat(outsideContribution.toFixed(2)) : undefined,
    };
}

/**
 * Format score for display
 * @param score Numeric score
 * @returns Formatted string with 2 decimal places
 */
export function formatScore(score: number): string {
    return score.toFixed(2);
}

/**
 * Get score status based on the score value
 * @param score Numeric score (out of 50)
 * @returns Status object with label and color
 */
export function getScoreStatus(score: number): { label: string; color: string } {
    if (score >= 45) {
        return { label: 'Excellent', color: '#10B981' };  // Green
    } else if (score >= 40) {
        return { label: 'Good', color: '#3B82F6' };       // Blue
    } else if (score >= 30) {
        return { label: 'Fair', color: '#F59E0B' };       // Orange/Yellow
    } else if (score >= 20) {
        return { label: 'Poor', color: '#F97316' };       // Orange
    } else if (score >= 0) {
        return { label: 'Critical', color: '#EF4444' };   // Red
    } else {
        return { label: 'Failed', color: '#7F1D1D' };     // Dark Red (negative score)
    }
}

/**
 * Get severity color for display
 * @param severity Severity level string
 * @returns Color code
 */
export function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'Life-Threatening':
            return '#DC2626'; // Red
        case 'Severe':
            return '#EA580C'; // Orange
        case 'Moderate':
            return '#CA8A04'; // Yellow/Amber
        case 'Low':
            return '#16A34A'; // Green
        default:
            return '#6B7280'; // Gray
    }
}

/**
 * Get max points lost for a severity level
 * @param severity Severity level string
 * @returns Max points lost value
 */
export function getMaxPointsLost(severity: string): number {
    return SEVERITY_LEVELS[severity]?.maxPointsLost || SEVERITY_LEVELS['Moderate'].maxPointsLost;
}

// Deficiency count options for dropdown (0-20)
export const DEFICIENCY_OPTIONS = Array.from({ length: 21 }, (_, i) => ({
    value: i,
    label: i.toString(),
}));

// Alias for backward compatibility
export const VIOLATION_OPTIONS = DEFICIENCY_OPTIONS;
