import "./category.css";
import { renderCategories } from "./categoryUI";
import CategoryCard from "./CategoryCard";
import { CATEGORY_COLORS } from "../../constants/categoryColors";

import { Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

export default function CategoryPanel({
  categories,
  formData,
  onChange,
  onSubmit,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  setAsideMode,
  editingCategory, // ←追加
  onCancelEdit,
}) {
  const visibleCategories = renderCategories(categories, expanded);

  return (
    <div className="category-container">
      <div className="category-create">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <h3>{editingCategory ? "カテゴリ編集" : "カテゴリ作成"}</h3>

          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="カテゴリ名"
            required
          />
          <select
            name="color"
            value={formData.color}
            onChange={onChange}
            required
          >
            {CATEGORY_COLORS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button variant="contained" type="submit" startIcon={<AddIcon />}>
            {editingCategory ? "更新" : "作成"}
          </Button>

          {editingCategory && (
            <>
              <Button
                variant="contained"
                startIcon={<CloseIcon />}
                onClick={onCancelEdit}
              >
                キャンセル
              </Button>
            </>
          )}
        </form>
      </div>

      <div className="category-list">
        {visibleCategories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onEdit={() => onEdit(cat)}
            onDelete={() => onDelete(cat)}
          />
        ))}
      </div>

      {categories.length > 5 && (
        <div className="category-toggle" onClick={onToggle}>
          {expanded ? "閉じる" : `＋${categories.length - 5}件表示`}
        </div>
      )}

      <div className="category-toggle" onClick={() => setAsideMode(null)}>
        戻る
      </div>
    </div>
  );
}
