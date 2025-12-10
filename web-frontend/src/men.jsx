import { createRoot } from "react-dom/client";
import App from "./Appp.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Posts from "./component/posts.jsx";
import Createpost from "./component/createpost.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from "./component/login.jsx";
import Signup from "./component/signup.jsx";
import Profile from "./component/profile.jsx";
import Settings from "./component/settings.jsx";
import Editprofile from "./component/settingmenu/editprofile.jsx";
import Privacy from "./component/settingmenu/accountprivacy.jsx";
import Security from "./component/settingmenu/Password&Security.jsx";
import Theme from "./component/settingmenu/theme.jsx";
import { applyInitialTheme } from "./initialtheme.jsx";
import Profilelikes from "./component/profilemenu/profilelikes.jsx";
import Profilearticles from "./component/profilemenu/profilearticles.jsx";
import Profilereplis from "./component/profilemenu/profilereplies.jsx";
import Faq from "./component/faq.jsx";
import Features from "./component/features.jsx";
import Landing from "./component/startapp.jsx";
import ThoughtOfTheDay from "./component/thought-of-the-day.jsx";

applyInitialTheme();

const routes = [
  { path: "/about", element: <Landing /> },
  { path: "/faqs", element: <Faq /> },
  { path: "/features", element: <Features /> },
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Posts /> },
      { path: "/home", element: <Posts /> },
      { path: "/posts", element: <Posts /> },
      { path: "/share-thought", element: <Createpost /> },
      { path: "/thought-of-the-day", element: <ThoughtOfTheDay /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      {
        path: "profile",
        element: <Profile />,
        children: [
          { path: "liked", element: <Profilelikes /> },
          { path: "saved", element: <Profilearticles /> },
          { path: "replies", element: <Profilereplis /> },
        ],
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          { path: "edit-profile", element: <Editprofile /> },
          { path: "account-privacy", element: <Privacy /> },
          { path: "theme-preference", element: <Theme /> },
          { path: "password-security", element: <Security /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);
const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
