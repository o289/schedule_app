import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/client";
import { useCategory } from "../categories/categoryHandlers";
import { useDateTime } from "../schedules/useDateTime";
import useLoading from "../../hooks/useLoading";
import { useAlert } from "../../context/AlertContext";
import { useScheduleForm } from "../../hooks/schedule/useScheduleForm";

export function useSchedule(id = null) {
  const { accessToken, refreshToken, handleRefresh, clearSession } = useAuth();
  const { showAlert } = useAlert();

  const [schedule, setSchedule] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const { draftSchedule, setDraftSchedule, resetDraft, handleChange } =
    useScheduleForm();
  const { isFetching, startFetching, stopFetching } = useLoading();

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
        { accessToken, refreshToken, handleRefresh, clearSession },
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
        { accessToken, refreshToken, handleRefresh, clearSession },
      );
      setSchedule(res);
    } finally {
      stopFetching();
    }
  };

  // 作成
  const handleScheduleCreate = async (e) => {
    e.preventDefault();

    await apiFetch(
      base_url,
      { method: "POST", body: JSON.stringify(draftSchedule) },
      { accessToken, refreshToken, handleRefresh, clearSession, showAlert },
    );

    resetDraft();
    await fetchSchedules();
    showAlert("CREATE_SUCCESS");
  };

  // --- 更新 ---
  const handleScheduleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...draftSchedule,
      dates: draftSchedule.dates.map((d) => ({
        id: d.id || crypto.randomUUID(), // ← idを維持または生成
        start_date: d.start_date,
        end_date: d.end_date,
      })),
    };

    await apiFetch(
      `${base_url}${draftSchedule.id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      { accessToken, refreshToken, handleRefresh, clearSession, showAlert },
    );

    await fetchSchedules();
    showAlert("UPDATE_SUCCESS");
  };

  // --- 削除 ---
  const handleScheduleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    await apiFetch(
      `${base_url}${draftSchedule.id}`,
      { method: "DELETE" },
      { accessToken, refreshToken, handleRefresh, clearSession, showAlert },
    );
    await fetchSchedules();
    showAlert("DELETE_SUCCESS");
  };

  return {
    schedule,
    schedules,
    isFetching,
    fetchSchedules,
    fetchSchedule,
    draftSchedule,
    setDraftSchedule,
    resetDraft,
    handleScheduleCreate,
    handleChange,
    handleScheduleUpdate,
    handleScheduleDelete,
  };
}
