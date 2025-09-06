import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import CategoryForm from "./CategoryForm";
// import { createCategoryHandlers } from "./categoryHandlers";

import "./CategoryListPage.css"

export default function CategoryListPage() {
  const { accessToken, refreshToken, handleRefresh } = useAuth();
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", color: "" });
  const [isEditMode, setIsEditMode] = useState(false); // 編集モード追加


  const [isCreating, setIsCreating] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", color: "gray" });
  const [error, setError] = useState("");



  const fetchCategories = async () => {
    try {
      const res = await apiFetch("/categories/", { method: "GET" }, { accessToken, refreshToken, handleRefresh } );
      console.log("fetched categories:", res);  // ← ここ追加
      setCategories(res);
    } catch (err) {
      console.error("カテゴリ取得失敗:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Category 専用ハンドラを注入 ---
  // const {
  //   handleNewChange,
  //   handleCreate,
  //   handleEditClick,
  //   handleChange,
  //   handleUpdate,
  //   handleDelete,
  // } = createCategoryHandlers({
  //   accessToken,
  //   refreshToken,
  //   handleRefresh,
  //   fetchCategories,
  //   setCategories,
  //   setIsCreating,
  //   setNewForm,
  //   setError,
  //   setEditingId,
  //   setEditForm,
  // });

  const handleNewChange = (e) => {
    setNewForm({ ...newForm, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await apiFetch(
        "/categories/",
        {
          method: "POST",
          body: JSON.stringify(newForm),
        },
        { accessToken, refreshToken, handleRefresh }
      );
      // 初期化
      setNewForm({ name: "", color: "gray" });
      setIsCreating(false);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  


  // 編集
  const handleEditClick = (category) => {
    if (!isEditMode) return; // 編集モードOFFなら何もしない
    setEditingId(category.id);
    setEditForm({ name: category.name, color: category.color });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await apiFetch(
        `/categories/${editingId}`,
        {
          method: "PUT",
          body: JSON.stringify(editForm),
        },
        { accessToken, refreshToken, handleRefresh }
      );
        setEditingId(null);
        setEditForm({ name: "", color: "" });
        fetchCategories();
    } catch (err) {
      console.error("更新失敗:", err);
    }
  };

  // 削除
  const handleDelete = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      await apiFetch(`/categories/${id}`, { method: "DELETE" }, { accessToken, refreshToken, handleRefresh } );
      // 即時反映（サーバーの再取得前にUI更新）
      setCategories((prev) => prev.filter((c) => String(c.id) !== String(id)));

      // 念のためサーバーから再取得して同期
      fetchCategories();
    } catch (err) {
      console.error("削除失敗:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>カテゴリ一覧</h2>
      

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