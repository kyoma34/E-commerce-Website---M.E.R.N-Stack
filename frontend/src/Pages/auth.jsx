import { useState } from "react";

/* ─── helpers ─────────────────────────────────────────── */
const getStrength = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8)          s++;
  if (/[A-Z]/.test(pwd))        s++;
  if (/[0-9]/.test(pwd))        s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};
const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = ["", "bg-red-500", "bg-amber-400", "bg-yellow-400", "bg-emerald-400"];
const STRENGTH_TEXT  = ["", "text-red-400", "text-amber-400", "text-yellow-400", "text-emerald-400"];

/* ─── reusable field wrapper ───────────────────────────── */
function Field({ label, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-widest text-[#9A9490]">
        {label}
      </label>
      {children}
      {error && <span className="text-xs text-[#E05C5C]">{error}</span>}
    </div>
  );
}

/* ─── main component ───────────────────────────────────── */
export default function Auth() {
  const [mode, setMode]              = useState("login");
  const [showPwd, setShowPwd]        = useState(false);
  const [errors, setErrors]          = useState({});
  const [form, setForm]              = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });

  const strength = getStrength(form.password);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.email)                          e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email  = "Enter a valid email.";
    if (!form.password)                        e.password = "Password is required.";
    else if (form.password.length < 8)         e.password = "At least 8 characters.";
    if (mode === "register") {
      if (!form.firstName)                     e.firstName       = "Required.";
      if (!form.lastName)                      e.lastName        = "Required.";
      if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords don't match.";
    }
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    alert(mode === "login" ? "Signing in…" : "Creating account…");
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setForm({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  };

  /* shared input className */
  const inputCls = (name) =>
    `h-12 w-full rounded-md bg-[#0D1B2A] px-3.5 text-sm text-[#F5F0E8] placeholder-[#9A9490]
     border outline-none transition-all duration-150
     focus:border-[#C9A84C] focus:border-l-[3px] focus:ring-2 focus:ring-[#C9A84C]/20
     ${errors[name] ? "border-[#E05C5C] ring-2 ring-[#E05C5C]/20" : "border-white/10"}`;

  return (
    /* ── page ── */
    <div className="flex min-h-screen bg-[#0D1B2A] font-['Inter',sans-serif]">

      {/* ── left panel (hidden on mobile) ── */}
      <div className="relative hidden lg:flex flex-1 items-center justify-center overflow-hidden">

        {/* circuit grid */}
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* content */}
        <div className="relative z-10 max-w-md px-12">
          {/* logo */}
          <div className="flex items-center gap-3 mb-14">
            <span className="w-12 h-12 rounded-lg bg-[#C9A84C] flex items-center justify-center text-[#0D1B2A] font-['Playfair_Display',serif] text-2xl font-bold">
              V
            </span>
            <span className="font-['Playfair_Display',serif] text-xl tracking-wider text-[#F5F0E8]">
              Voltex
            </span>
          </div>

          <h2 className="font-['Playfair_Display',serif] text-6xl leading-[1.08] text-[#F5F0E8] mb-6">
            Power.<br />Precision.<br />Delivered.
          </h2>
          <p className="text-sm text-[#9A9490] leading-relaxed">
            Premium electronics, curated for those who demand more.
          </p>
        </div>
      </div>

      {/* ── right form side ── */}
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[440px] bg-[#1B2E45] rounded-2xl border border-[#C9A84C]/20 px-8 py-10">

          {/* tabs */}
          <div className="flex gap-1 bg-[#0D1B2A] rounded-md p-1 mb-6">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-[13px] font-medium rounded transition-all duration-150 capitalize
                  ${mode === m
                    ? "bg-[#243D57] text-[#C9A84C]"
                    : "text-[#9A9490] hover:text-[#F5F0E8]"}`}
              >
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          {/* gold rule + heading */}
          <div className="w-10 h-0.5 bg-[#C9A84C] rounded mb-4" />
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#F5F0E8] mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-[13px] text-[#9A9490] mb-7">
            {mode === "login" ? "Sign in to your Voltex account." : "Join Voltex and start shopping."}
          </p>

          <form onSubmit={submit} noValidate>

            {/* name row — register only */}
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" id="firstName" error={errors.firstName}>
                  <input className={inputCls("firstName")} id="firstName" name="firstName"
                    type="text" placeholder="Alaa" value={form.firstName} onChange={change} />
                </Field>
                <Field label="Last name" id="lastName" error={errors.lastName}>
                  <input className={inputCls("lastName")} id="lastName" name="lastName"
                    type="text" placeholder="Ben Salem" value={form.lastName} onChange={change} />
                </Field>
              </div>
            )}

            {/* email */}
            <Field label="Email" id="email" error={errors.email}>
              <input className={inputCls("email")} id="email" name="email"
                type="email" placeholder="you@example.com" value={form.email} onChange={change} />
            </Field>

            {/* password */}
            <Field label="Password" id="password" error={errors.password}>
              {/* forgot link row */}
              {mode === "login" && (
                <div className="flex justify-end -mt-1 mb-0.5">
                  <a href="/forgot-password" className="text-[12px] text-[#C9A84C] hover:text-[#E8D5A3] transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}
              <div className="relative">
                <input
                  className={inputCls("password") + " pr-11"}
                  id="password" name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password} onChange={change}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9490] hover:text-[#F5F0E8] transition-colors text-base"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>

              {/* strength bar */}
              {mode === "register" && form.password && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-0.5 flex-1 rounded-full transition-all duration-300
                          ${i <= strength ? STRENGTH_COLOR[strength] : "bg-[#243D57]"}`}
                      />
                    ))}
                  </div>
                  <span className={`text-[11px] font-medium min-w-[36px] text-right transition-colors ${STRENGTH_TEXT[strength]}`}>
                    {STRENGTH_LABEL[strength]}
                  </span>
                </div>
              )}
            </Field>

            {/* confirm password — register only */}
            {mode === "register" && (
              <Field label="Confirm password" id="confirmPassword" error={errors.confirmPassword}>
                <input
                  className={inputCls("confirmPassword") + " pr-11"}
                  id="confirmPassword" name="confirmPassword"
                  type={showPwd ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={change}
                />
              </Field>
            )}

            {/* CTA */}
            <button
              type="submit"
              className="w-full h-12 mt-1 rounded-md bg-[#C9A84C] text-[#0D1B2A] text-[15px] font-medium
                         tracking-wide hover:bg-[#E8D5A3] active:scale-[0.98] transition-all duration-150"
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </button>

            {/* divider */}
            <div className="flex items-center gap-2.5 my-5 text-[12px] text-[#9A9490]">
              <div className="flex-1 h-px bg-white/[0.08]" />
              or continue with
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  label: "Google",
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ),
                },
                {
                  label: "GitHub",
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  className="h-11 flex items-center justify-center gap-2 rounded-md text-[13px] text-[#F5F0E8]
                             border border-[#C9A84C]/35 hover:border-[#C9A84C] hover:bg-[#C9A84C]/[0.06]
                             transition-all duration-150"
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {/* switch mode */}
            <p className="text-center text-[13px] text-[#9A9490] mt-5">
              {mode === "login" ? (
                <>Don't have an account?{" "}
                  <button type="button" onClick={() => switchMode("register")}
                    className="text-[#C9A84C] hover:text-[#E8D5A3] underline underline-offset-2 transition-colors">
                    Register
                  </button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button type="button" onClick={() => switchMode("login")}
                    className="text-[#C9A84C] hover:text-[#E8D5A3] underline underline-offset-2 transition-colors">
                    Sign in
                  </button>
                </>
              )}
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}