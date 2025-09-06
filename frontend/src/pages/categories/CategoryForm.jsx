import React from "react";
import "./CategoryListPage.css";
import { CATEGORY_COLORS } from "../../constants/categoryColors";


export default function CategoryForm({ formData, onChange, onSubmit, submitLabel, onCancel }) {
    return (
        <form
        className="category-form"
        onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
        }}
        >
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
        <button type="submit" className="btn-category btn-save">
            {submitLabel}
        </button>
        {onCancel && (
            <button type="button" className="btn-category btn-cancel" onClick={onCancel}>
            キャンセル
            </button>
        )}
        </form>
    );
}

