import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import { useCategory } from "../categories/categoryHandlers";
import { useDateTime } from "../schedules/useDateTime";
import { getNowDateTime, getNowPlusOneHour } from "../../utils/date";

export function useSchedule(id = null) {
  const { accessToken, refreshToken, handleRefresh } = useAuth();

  const [schedule, setSchedule] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const { selectedDate, selectedDates, setSelectedDates } =
    useDateTime(schedules);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    note: "",
    dates: [
      {
        start_date: getNowDateTime(),
        end_date: getNowPlusOneHour(),
      },
    ],
    category_id: "",
  });

  const navigate = useNavigate();

  const base_url = "/schedules/";

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
      note: res.note || "",
      dates: res.dates || [],
      category_id: res.category_id,
    });
  };

  // 作成
  const handleScheduleCreate = async () => {
    await apiFetch(
      base_url,
      { method: "POST", body: JSON.stringify(formData) },
      { accessToken, refreshToken, handleRefresh }
    );

    resetForm();
    setIsCreating(false);
    navigate("/schedules");
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
      { accessToken, refreshToken, handleRefresh }
    );

    setIsEditMode(false);
    alert("スケジュールを更新しました");
    navigate(`/schedules`);
  };

  // --- 削除 ---
  const handleScheduleDelete = async () => {
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
    // setSelectedDates([getNowDateTime().slice(0, 10)]);
    setFormData({
      title: "",
      note: "",
      dates: [
        {
          start_date: getNowDateTime(),
          end_date: getNowPlusOneHour(),
        },
      ],
      category_id: "",
    });
  };

  return {
    schedule,
    schedules,
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
    error,
  };
}
