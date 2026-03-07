export const MAX_VISIBLE = 5;

export function renderCategories(categories, expanded) {
  if (expanded) return categories;
  return categories.slice(0, MAX_VISIBLE);
}
