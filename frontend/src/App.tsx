import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import RequireAuth from "./components/RequireAuth.jsx";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MePage from "./pages/MePage";

import { AuthProvider } from "./context/AuthContext.jsx"; // ←追加
import { AlertProvider } from "./context/AlertContext.jsx";

import CategoryListPage from "./pages/categories/CategoryListPage";

import ScheduleCalendarPage from "./pages/schedules/ScheduleCalendarPage";
import ScheduleDetailPage from "./pages/schedules/ScheduleDetailPage";

import TopPage from "./pages/TopPage";

function App() {
  return (
    <Router>
      <AlertProvider>
        <AuthProvider>
          {/* Context を提供する */}
          <Navbar />
          <Routes>
            <Route path="/" element={<TopPage />} />
            {/* ユーザー関連 */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/me"
              element={
                <RequireAuth>
                  <MePage />
                </RequireAuth>
              }
            />
            {/* カテゴリ関連 */}
            <Route
              path="/categories"
              element={
                <RequireAuth>
                  <CategoryListPage />
                </RequireAuth>
              }
            />
            {/* カレンダー */}
            <Route
              path="/schedules"
              element={
                <RequireAuth>
                  <ScheduleCalendarPage />
                </RequireAuth>
              }
            />
            <Route
              path="/schedules/:id"
              element={
                <RequireAuth>
                  <ScheduleDetailPage />
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </AlertProvider>
    </Router>
  );
}

export default App;
