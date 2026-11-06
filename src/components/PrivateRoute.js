import { Navigate, Outlet } from 'react-router-dom';

// chưa đăng nhập thì không cho vào, đẩy về /login
function PrivateRoute() {
  const user = JSON.parse(localStorage.getItem('user'));

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
