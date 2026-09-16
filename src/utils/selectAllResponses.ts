/**
 * Bulk "Select All <status>" behaviour for an inspection location.
 *
 * Mirrors the web portal (/dashboard/inspection-category/[id]). The rules that
 * matter, because getting them wrong silently discards an inspector's work:
 *
 *  - A bulk action only touches items that are still unanswered, or that already
 *    hold the status being toggled. Answers the inspector already gave for a
 *    different status are never overwritten.
 *  - Items pinned to 'OD' (a deficiency has been recorded against them) are
 *    excluded from every non-OD bulk action.
 *  - Tapping a fully-selected group again clears only that group, not the
 *    whole location.
 */

export type ResponseValue = 'OD' | 'No OD' | 'N/A';
export type ResponseMap = { [itemId: string]: ResponseValue };

/** Items a bulk action for `target` is allowed to change. */
export const getToggleableItemIds = (
  itemIds: string[],
  responses: ResponseMap,
  target: ResponseValue,
): string[] =>
  itemIds.filter((id) => {
    const current = responses[id];
    // A recorded deficiency pins the item to OD.
    if (target !== 'OD' && current === 'OD') return false;
    return current === undefined || current === null || current === target;
  });

/** Whether the bulk checkbox for `target` should render as checked. */
export const isSelectAllChecked = (
  itemIds: string[],
  responses: ResponseMap,
  target: ResponseValue,
): boolean => {
  const toggleable = getToggleableItemIds(itemIds, responses, target);
  return toggleable.length > 0 && toggleable.every((id) => responses[id] === target);
};

/** The response map after tapping the bulk control for `target`. */
export const computeSelectAllResponses = (
  itemIds: string[],
  responses: ResponseMap,
  target: ResponseValue,
): ResponseMap => {
  const toggleable = getToggleableItemIds(itemIds, responses, target);
  if (toggleable.length === 0) return responses;

  const clearing = toggleable.every((id) => responses[id] === target);
  const next: ResponseMap = { ...responses };
  toggleable.forEach((id) => {
    if (clearing) delete next[id];
    else next[id] = target;
  });
  return next;
};
