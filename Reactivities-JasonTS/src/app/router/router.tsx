import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import RequireAuth from "./RequireAuth";
import HomePage from "../../features/home/homePage";
import ProfilPage from "../../features/profile/ProfilPage";
import ChatDashboard from "../../features/chat/dashboard/ChatDashboard";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: "update/:id", element: <ActivityForm key={"update"} /> },
          { path: "createActivity", element: <ActivityForm key={"create"} /> },
          { path: "activities", element: <ActivityDashboard /> },
          { path: "activities/:id", element: <ActivityDetails /> },
          { path: "profile/:username", element: <ProfilPage /> },
          { path: "chat", element: <ChatDashboard /> },
        ],
      },
      { path: "", element: <HomePage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
