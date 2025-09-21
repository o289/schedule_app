import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import { useCategory } from "../categories/categoryHandlers"

export function useSchedule(id = null) {
    const { accessToken, refreshToken, handleRefresh } = useAuth();
    const [schedule, setSchedule] = useState(null);
    const [schedules, setSchedules] = useState([]);
    
    const { fetchCategories } = useCategory()

    const [isCreating, setIsCreating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        title: "",
        start_time: "",
        end_time: "",
        note: "",
        category_id: "",
    });

    const navigate = useNavigate();

    const base_url = "/schedules/"

    // --- API処理 ---
    
    // 一覧
    const fetchSchedules = async () => {
        const res = await apiFetch(
            base_url,
            { method: "GET" },
            { accessToken, refreshToken, handleRefresh }
        );
        setSchedules(res);
    };

    // 詳細
    const fetchSchedule = async () => {
        const res = await apiFetch(
            `${base_url}${id}`,
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
    };

    // 作成
    const handleCreate = async (e) => {
        e.preventDefault();
        for (const date of selectedDates) {
            const payload = {
                ...formData,
                start_time: `${date}T${formData.start_time}`,
                end_time: `${date}T${formData.end_time}`,
            };
            await apiFetch(
                base_url,
                { method: "POST", body: JSON.stringify(payload) },
                { accessToken, refreshToken, handleRefresh }
            );
        }
        await fetchSchedules();
        resetForm();
        setIsCreating(false);
        
    };

    // --- 入力変更 ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- 更新 ---
    const handleUpdate = async (e) => {
        await apiFetch(
            `${base_url}${id}`,
            {
                method: "PUT",
                body: JSON.stringify(formData),
            },
            { accessToken, refreshToken, handleRefresh }
        );
        setIsEditMode(false);
        fetchSchedule();
        
    };

    // --- 削除 ---
    const handleDelete = async () => {
        if (!window.confirm("本当に削除しますか？")) return;
        await apiFetch(
            `${base_url}${id}`,
            { method: "DELETE" },
            { accessToken, refreshToken, handleRefresh }
        );
        navigate("/schedules");
    };

    // フォームを初期値に戻す
    const resetForm = () => {
        setSelectedDates([getNowDateTime().slice(0, 10)]);
        setFormData({
            title: "",
            start_time: "",
            end_time: "",
            note: "",
            category_id: "",
        });
    };



    // --- useEffect ---
    useEffect(() => {
        fetchSchedules();
        fetchCategories();
    }, []);

    
    useEffect(() => {
        if (id) {
            fetchSchedule();
            fetchCategories();
        }
    }, [id]);


    return {
        schedule,
        schedules,
        fetchSchedule,
        formData,
        fetchSchedule,
        handleCreate,        
        isCreating,
        setIsCreating,
        handleChange,
        handleUpdate,
        isEditMode,
        setIsEditMode,
        handleDelete,
        error
    }
}