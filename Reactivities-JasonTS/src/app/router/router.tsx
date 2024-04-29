import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import RequireAuth from "./RequireAuth";
import HomePage from "../../features/home/homePage";
import ProfilPage from "../../features/profile/ProfilPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children : [
          { path: "createActivity", element: <ActivityForm key={"create"} /> },
          { path: "update/:id", element: <ActivityForm key={"update"} /> },
          { path: "activities", element: <ActivityDashboard /> },
          { path: "activities/:id", element: <ActivityDetails /> },
          {path:'profile/:username', element:<ProfilPage/>}
        ],
      },
      {path:'', element:<HomePage/>},
    ],
  },
];

export const router = createBrowserRouter(routes);