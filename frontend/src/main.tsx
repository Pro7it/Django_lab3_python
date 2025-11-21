import React from "react";
import ReactDom from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PlaysPage from "./pages/PlaysPage";
import ErrorPage from "./pages/ErrorPage";
import PlayPage from "./pages/PlayPage";
import { ConfigProvider } from "antd";
import { colors } from "./config";
import PlayCreatePage from './pages/PlayCreatePage';
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/plays",
    element: <PlaysPage />,
  },
  {
    path: "/plays/create",
    element: <PlayCreatePage />,
  },
  {
    path: "/plays/:playid",
    element: <PlayPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  }
]);

ReactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorLink: colors.accent,
          colorText: colors["primary-txt"],
          fontSize: 16,
          fontWeightStrong: 400
        },
        components: {
          Skeleton: {
            paragraphLiHeight: 16,
          },
          Select: {
            optionSelectedBg: colors.accent,
            optionActiveBg: colors.accent + "37",
            colorBgElevated: colors.secondary
          },
          Message: {
            contentBg: colors.secondary   
          }
        }
      }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
);
