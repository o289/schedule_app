// src/pages/categories/categoryHandlers.js
import { useState, useEffect } from "react";
import { apiFetch } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export function useCategory(categoryId) {
    const { accessToken, refreshToken, handleRefresh } = useAuth();
    const [categories, setCategories] = useState([]);
    const [newForm, setNewForm] = useState({ name: "", color: "gray" });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", color: "" });
    const [error, setError] = useState("");

    // ハンドル
    const [isCreating, setIsCreating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // 編集モード追加

    const base_url = "/categories/"

    // 一覧表示
    const fetchCategories = async () => {
        const res = await apiFetch(base_url, { method: "GET" }, { accessToken, refreshToken, handleRefresh } );
        setCategories(res);
    };

    // 作成
    const handleCreate = async () => {
        await apiFetch(
            base_url,
            {
                method: "POST",
                body: JSON.stringify(newForm),
            },
            { accessToken, refreshToken, handleRefresh }
        );
        setNewForm({ name: "", color: "gray" });
        setIsCreating(false);
        fetchCategories();
    };

    const handleNewChange = (e) => {
        setNewForm({ ...newForm, [e.target.name]: e.target.value });
    };

    // 編集
    const handleUpdate = async () => {
    await apiFetch(
        `${base_url}${editingId}`,
        {
            method: "PUT",
            body: JSON.stringify(editForm),
        },
        { accessToken, refreshToken, handleRefresh }
        );
        setEditingId(null);
        setEditForm({ name: "", color: "" });
        fetchCategories();
    };

    const handleChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };


    // 削除
    const handleDelete = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;
        await apiFetch(`${base_url}${id}`, { method: "DELETE" }, { accessToken, refreshToken, handleRefresh } );
        // 即時反映（サーバーの再取得前にUI更新）
        setCategories((prev) => prev.filter((c) => String(c.id) !== String(id)));

        // 念のためサーバーから再取得して同期
        fetchCategories();        
    };

    // 編集モードの切り替え
    const handleEditClick = (category) => {
        if (!isEditMode) return; // 編集モードOFFなら何もしない
        setEditingId(category.id);
        setEditForm({ name: category.name, color: category.color });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
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
        error,
        setError
    };

};

