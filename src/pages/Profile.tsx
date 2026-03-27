import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Edit2, Save, X, Globe } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/lib/auth";
import { useI18n, languageNames, languageFlags, type Language } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null; created_at: string } | null>(null);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, created_at")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
      }

      const { count: wCount } = await supabase
        .from("watchlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setWatchlistCount(wCount || 0);

      const { count: hCount } = await supabase
        .from("watch_history")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setHistoryCount(hCount || 0);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", user.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated!");
      setProfile((prev) => prev ? { ...prev, display_name: displayName } : prev);
      setEditing(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center pt-16">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-black text-foreground">{t("profile.title")}</h1>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={handleSave} className="rounded-lg bg-primary p-1.5 text-primary-foreground">
                      <Save className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditing(false)} className="rounded-lg bg-secondary p-1.5 text-muted-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">
                      {profile?.display_name || user?.email}
                    </h2>
                    <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-secondary p-4 text-center">
                <p className="font-display text-2xl font-bold text-primary">{historyCount}</p>
                <p className="text-xs text-muted-foreground">{t("profile.animeWatched")}</p>
              </div>
              <div className="rounded-xl bg-secondary p-4 text-center">
                <p className="font-display text-2xl font-bold text-primary">{watchlistCount}</p>
                <p className="text-xs text-muted-foreground">{t("profile.inWatchlist")}</p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{t("profile.language")}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      language === lang
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{languageFlags[lang]}</span>
                    {languageNames[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Joined */}
            {profile?.created_at && (
              <p className="mt-6 text-xs text-muted-foreground">
                {t("profile.joined")}: {new Date(profile.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
