export function applyInitialTheme() {
  const savedTheme = localStorage.getItem("theme") || "system";

  let newTheme = savedTheme;

  if (savedTheme === "system") {
    const isSystemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    newTheme = isSystemDark ? "dark" : "light";
  }

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(newTheme);
}
