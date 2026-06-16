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
    <div className="w-full">
      <div className="mb-6 rounded-[14px] bg-white p-5 shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <h3 className="mb-4">
            {editingCategory ? "カテゴリ編集" : "カテゴリ作成"}
          </h3>

          <input
            className="mb-3 w-full rounded-lg border border-[#ccc] p-3 text-[16px] leading-[1.4]"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="カテゴリ名"
            required
          />
          <select
            className="mb-3 w-full rounded-lg border border-[#ccc] p-3 text-[16px] leading-[1.4]"
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

          <Button
            className="!mt-[10px] !w-full"
            variant="contained"
            type="submit"
            startIcon={<AddIcon />}
          >
            {editingCategory ? "更新" : "作成"}
          </Button>

          {editingCategory && (
            <>
              <Button
                className="!mt-[10px] !w-full"
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

      <div className="flex flex-col gap-[16px]">
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
        <div
          className="mt-4 cursor-pointer text-center text-[18px] font-semibold text-[#4a90e2]"
          onClick={onToggle}
        >
          {expanded ? "閉じる" : `＋${categories.length - 5}件表示`}
        </div>
      )}

      <div
        className="mt-4 cursor-pointer text-center text-[18px] font-semibold text-[#4a90e2]"
        onClick={() => setAsideMode(null)}
      >
        戻る
      </div>
    </div>
  );
}
