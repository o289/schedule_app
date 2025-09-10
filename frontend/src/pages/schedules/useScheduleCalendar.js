import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";

export default function useScheduleCalendar() {
    const { accessToken, refreshToken, handleRefresh } = useAuth();

    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    const [isCreating, setIsCreating] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDates, setSelectedDates] = useState([getNowDateTime().slice(0, 10)]);
    const [formData, setFormData] = useState({
        title: "",
        start_time: getNowDateTime(),
        end_time: getNowPlusOneHour(),
        note: "",
        category_id: "",
    });

    // --- 日付補助関数 ---
    function getNowDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    }

    function getNowPlusOneHour() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 60);
        return now.toISOString().slice(0, 16);
    }
    
    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
    };

    // --- API処理 ---
    const fetchSchedules = async () => {
        const res = await apiFetch(
            "/schedules/",
            { method: "GET" },
            { accessToken, refreshToken, handleRefresh }
        );
        setSchedules(res);
    };

    const fetchCategories = async () => {
        const res = await apiFetch(
            "/categories/",
            { method: "GET" },
            { accessToken, refreshToken, handleRefresh }
        );
        setCategories(res);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        for (const date of selectedDates) {
            const payload = {
            ...formData,
            start_time: `${date}T${formData.start_time}`,
            end_time: `${date}T${formData.end_time}`,
            };
            await apiFetch(
                "/schedules/",
                { method: "POST", body: JSON.stringify(payload) },
                { accessToken, refreshToken, handleRefresh }
            );
        }
        await fetchSchedules();
        resetForm();
        setIsCreating(false);
        
    };

    // --- フォーム処理 ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addDate = () => {
        setSelectedDates([...selectedDates, getNowDateTime().slice(0, 10)]);
    };

    const updateDate = (idx, newDate) => {
        const newDates = [...selectedDates];
        newDates[idx] = newDate;
        setSelectedDates(newDates);
    };

    const removeDate = (idx) => {
        setSelectedDates(selectedDates.filter((_, i) => i !== idx));
    };

    const resetForm = () => {
        setSelectedDates([getNowDateTime().slice(0, 10)]);
        setFormData({
            title: "",
            start_time: getNowDateTime(),
            end_time: getNowPlusOneHour(),
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
        setEvents(
        schedules.map((s) => ({
            id: s.id,
            title: s.title,
            start: s.start_time,
            end: s.end_time,
            categoryColor: s.category?.color || "gray",
        }))
        );
    }, [schedules]);

    return {
        schedules,
        events,
        categories,
        error,
        isCreating,
        setIsCreating,
        formData,
        handleChange,
        handleCreate,
        selectedDates,
        addDate,
        updateDate,
        removeDate,
        fetchSchedules,
        handleDateClick,
    };
}