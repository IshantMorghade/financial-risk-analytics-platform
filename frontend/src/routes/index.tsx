import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import DataUploadPage from "../pages/DataUploadPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminPage from "../pages/AdminPage";
import ComparePage from "../pages/ComparePage";

export const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/data",
        element: <DataUploadPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/compare",
        element: <ComparePage />,
      },
    ],
  },
];