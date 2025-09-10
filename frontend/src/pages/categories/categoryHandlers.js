// src/pages/categories/categoryHandlers.js
import { apiFetch } from "../../api/client";

// Category 専用ハンドラ
export const createCategoryHandlers = ({
        accessToken,
        refreshToken,
        handleRefresh,
        fetchCategories,
        setCategories,
        setIsCreating,
        setNewForm,
        setError,
        setEditingId,
        setEditForm,
    }) => {
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

    return {
        handleNewChange,
        handleCreate,
        handleEditClick,
        handleChange,
        handleUpdate,
        handleDelete,
    };
};