// components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import AdminLogin from "../pages/admin/AdminLogin";

const ProtectedRoute = ({ children, setNotification, setActivePage }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AdminLogin
        setNotification={setNotification}
        setActivePage={setActivePage}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
