import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Package, Settings } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",    to: "/" },
  { label: "Shop",    to: "/shop" },
  { label: "About",   to: "/about" },
  { label: "Contact", to: "/contact" },
];

/* ── mock user — swap with your real auth context ── */
const MOCK_USER = {
  loggedIn: true,
  name: "Alaa",
  initials: "A",
  cartCount: 3,
};

export default function Navbar() {
  const location = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-[68px] bg-[#0D1B2A] border-b border-[#C9A84C]/15 flex items-center px-8">

      {/* ── Logo ── */}
      <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
        <span className="w-9 h-9 rounded-lg bg-[#C9A84C] flex items-center justify-center
                         font-['Playfair_Display',serif] text-lg font-bold text-[#0D1B2A]">
          V
        </span>
        <span className="font-['Playfair_Display',serif] text-lg tracking-wide text-[#F5F0E8]">
          Voltex
        </span>
      </Link>

      {/* ── Nav links (centered) ── */}
      <div className="flex-1 flex items-center justify-center gap-8">
        {NAV_LINKS.map(({ label, to }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`text-[14px] transition-colors duration-150 relative
                ${active
                  ? "text-[#F5F0E8] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[1.5px] after:bg-[#C9A84C] after:rounded"
                  : "text-[#9A9490] hover:text-[#F5F0E8]"}`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {MOCK_USER.loggedIn ? (
          <>
            {/* Cart icon */}
            <Link to="/cart" className="relative p-1.5 text-[#9A9490] hover:text-[#F5F0E8] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Cart">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {MOCK_USER.cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C9A84C]
                                 text-[#0D1B2A] text-[10px] font-bold flex items-center justify-center">
                  {MOCK_USER.cartCount}
                </span>
              )}
            </Link>

            {/* Avatar + dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-1.5 group"
                aria-label="User menu"
              >
                <span className="w-8 h-8 rounded-full bg-[#1B2E45] border-2 border-[#C9A84C]
                                 flex items-center justify-center text-[#F5F0E8] text-[13px] font-medium">
                  {MOCK_USER.initials}
                </span>
                {/* chevron */}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#9A9490"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4"/>
                </svg>
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-[#1B2E45] border border-[#C9A84C]/15
                                rounded-xl overflow-hidden shadow-lg z-50">
                  {[
                    { label: "My Orders", to: "/orders", icon: <Package /> },
                    { label: "Settings",  to: "/settings", icon: <Settings /> },
                  ].map(({ label, to, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#9A9490]
                                 hover:bg-[#243D57] hover:text-[#F5F0E8] transition-colors"
                    >
                      <span className="text-base">{icon}</span>
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-[#C9A84C]/10" />
                  <button
                    onClick={() => { setDropOpen(false); /* call logout */ }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#9A9490]
                               hover:bg-[#243D57] hover:text-[#E05C5C] transition-colors"
                  >
                    <span className="text-base"><LogOut /></span>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* logged-out state */
          <>
            <Link
              to="/login"
              className="h-9 px-4 text-[13px] font-medium text-[#C9A84C] border border-[#C9A84C]
                         rounded-lg hover:bg-[#C9A84C]/10 transition-colors flex items-center"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="h-9 px-4 text-[13px] font-medium text-[#0D1B2A] bg-[#C9A84C]
                         rounded-lg hover:bg-[#E8D5A3] transition-colors flex items-center"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}