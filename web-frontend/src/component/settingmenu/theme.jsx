import React, { useEffect, useState } from "react";

const Theme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  useEffect(() => {
    const root = document.documentElement;

    let newTheme = theme;

    if (theme === "system") {
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      newTheme = isSystemDark ? "dark" : "light";
    }

    root.classList.remove("light", "dark");
    root.classList.add(newTheme);

    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <>
      <h4
        style={{
          marginBottom: "30px",
          marginLeft: "5px",
          fontWeight: "600",
        }}
      >
        Switch Appearance
      </h4>

      <div
        className="mb-4 d-flex align-items-center justify-content-between"
        style={{
          border: "0.5px solid #343030ff",
          width: "100%",
          height: "70px",
          borderRadius: "10px",
        }}
      >
        <label
          className="form-label  mb-0 me-3"
          htmlFor="themeSelect"
          style={{
            whiteSpace: "nowrap",
            marginLeft: "20px",
            fontWeight: "400",
          }}
        >
          Mode
        </label>
        <select
          id="themeSelect"
          className="form-select w-auto"
          style={{
            minWidth: "200px",
            marginRight: "10px",
            backgroundColor:
              theme === "dark" ||
              (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "#121212"
                : "#ffffff",
            color:
              theme === "dark" ||
              (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "#ffffff"
                : "#121212",
            border: "0.5px solid #343030ff",
          }}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">Device</option>
        </select>
      </div>

      <p
        style={{
          fontFamily: "inherit",
          color: "rgba(132, 128, 128, 1)",
          fontSize: "12px",
          lineHeight: "16px",
        }}
      >
        Light Theme: Bright and clean — great for daytime use or well-lit
        environments. It provides high contrast with a white background and dark
        text.
      </p>

      <p
        style={{
          fontFamily: "inherit",
          color: "rgba(132, 128, 128, 1)",
          fontSize: "12px",
          lineHeight: "16px",
        }}
      >
        Dark Theme: Easy on the eyes, especially in low-light conditions. This
        theme features darker backgrounds to reduce glare and help conserve
        device battery life (especially on OLED screens).
      </p>

      <p
        style={{
          fontFamily: "inherit",
          color: "rgba(132, 128, 128, 1)",
          fontSize: "12px",
          lineHeight: "16px",
        }}
      >
        System Theme: Automatically adjusts based on your device’s system
        settings. If your device is set to dark mode, the app will use the dark
        theme — and vice versa.
      </p>
    </>
  );
};

export default Theme;
