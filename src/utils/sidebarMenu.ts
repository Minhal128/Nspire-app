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

/** Backend role -> menu group. Mirrors authService.getDashboardRoute. */
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

export function menuItemsFor(userType: string): MenuItem[] {
  if (userType === 'AssetsManager') {
    return [{ id: 'Dashboard', label: 'Dashboard', icon: 'home' }];
  }

  // Every other portal — Inspector, Management, Other — shares one menu.
  return [
    { id: 'Dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'MyInspections', label: 'My Inspection', icon: 'clipboard-outline' },
    { id: 'InspectionStatus', label: 'Inspection Status', icon: 'menu' },
    { id: 'Settings', label: 'Settings', icon: 'settings' },
  ];
}
