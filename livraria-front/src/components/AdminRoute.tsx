import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AdminRoute() {
  const { user } = useAuth();

  return user?.is_staff ? <Outlet /> : <Navigate to="/books" />;
}

export default AdminRoute;