import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import SyllabusPage from './pages/SyllabusPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* các trang cần đăng nhập */}
        <Route element={<PrivateRoute />}>
          <Route path="/syllabus" element={<SyllabusPage />} />
        </Route>

        {/* "/" và mọi đường dẫn sai đều về /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
