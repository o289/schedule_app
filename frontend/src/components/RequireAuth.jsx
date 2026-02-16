import { useAuth } from "../context/AuthContext";
import EntrancePage from "../pages/EntrancePage";
import Loading from "./Loading";
export default function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading && !user) {
    return <Loading />;
  }

  if (!user) {
    return <EntrancePage />;
  }

  return children;
}
