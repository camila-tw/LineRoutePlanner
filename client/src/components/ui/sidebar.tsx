import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Map, 
  History, 
  Settings, 
  HelpCircle, 
  Route
} from "lucide-react";

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  const navItems = [
    {
      label: "地址輸入與路徑規劃",
      icon: <Map className="mr-2 h-5 w-5" />,
      href: "/",
    },
    {
      label: "歷史記錄",
      icon: <History className="mr-2 h-5 w-5" />,
      href: "/history",
    },
    {
      label: "系統設定",
      icon: <Settings className="mr-2 h-5 w-5" />,
      href: "/settings",
    },
    {
      label: "說明與支援",
      icon: <HelpCircle className="mr-2 h-5 w-5" />,
      href: "/help",
    },
  ];

  return (
    <aside className="bg-gray-800 text-white w-full md:w-64 md:min-h-screen">
      <div className="p-4">
        <h1 className="text-xl font-bold flex items-center">
          <Route className="mr-2 h-6 w-6" />
          路徑規劃工具
        </h1>
      </div>
      
      <nav className="p-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-1">
              <Link href={item.href}>
                <a
                  className={cn(
                    "flex items-center p-2 rounded-md",
                    currentPath === item.href
                      ? "bg-blue-700 text-white"
                      : "hover:bg-gray-700"
                  )}
                >
                  {item.icon}
                  {item.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* API Status Indicators */}
      <div className="p-4 border-t border-gray-700 mt-4">
        <h3 className="text-sm uppercase text-gray-400 mb-2">API 狀態</h3>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Google Maps API</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">LINE Messaging API</span>
        </div>
      </div>
    </aside>
  );
}
