import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import { useCategory } from "../categories/categoryHandlers";
import { useDateTime } from "../schedules/useDateTime";
import { getNowDateTime, getNowPlusOneHour } from "../../utils/date";
import useLoading from "../../hooks/useLoading";
import { useAlert } from "../../context/AlertContext";

export function useSchedule(id = null) {
  const { accessToken, refreshToken, handleRefresh, clearSession } = useAuth();
  const { showAlert } = useAlert();

  const [schedule, setSchedule] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const { selectedDate, selectedDates, setSelectedDates } =
    useDateTime(schedules);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { isFetching, startFetching, stopFetching } = useLoading();

  const [formData, setFormData] = useState({
    title: "",
    note: "",
    dates: [],
    category_id: "",
  });

  const navigate = useNavigate();

  const base_url = "/schedules/";

  // --- API処理 ---

  // 一覧
  const fetchSchedules = async () => {
    startFetching();
    try {
      const res = await apiFetch(
        base_url,
        { method: "GET" },
        { accessToken, refreshToken, handleRefresh, clearSession }
      );
      setSchedules(res);
    } finally {
      stopFetching();
    }
  };

  // 詳細
  const fetchSchedule = async () => {
    startFetching();
    try {
      const res = await apiFetch(
        `${base_url}${id}`,
        { method: "GET" },
        { accessToken, refreshToken, handleRefresh, clearSession }
      );
      setSchedule(res);
      setFormData({
        title: res.title,
        note: res.note || "",
        dates: res.dates || [],
        category_id: res.category_id,
      });
    } finally {
      stopFetching();
    }
  };

  // 作成
  const handleScheduleCreate = async (e) => {
    e.preventDefault();

    await apiFetch(
      base_url,
      { method: "POST", body: JSON.stringify(formData) },
      { accessToken, refreshToken, handleRefresh, clearSession, showAlert }
    );

    resetForm();
    setIsCreating(false);
    fetchSchedules();
    navigate("/schedules");
    showAlert("CREATE_SUCCESS");
  };

  // --- 入力変更 ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 更新 ---
  const handleScheduleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      dates: formData.dates.map((d) => ({
        id: d.id || crypto.randomUUID(), // ← idを維持または生成
        start_date: d.start_date,
        end_date: d.end_date,
      })),
    };

    await apiFetch(
      `${base_url}${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      { accessToken, refreshToken, handleRefresh, clearSession, showAlert }
    );

    setIsEditMode(false);
    navigate(`/schedules`);
    showAlert("UPDATE_SUCCESS");
  };

  // --- 削除 ---
  const handleScheduleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    await apiFetch(
      `${base_url}${id}`,
      { method: "DELETE" },
      { accessToken, refreshToken, handleRefresh, clearSession, showAlert }
    );
    navigate("/schedules");
    showAlert("DELETE_SUCCESS");
  };

  // フォームを初期値に戻す
  const resetForm = () => {
    setFormData({
      title: "",
      note: "",
      dates: [],
      category_id: "",
    });
  };

  return {
    schedule,
    schedules,
    isFetching,
    fetchSchedules,
    fetchSchedule,
    formData,
    handleScheduleCreate,
    isCreating,
    setIsCreating,
    handleChange,
    handleScheduleUpdate,
    isEditMode,
    setIsEditMode,
    handleScheduleDelete,
  };
}
