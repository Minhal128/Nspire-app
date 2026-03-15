// In-memory store for tracking inspection progress across navigation stacks
// without using AsyncStorage (no local storage).

type ResponseType = 'No OD' | 'OD' | 'N/A';

export const globalInspectionProgress: Record<string, { [key: string]: ResponseType }> = {};
