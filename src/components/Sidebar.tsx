import { PlusSquare, LayoutGrid, Settings, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  onNewChat: () => void;
  currentView: "chat" | "gallery" | "settings";
  onNavigate: (view: "chat" | "gallery" | "settings") => void;
}

export default function Sidebar({ onNewChat, currentView, onNavigate }: SidebarProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };
  const navItems = [
    { icon: <PlusSquare size={20} />, label: "New Chat", onClick: () => { onNewChat(); onNavigate("chat"); }, active: currentView === "chat" },
    { icon: <LayoutGrid size={20} />, label: "Gallery", onClick: () => onNavigate("gallery"), active: currentView === "gallery" },
    { icon: <Settings size={20} />, label: "Settings", onClick: () => onNavigate("settings"), active: currentView === "settings" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r-2 border-black sticky top-0 z-20">
      <div className="p-6 border-b-2 border-black">
        <h2 className="text-xl font-bold font-display tracking-tighter uppercase">ARCHIVE</h2>
        <span className="text-[10px] font-mono text-gray-500">V.1.0.4</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item, idx) => (
          <div
            key={idx}
            onClick={item.onClick}
            className={`p-4 flex items-center gap-3 border-b-2 border-black cursor-pointer transition-colors active:invert ${
              item.active ? "bg-black text-white" : "text-black hover:bg-black/5"
            }`}
          >
            {item.icon}
            <span className="font-mono uppercase text-sm tracking-tight">{item.label}</span>
          </div>
        ))}
      </nav>
      
      <div className="mt-auto border-t-2 border-black">
        <button 
          onClick={toggleTheme}
          className="w-full p-4 flex items-center gap-3 text-black hover:bg-black/5 cursor-pointer transition-colors active:invert"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-mono uppercase text-sm tracking-tight">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </aside>
  );
}
