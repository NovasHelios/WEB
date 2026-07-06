import { useEffect, useState } from "react";

const SIDEBAR_STORAGE_KEY = "helios.sidebarOpen";

const readSidebarOpen = () => {
  if (typeof window === "undefined") return true;

  const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);

  if (storedValue === null) return true;

  return storedValue !== "false";
};

const useSidebarOpen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(readSidebarOpen);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  return [sidebarOpen, setSidebarOpen];
};

export default useSidebarOpen;
