import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx"; // ←追加
import { AlertProvider } from "./context/AlertContext.jsx";
import AppRoutes from "./routes/AppRoutes.js";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Router>
      <AlertProvider>
        <AuthProvider>
          <Navbar />
          <AppRoutes />
        </AuthProvider>
      </AlertProvider>
    </Router>
  );
}

export default App;
