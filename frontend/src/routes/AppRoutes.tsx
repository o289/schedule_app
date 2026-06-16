import { Routes, Route } from "react-router-dom";
import ScheduleCalendarPage from "../pages/schedules/ScheduleCalendarPage";
import EntrancePage from "../pages/EntrancePage";
import RequireAuth from "../components/RequireAuth";
import { CalendarProvider } from "../context/CalendarContext";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<EntrancePage />} />

        <Route element={<RequireAuth />}>
          <Route
            path="/schedules"
            element={
              <CalendarProvider>
                <ScheduleCalendarPage />
              </CalendarProvider>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
