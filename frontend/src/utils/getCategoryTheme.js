import { CATEGORY_THEME } from "../constants/categoryTheme";

export function getCategoryTheme(color) {
  return CATEGORY_THEME[color] || CATEGORY_THEME.gray;
}
