import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Admin from './Components/Quanly'; // Layout Admin
import Login from './Page/Login/login';
import Lichlamviec from './Page/lichlamviec/lichlamviec';
import Lichhenkham from './Page/lichhenkham/lichhenkham';
import Thongke from './Page/thongke/thongke';
import Thongtincanhan from './Page/thongtincanhan/thongtincanhan';

// Kiểm tra trạng thái đăng nhập
const isLoggedIn = () => {
  // Kiểm tra xem người dùng có token hoặc thông tin đăng nhập trong sessionStorage
  return sessionStorage.getItem('token') !== null;
};

// Tạo một PrivateRoute component để bảo vệ các route Admin
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isLoggedIn()) {
    // Nếu chưa đăng nhập, chuyển hướng về trang Login
    return <Navigate to="/Login" replace />;
  }
  return <>{children}</>; // Nếu đã đăng nhập, cho phép truy cập
};

// Định nghĩa các route
const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute><Admin /></PrivateRoute>, // Route Admin bảo vệ
    children: [
      {
        path: 'lichlamviec',
        element: <Lichlamviec />, // Trang con
      },
      {
        path: 'lichhenkham',
        element: <Lichhenkham />, // Trang con
      },
      {
        path: 'thongke',
        element: <Thongke />, // Trang con
      },
      {
        path: 'thongtincanhan',
        element: <Thongtincanhan />, // Trang con
      }
    ],
  },
  {
    path: '/Login',
    element: <Login />, // Trang Login
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Đo lường hiệu suất
reportWebVitals();
