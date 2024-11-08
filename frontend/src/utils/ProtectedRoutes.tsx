import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '@/utils/auth';

const ProtectedRoutes = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/authentication" />
};

export default ProtectedRoutes