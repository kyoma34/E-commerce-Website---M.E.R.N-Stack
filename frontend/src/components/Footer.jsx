import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products",  to: "/shop" },
    { label: "Laptops",       to: "/shop?cat=laptops" },
    { label: "Smartphones",   to: "/shop?cat=smartphones" },
    { label: "Audio",         to: "/shop?cat=audio" },
    { label: "Accessories",   to: "/shop?cat=accessories" },
  ],
  Company: [
    { label: "About",    to: "/about" },
    { label: "Careers",  to: "/careers" },
    { label: "Press",    to: "/press" },
    { label: "Contact",  to: "/contact" },
  ],
  Support: [
    { label: "FAQ",          to: "/faq" },
    { label: "Shipping",     to: "/shipping" },
    { label: "Returns",      to: "/returns" },
    { label: "Track Order",  to: "/track" },
  ],
};

/* social icons */
const SOCIALS = [
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.95C5.12 20 12 20 12 20s6.88 0 8.6-.47a2.78 2.78 0 0 0 1.94-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] border-t border-[#C9A84C]/15 font-['Inter',sans-serif]">
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-10">

        {/* ── 4-col grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* col 1 — brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-lg bg-[#C9A84C] flex items-center justify-center
                               font-['Playfair_Display',serif] text-lg font-bold text-[#0D1B2A]">
                V
              </span>
              <span className="font-['Playfair_Display',serif] text-lg text-[#F5F0E8] tracking-wide">
                Voltex
              </span>
            </div>
            <p className="text-[13px] text-[#9A9490] mb-5 leading-relaxed">
              Power. Precision. Delivered.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-[#9A9490] hover:text-[#C9A84C] transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* cols 2-4 — links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9A84C] mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-[14px] text-[#9A9490] hover:text-[#F5F0E8] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── bottom bar ── */}
        <div className="border-t border-[#C9A84C]/12 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-3">
          <p className="text-[12px] text-[#9A9490]">
            © 2025 Voltex. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-[#9A9490]">
            <Link to="/privacy" className="hover:text-[#F5F0E8] transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-[#F5F0E8] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}