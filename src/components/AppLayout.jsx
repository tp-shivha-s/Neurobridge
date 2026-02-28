import { Link, useLocation } from "react-router-dom";
import { Brain, Zap, BookOpen, Calculator, Shield, Hand, Ear, Sparkles, Home, LogOut, User, } from "lucide-react";
import { useRole } from "@/context/RoleContext";
const navItems = [
    { title: "Home", path: "/", icon: Home },
    { title: "ASD", path: "/asd", icon: Brain },
    { title: "ADHD", path: "/adhd", icon: Zap },
    { title: "Dyslexia", path: "/dyslexia", icon: BookOpen },
    { title: "Dyscalculia", path: "/dyscalculia", icon: Calculator },
    { title: "OCD", path: "/ocd", icon: Shield },
    { title: "Dyspraxia", path: "/dyspraxia", icon: Hand },
    { title: "APD", path: "/apd", icon: Ear },
    { title: "Tourette's", path: "/tourettes", icon: Sparkles },
];
export default function AppLayout({ children }) {
    const location = useLocation();
  const { isAdmin, currentEmail, signOut } = useRole();
    return (<div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4 gap-2 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground"/>
          </div>
          <span className="text-xl font-bold tracking-tight">NeuroBridge</span>
        </div>

        {/* ABHA ID Status */}
        <div className="neuro-card p-3 mb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground"/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">ABHA ID</p>
            <p className="text-sm font-semibold truncate">NB-2024-XXXX</p>
            <p className="text-xs mt-1 text-muted-foreground truncate">{currentEmail}</p>
            <p className="text-xs mt-1 text-muted-foreground">
              Role: <span className="font-semibold text-foreground">{isAdmin ? "Admin" : "User"}</span>
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (<Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"}`}>
                <item.icon className="w-5 h-5 flex-shrink-0"/>
                <span>{item.title}</span>
              </Link>);
        })}
        </nav>

        <button type="button" onClick={signOut} className="neuro-btn-outline text-sm gap-2 mt-2">
          <LogOut className="w-4 h-4"/>
          Sign Out
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-border bg-card px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary"/>
            <span className="font-bold text-lg">NeuroBridge</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {isAdmin ? "Admin" : "User"}
            </span>
          </div>
          <button type="button" onClick={signOut} className="neuro-btn-ghost text-sm py-2 px-3 min-h-0 gap-1">
            <LogOut className="w-4 h-4"/>
            Sign Out
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          <div className={`mb-4 rounded-lg border px-3 py-2 text-sm ${isAdmin ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
            {isAdmin
              ? "Admin mode: scheduling, settings, AI controls, and content management are enabled."
              : "User mode: therapeutic tools remain available while admin configuration controls are hidden or read-only."}
          </div>
          {children}
        </main>
      </div>
    </div>);
}
