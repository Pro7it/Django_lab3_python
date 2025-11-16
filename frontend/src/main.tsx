import React from "react";
import ReactDom from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PlaysPage from "./pages/PlaysPage";
import ErrorPage from "./pages/ErrorPage";
import PlayPage from "./pages/PlayPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/plays",
    element: <PlaysPage />,
    children: [
      {
        path: "/plays/:playid",
        element: <PlayPage />,
      },
    ],
  },
]);

ReactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
