import { Routes, Route } from "react-router-dom";

import TopPage from "../pages/TopPage";

import MePage from "../pages/MePage";
import CategoryListPage from "../pages/categories/CategoryListPage";

import ScheduleCalendarPage from "../pages/schedules/ScheduleCalendarPage";
import ScheduleDetailPage from "../pages/schedules/ScheduleDetailPage";

import EntrancePage from "../pages/EntrancePage";
import RequireAuth from "../components/RequireAuth";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<EntrancePage />} />

        <Route element={<RequireAuth />}>
          <Route path="/home" element={<TopPage />} />
          <Route path="/me" element={<MePage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/schedules" element={<ScheduleCalendarPage />} />
          <Route path="/schedules/:id" element={<ScheduleDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}
