import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MePage from "./pages/MePage";

import { AuthProvider } from "./context/AuthContext.jsx"; // ←追加

import CategoryListPage from "./pages/categories/CategoryListPage";

import ScheduleCalendarPage from "./pages/schedules/ScheduleCalendarPage"
import ScheduleDetailPage from "./pages/schedules/ScheduleDetailPage"

import TopPage from "./pages/TopPage"



function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Context を提供する */}
        <Navbar />
        <Routes>
          <Route path="/" element={< TopPage />} />
          {/* ユーザー関連 */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/me" element={<MePage />} />
          {/* カテゴリ関連 */}
          <Route path="/categories" element={<CategoryListPage />} />
          {/* カレンダー */}
          <Route path="/schedules" element={<ScheduleCalendarPage />} />
          <Route path="/schedules/:id" element={<ScheduleDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;