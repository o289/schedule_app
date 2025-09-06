import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function useScheduleDetail(id) {
    const { accessToken, refreshToken, handleRefresh } = useAuth();
    const [schedule, setSchedule] = useState(null);
    const [categories, setCategories] = useState([]); // カテゴリ一覧
    const [error, setError] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        start_time: "",
        end_time: "",
        note: "",
        category_id: "",
    });

    const navigate = useNavigate();

    // --- 色計算関数（UI 側で利用可能にするため残す） ---
    function darkenColor(hex, amount = 20) {
        let col = hex.startsWith("#") ? hex.slice(1) : hex;
        if (col.length === 3) col = col.split("").map((c) => c + c).join("");

        const num = parseInt(col, 16);
        let r = (num >> 16) - amount;
        let g = ((num >> 8) & 0x00ff) - amount;
        let b = (num & 0x0000ff) - amount;

        r = r < 0 ? 0 : r;
        g = g < 0 ? 0 : g;
        b = b < 0 ? 0 : b;

        return `rgb(${r}, ${g}, ${b})`;
    }

    // --- カテゴリ一覧取得 ---
    const fetchCategories = async () => {
        try {
        const res = await apiFetch(
            "/categories/",
            { method: "GET" },
            { accessToken, refreshToken, handleRefresh }
        );
        setCategories(res);
        } catch (err) {
        console.error("カテゴリ取得失敗:", err);
        }
    };

    // --- スケジュール取得 ---
    const fetchSchedule = async () => {
        try {
        const res = await apiFetch(
            `/schedules/${id}`,
            { method: "GET" },
            { accessToken, refreshToken, handleRefresh }
        );
        setSchedule(res);
        setFormData({
            title: res.title,
            start_time: res.start_time.slice(0, 16),
            end_time: res.end_time.slice(0, 16),
            note: res.note || "",
            category_id: res.category_id,
        });
        } catch (err) {
        setError(err.message);
        }
    };

    useEffect(() => {
        if (id) {
            fetchSchedule();
            fetchCategories();
        }
    }, [id]);

    // --- 入力変更 ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- 更新 ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
        await apiFetch(
            `/schedules/${id}`,
            {
            method: "PUT",
            body: JSON.stringify(formData),
            },
            { accessToken, refreshToken, handleRefresh }
        );
        setIsEditMode(false);
            fetchSchedule();
        } catch (err) {
            setError(err.message);
        }
    };

    // --- 削除 ---
    const handleDelete = async () => {
        if (!window.confirm("本当に削除しますか？")) return;
        try {
        await apiFetch(
            `/schedules/${id}`,
            { method: "DELETE" },
            { accessToken, refreshToken, handleRefresh }
        );
            navigate("/schedules");
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        schedule,
        categories,
        error,
        isEditMode,
        setIsEditMode,
        formData,
        handleChange,
        handleUpdate,
        handleDelete,
        darkenColor,
    };
}