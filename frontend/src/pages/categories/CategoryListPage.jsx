import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import CategoryCard from "../../components/card/category/CategoryCard";
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
    <div>
      {!isCreating ? (
        <div
          style={{ display: "flex", justifyContent: "right", margin: "12px" }}
        >
          <div className="category-btn">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsCreating(true)}
            >
              新規作成
            </Button>
          </div>
          {/* 編集モード切替ボタン */}
          <div className="category-btn">
            <Button
              variant="contained"
              color="warning"
              startIcon={<EditIcon />}
              onClick={() => setIsEditMode((prev) => !prev)}
            >
              {isEditMode ? "編集モードOFF" : "編集モードON"}
            </Button>
          </div>
        </div>
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

      <div className="category-grid">
        {categories.map((category) => (
          <div>
            <CategoryCard
              key={category.id}
              color={category.color}
              categoryName={category.name}
            />
            {isEditMode && editingId === category.id ? (
              <>
                <CategoryForm
                  formData={editForm}
                  onChange={handleChange}
                  onSubmit={handleUpdate}
                  submitLabel="更新"
                  onCancel={() => setEditingId(null)}
                />
                <button
                  onClick={() => handleDelete(String(category.id))}
                  style={{ marginLeft: "1rem" }}
                  className="btn-category btn-delete"
                >
                  削除
                </button>
              </>
            ) : (
              <>
                {isEditMode && (
                  <button
                    onClick={() => handleEditClick(category)}
                    className="btn-category btn-edit"
                  >
                    編集
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
