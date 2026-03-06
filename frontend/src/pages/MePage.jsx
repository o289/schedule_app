import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSchedule } from "./schedules/useSchedule.js";
import "./ProfileCard.css";

import { Button } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";

export default function MePage() {
  const { schedules } = useSchedule();
  const today = new Date().toISOString().split("T")[0];
  const todaySchedules = schedules.filter((s) =>
    s.dates?.some((d) => d.start_date.startsWith(today)),
  );

  const navigate = useNavigate();

  const { user, handleLogout } = useAuth();
  const onLogout = () => {
    handleLogout();
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      // 未ログインならログインページへ
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    // リダイレクト直前の瞬間に空画面を返す
    return null;
  }

  return (
    <div>
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">{user.email}</h2>
        </div>

        <div className="profile-body">
          <Button
            variant="contained"
            color="error"
            startIcon={<UndoIcon />}
            onClick={onLogout}
          >
            ログアウト
          </Button>
        </div>
      </div>
    </div>
  );
}
