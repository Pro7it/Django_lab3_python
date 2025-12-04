import React, { useEffect } from "react";
import ReactDom from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PlaysPage from "./pages/PlaysPage";
import ErrorPage from "./pages/ErrorPage";
import PlayPage from "./pages/PlayPage";
import { ConfigProvider, message, type ThemeConfig } from "antd";
import { colors } from "./config";
import PlayCreatePage from './pages/PlayCreatePage';
import LoginPage from "./pages/LoginPage";
import { useMessage } from "./utils/StateManager";

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

const AntdTheme: ThemeConfig = {
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
    },
    Popover: {
      colorBgElevated: colors["floating-btn"],
      colorText: colors.primary,
      colorTextHeading: colors.primary,
      titleMinWidth: "max-content",
    },
    Tooltip: {  
      colorBgSpotlight: colors["floating-btn"],
    },
    Input: {
      colorBgBase: colors.accent,
      colorBorder: colors.accent,
      activeBorderColor: colors.accent,
      hoverBorderColor: colors.accent,

    }
  }
}

const Main: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const setMessageApi = useMessage(s => s.setMessageApi)

  useEffect(() => {
    setMessageApi(messageApi);
  }, [messageApi, setMessageApi]);

  return <>
    {contextHolder}
    <RouterProvider router={router} />
  </>
}

ReactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={AntdTheme}>
      <Main />
    </ConfigProvider>
  </React.StrictMode>
);
