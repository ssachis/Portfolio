import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Default to dark theme as requested by existing layout
    setDark(true);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setDark(!dark)}
      className="flex h-9 w-9 items-center justify-center border border-gray-700 rounded bg-black/20 text-gray-300 hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
}
