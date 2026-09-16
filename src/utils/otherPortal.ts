/**
 * Shared display rules for the "Other" portal.
 *
 * Mirrors web /other/dashboard, /other/inspections and /other/users, which all
 * repeat the same two switch statements. Kept in one place so the three app
 * screens can never drift apart the way the web pages did.
 */

/** Web `getRoleDisplayName` — unknown roles fall through to the raw value. */
export const getRoleDisplayName = (role?: string): string => {
  switch (role?.toLowerCase()) {
    case 'management':
      return 'Management';
    case 'supervisor':
      return 'Supervisor';
    case 'property-manager':
      return 'Property Manager';
    case 'asset-manager':
      return 'Asset Manager';
    case 'other':
      return 'Other';
    default:
      return role || 'User';
  }
};

/** Web `getRoleColor`, translated from tailwind badge classes to hex. */
export const getRoleColor = (role?: string): string => {
  switch (role?.toLowerCase()) {
    case 'management':
      return '#9333EA';
    case 'supervisor':
      return '#2563EB';
    case 'property-manager':
      return '#16A34A';
    case 'asset-manager':
      return '#EA580C';
    default:
      return '#6B7280';
  }
};

/** Web `getStatusColor` for an inspection row, translated to hex. */
export const getInspectionStatusColor = (status?: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return '#16A34A';
    case 'scheduled':
      return '#CA8A04';
    case 'in-progress':
      return '#2563EB';
    case 'pending':
      return '#EA580C';
    case 'failed':
      return '#DC2626';
    default:
      return '#6B7280';
  }
};

/** "Joined" date shown on a user card. Web reads createdAt; lastLogin is the app's fallback. */
export const formatJoinedDate = (user: { createdAt?: string; lastLogin?: string }): string => {
  const raw = user.createdAt || user.lastLogin;
  if (!raw) return 'N/A';
  const date = new Date(raw);
  return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
};
