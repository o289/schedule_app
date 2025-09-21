import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import CategoryForm from "./CategoryForm";
import {  useCategory } from "./categoryHandlers";

import "./CategoryListPage.css"

export default function CategoryListPage() {
  const { id } = useParams()
  const {
        categories,
        fetchCategories,
        handleCreate,
        handleNewChange,
        newForm,
        isCreating,
        setIsCreating,
        handleUpdate,
        editForm,
        setEditingId,
        isEditMode,
        setIsEditMode,
        handleChange,
        handleDelete,
        handleEditClick,
        editingId,
        error
  } = useCategory(id)

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      {!isCreating ? (
        <>
          <button onClick={() => setIsCreating(true)} className="btn-category btn-save">
            新規作成
          </button>

          {/* 編集モード切替ボタン */}
          <button onClick={() => setIsEditMode((prev) => !prev)} className="btn-category btn-cancel">
            {isEditMode ? "編集モードOFF" : "編集モードON"}
          </button>
        </>
    ) : (
      <CategoryForm
        formData={newForm}
        onChange={handleNewChange}
        onSubmit={handleCreate}
        submitLabel="作成"
        onCancel={() => setIsCreating(false)}
      />
    )}

    {error && <p style={{ color: "red" }}>{error}</p>}

      
      
      <ul className="category-list">
        {categories.map((c) => (
          <li key={c.id}
              className={`category-item ${editingId === c.id ? "editing" : ""}`}
          >
            {isEditMode && editingId === c.id ? (
                <>
                  <CategoryForm
                    formData={editForm}
                    onChange={handleChange}
                    onSubmit={handleUpdate}
                    submitLabel="更新"
                    onCancel={() => setEditingId(null)}
                  />
                  <button onClick={() => handleDelete(String(c.id))} style={{ marginLeft: "1rem" }} className="btn-category btn-delete">削除</button>
                </>
                
            ) : (
              <>
                <span style={{ color: c.color }}>{c.name}</span>
                {isEditMode && (
                  <button onClick={() => handleEditClick(c)} className="btn-category btn-edit">編集</button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}