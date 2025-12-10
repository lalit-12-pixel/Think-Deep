import React, { useState } from "react";
import { useLocation, Link, Outlet } from "react-router-dom";

import { Helmet } from "react-helmet";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineLock } from "react-icons/md";
import { MdOutlineColorLens } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { GrShieldSecurity } from "react-icons/gr";

const Settings = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isPrivate, setIsPrivate] = useState(false);
  const [theme, setTheme] = useState("system");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <>
      <Helmet>
        <title>Account Settings</title>
      </Helmet>

      <style>
        {`
          .nav.active {
            background-color: #47444488 !important;
          }

          .nav:hover:not(.active) {
            background-color: #47444446 !important;
          }

          .scrollable-container {
            scrollbar-width: thin;
            scrollbar-color: #51504d70 #1e1e1e;
          }

          .scrollable-container::-webkit-scrollbar {
            width: 5px;
          }

          .scrollable-container::-webkit-scrollbar-track {
            background: #595757ff;
          }

          .scrollable-container::-webkit-scrollbar-thumb {
            background-color: #5b5b59a5;
            border-radius: 20px;
          }
        `}
      </style>

      <div
        className="onmobilesetting"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          userSelect: "none",
        }}
      >
        <div
          className="onmobileset"
          style={{
            width: "100%",
            maxWidth: "400px",
            margin: "0px 20px 0px auto",
            height: "100%",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid #343030ff",
          }}
        >
          <h4
            className="settingheading"
            style={{
              marginTop: "40px",
              marginLeft: "30px",
              fontWeight: "600",
            }}
          >
            Settings
          </h4>

          <div
            className="settingnav"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginTop: "2rem",
              marginLeft: "2rem",
            }}
          >
            <Link
              to="/settings/edit-profile"
              className={`nav  ${
                currentPath === "/settings/edit-profile" ? "active" : ""
              }`}
              style={{
                height: "50px",
                margin: "0",
                fontFamily: "inherit",
                fontWeight: "500",
                width: "85%",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                textDecoration: "none",
                cursor: "pointer",
                color: "inherit",
                transition: "background-color 0.2s ease",
              }}
            >
              <IoPersonCircleOutline
                size={24}
                style={{ marginRight: "10px" }}
              />
              Edit Profile
            </Link>

            <Link
              to="/settings/account-privacy"
              className={`nav  ${
                currentPath === "/settings/account-privacy" ? "active" : ""
              }`}
              style={{
                height: "50px",
                margin: "0",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                fontFamily: "inherit",
                fontWeight: "500",
                width: "85%",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
            >
              <MdOutlineLock size={24} style={{ marginRight: "10px" }} />
              Account Privacy
            </Link>

            <Link
              to="/settings/theme-preference"
              className={`nav  ${
                currentPath === "/settings/theme-preference" ? "active" : ""
              }`}
              style={{
                height: "50px",
                margin: "0",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                fontFamily: "inherit",
                fontWeight: "500",
                width: "85%",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
            >
              <MdOutlineColorLens size={24} style={{ marginRight: "10px" }} />
              Theme Preference
            </Link>

            <div
              className={`nav  ${
                currentPath === "/settings/notifications" ? "active" : ""
              }`}
              style={{
                height: "50px",
                margin: "0",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                fontFamily: "inherit",
                textDecoration: "none",
                fontWeight: "500",
                color: "inherit",
                width: "85%",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
            >
              <FaRegBell size={24} style={{ marginRight: "10px" }} />
              Notifications
            </div>

            <Link
              to="/settings/password-security"
              className={`nav  ${
                currentPath === "/settings/password-security" ? "active" : ""
              }`}
              style={{
                height: "50px",
                margin: "0",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                paddingLeft: "20px",
                fontFamily: "inherit",
                fontWeight: "500",
                textDecoration: "none",
                width: "85%",
                cursor: "pointer",
                color: "inherit",
                transition: "background-color 0.2s ease",
              }}
            >
              <GrShieldSecurity size={24} style={{ marginRight: "10px" }} />
              Password & Security
            </Link>
          </div>
        </div>

        <div
          className="scrollable-container onmobile"
          style={{
            width: "100%",
            margin: "0px",
            height: "100%",
            padding: "3rem 2rem",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid #343030ff",
            overflowY: "auto",
            overflowX: "hidden",
             userSelect: "none",
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Settings;
