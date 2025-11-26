import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import CategoryForm from "./CategoryForm";
import { useCategory } from "./categoryHandlers";

import "./CategoryListPage.css";

import { Button } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

export default function CategoryListPage() {
  const { id } = useParams();
  const {
    categories,
    handleCreate,
    handleNewChange,
    newForm,
    isCreating,
    setIsCreating,
    handleEditClick,
    handleUpdate,
    editForm,
    editingId,
    setEditingId,
    isEditMode,
    setIsEditMode,
    handleChange,
    handleDelete,
    error,
  } = useCategory(id);

  return (
    <div style={{ padding: "2rem" }}>
      {!isCreating ? (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsCreating(true)}
          >
            新規作成
          </Button>

          {/* 編集モード切替ボタン */}
          <Button
            variant="contained"
            color="warning"
            startIcon={<EditIcon />}
            onClick={() => setIsEditMode((prev) => !prev)}
          >
            {isEditMode ? "編集モードOFF" : "編集モードON"}
          </Button>
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
          <li
            key={c.id}
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
                <button
                  onClick={() => handleDelete(String(c.id))}
                  style={{ marginLeft: "1rem" }}
                  className="btn-category btn-delete"
                >
                  削除
                </button>
              </>
            ) : (
              <>
                <span style={{ color: c.color }}>{c.name}</span>
                {isEditMode && (
                  <button
                    onClick={() => handleEditClick(c)}
                    className="btn-category btn-edit"
                  >
                    編集
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
