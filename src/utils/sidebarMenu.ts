/**
 * Sidebar menu per portal.
 *
 * Pure data so the sibling .check.ts can assert every role's menu and, more
 * importantly, that every menu id is a screen actually registered in App.tsx —
 * a menu entry pointing at a missing route is a silently dead button.
 */

export type MenuItem = {
  id: string;
  label: string;
  icon:
    | 'home'
    | 'clipboard-outline'
    | 'menu'
    | 'reader-outline'
    | 'settings'
    | 'people-outline';
};

/**
 * Backend role -> portal name. Every portal now gets the same menu and the
 * same dashboard, so this is left for labelling and for the check below to
 * pin the role mapping; it no longer decides what anyone can reach.
 */
export const userTypeForRole = (role?: string): string => {
  switch (role) {
    case 'other':
    case 'order':
      return 'Other';
    case 'asset-manager':
      return 'AssetsManager';
    case 'management':
    case 'supervisor':
    case 'property-manager':
      return 'Management';
    default:
      return 'Inspector';
  }
};

export function menuItemsFor(_userType: string): MenuItem[] {
  // One menu for every portal. The asset manager used to get Dashboard alone,
  // which left that portal a dead end: no way to reach an inspection, its
  // status, or settings. Web gives asset-manager the same pages as the rest
  // (my-inspection, inspection-status, settings and the inspection flow), so
  // the app stops being the odd one out.
  return [
    { id: 'Dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'MyInspections', label: 'My Inspection', icon: 'clipboard-outline' },
    { id: 'InspectionStatus', label: 'Inspection Status', icon: 'menu' },
    { id: 'Settings', label: 'Settings', icon: 'settings' },
  ];
}
