import { useState } from "react";
import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { id: "overview",  label: "Overview",  to: "/admin",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id: "products",  label: "Products",  to: "/admin/products",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { id: "users",     label: "Users",     to: "/admin/users",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: "orders",    label: "Orders",    to: "/admin/orders",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
];

export default function AdminLayout() {
  const { user, logout }  = useAuth();          // ← real auth
  const location          = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // redirect if not logged in or not admin
  if (!user)          return <Navigate to="/auth"  replace />;
  if (!user.isAdmin)  return <Navigate to="/"      replace />;

  const active = (to) =>
    to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(to);

  return (
    <div className="flex min-h-screen bg-[#0A1628] font-['Inter',sans-serif]">

      {/* Sidebar */}
      <aside className={`flex flex-col flex-shrink-0 bg-[#0D1B2A] border-r border-[#C9A84C]/15
                         transition-all duration-200 ${collapsed ? "w-16" : "w-56"}`}>

        <div className="h-16 flex items-center gap-3 px-4 border-b border-[#C9A84C]/15">
          <span className="w-8 h-8 rounded-lg bg-[#C9A84C] flex-shrink-0 flex items-center justify-center
                           font-['Playfair_Display',serif] text-base font-bold text-[#0D1B2A]">V</span>
          {!collapsed && (
            <div>
              <p className="text-[13px] font-semibold text-[#F5F0E8] leading-tight">Voltex</p>
              <p className="text-[10px] text-[#C9A84C] uppercase tracking-widest">Admin Panel</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV.map(({ id, label, to, icon }) => (
            <Link key={id} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px]
                          transition-all duration-150
                          ${active(to)
                            ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                            : "text-[#9A9490] hover:bg-[#1B2E45] hover:text-[#F5F0E8]"}`}>
              <span className="flex-shrink-0">{icon}</span>
              {!collapsed && <span className="font-medium">{label}</span>}
              {active(to) && !collapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#C9A84C]/15 p-3 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <span className="w-7 h-7 rounded-full bg-[#1B2E45] border border-[#C9A84C]
                               flex items-center justify-center text-[11px] text-[#F5F0E8] font-medium flex-shrink-0">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
              <div>
                <p className="text-[12px] text-[#F5F0E8] font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-[#C9A84C]">Administrator</p>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12px]
                       text-[#9A9490] hover:bg-[#1B2E45] hover:text-[#F5F0E8] transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform ${collapsed ? "rotate-180" : ""}`}>
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            {!collapsed && "Collapse"}
          </button>
          <Link to="/"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12px]
                       text-[#9A9490] hover:bg-[#1B2E45] hover:text-[#F5F0E8] transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!collapsed && "Back to site"}
          </Link>
          <button onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12px]
                       text-[#9A9490] hover:bg-[#1B2E45] hover:text-[#E05C5C] transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0D1B2A] border-b border-[#C9A84C]/15 flex items-center
                           justify-between px-6 flex-shrink-0">
          <h1 className="text-[15px] font-semibold text-[#F5F0E8]">
            {NAV.find((n) => active(n.to))?.label ?? "Admin"}
          </h1>
          <div className="flex items-center gap-2 text-[12px] text-[#9A9490]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Live
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}