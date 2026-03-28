import { useState, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Play, User, LogOut, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n, languageFlags, type Language } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const { t, language, setLanguage } = useI18n();
  const { user, signOut } = useAuth();

  const navLinks = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.browse"), to: "/browse" },
    { label: t("nav.rankings"), to: "/rankings" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // 🔥 FUNGSI SEARCH YANG BERFUNGSI
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Ani<span className="text-primary">Flow</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-x-2 -bottom-[17px] h-[2px] bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* 🔥 SEARCH FORM - PAKAI FORM BIAR ENTER BISA SEARCH */}
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="relative"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-1.5 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t("common.search")}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-4 w-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* 🔥 TOMBOL SEARCH - SEKARANG BUKA SEARCH FORM */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="text-sm">{languageFlags[language]}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-border bg-card p-1 shadow-lg"
                >
                  {(["en", "id", "ja", "ko"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors ${
                        language === lang
                          ? "bg-primary/15 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <span>{languageFlags[lang]}</span>
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User */}
          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                to="/profile"
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:block"
            >
              {t("nav.login")}
            </Link>
          )}

          <button
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary">
                    {t("nav.profile")}
                  </Link>
                  <Link to="/watchlist" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary">
                    {t("nav.watchlist")}
                  </Link>
                  <Link to="/history" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary">
                    {t("nav.history")}
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-secondary"
                  >
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}