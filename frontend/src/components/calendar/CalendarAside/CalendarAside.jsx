import { Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

import "./calendarAside.css";
import MiniMonthNav from "../MiniMonthNav/MiniMonthNav";
import useIsMobile from "../../../hooks/useIsMobile";
import { useCategory } from "../../../pages/categories/categoryHandlers";
import { useSchedule } from "../../../pages/schedules/useSchedule";
import ScheduleForm from "../../../pages/schedules/ScheduleForm";
import ScheduleAsideForm from "../ScheduleAsideForm/ScheduleAsideForm";
import ScheduleAsideDetail from "../ScheduleAsideDetail";

export default function CalendarAside({
  selectedDate,
  setSelectedDate,
  onDayClick,
  onWeekClick,
  draftSchedule,
  resetForm,
  handleScheduleCreate,
  handleScheduleUpdate,
  handleScheduleDelete,
  handleChange,
  asideMode,
  setAsideMode,
  categories,
  setIsDrawerOpen = null,
  closeButton = null,
}) {
  const isMobile = useIsMobile();

  function renderAsideContent() {
    switch (asideMode) {
      case "create":
        return (
          <ScheduleAsideForm
            draftSchedule={draftSchedule}
            categories={categories}
            onChange={handleChange}
            onSubmit={handleScheduleCreate}
            onCancel={() => {
              setAsideMode(null);
              resetForm;
            }}
          />
        );
      case "edit":
        return (
          <ScheduleAsideForm
            draftSchedule={draftSchedule}
            categories={categories}
            onChange={handleChange}
            onSubmit={handleScheduleUpdate}
            onCancel={() => {
              setAsideMode(null);
            }}
          />
        );
      case "detail":
        return (
          <ScheduleAsideDetail
            schedule={draftSchedule}
            handleScheduleDelete={handleScheduleDelete}
            setAsideMode={setAsideMode}
            selectedDate={selectedDate}
            setIsDrawerOpen={setIsDrawerOpen}
          />
        );
      default:
        return (
          <>
            <div className="aside-mini">
              <MiniMonthNav
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onDayClick={onDayClick}
                onWeekClick={onWeekClick}
                setIsDrawerOpen={setIsDrawerOpen}
              />
            </div>

            <div className="aside-actions">
              <Button
                variant="contained"
                className="aside-btn primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  setAsideMode("create");
                  resetForm();
                  closeButton;
                }}
              >
                スケジュール登録
              </Button>

              <Button
                variant="contained"
                className="aside-btn secondary"
                startIcon={<AddIcon />}
              >
                仮押さえ登録
              </Button>

              <Link to="/me" className="dropdown-item">
                マイページ
              </Link>
              <Link to="/categories" className="dropdown-item">
                カテゴリー
              </Link>
              <Link to="/schedules" className="dropdown-item">
                スケジュール
              </Link>

              {closeButton && (
                <Button
                  type="button"
                  variant="contained"
                  startIcon={<CloseIcon />}
                  className="aside-btn cancel"
                  onClick={closeButton}
                >
                  戻る
                </Button>
              )}
            </div>
          </>
        );
    }
  }

  return <aside className="calendar-aside">{renderAsideContent()}</aside>;
}
