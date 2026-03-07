import "./category.css";

export default function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="category-card" style={{ background: category.color }}>
      <span>{category.name}</span>

      <div>
        <span className="category-edit" onClick={onEdit}>
          ✏️
        </span>

        <span className="category-edit" onClick={onDelete}>
          🗑️
        </span>
      </div>
    </div>
  );
}
