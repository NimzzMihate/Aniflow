import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Play } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { getAnimeById, getAnimeTitle } from "@/data/animeData";

interface HistoryItem {
  anime_id: string;
  episode_number: number;
  watched_at: string;
}

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("watch_history")
        .select("anime_id, episode_number, watched_at")
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false });
      setHistory((data as HistoryItem[]) || []);
      setLoading(false);
    };
    fetchHistory();
  }, [user]);

  const clearAll = async () => {
    if (!user) return;
    await supabase.from("watch_history").delete().eq("user_id", user.id);
    setHistory([]);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-black text-foreground">{t("history.title")}</h1>
            {history.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("history.clearAll")}
              </button>
            )}
          </div>
        </motion.div>

        {loading ? (
          <p className="mt-8 text-muted-foreground">{t("common.loading")}</p>
        ) : history.length === 0 ? (
          <p className="mt-8 text-muted-foreground">{t("history.empty")}</p>
        ) : (
          <div className="mt-8 space-y-3">
            {history.map((item, i) => {
              const anime = getAnimeById(item.anime_id);
              if (!anime) return null;
              return (
                <motion.div
                  key={`${item.anime_id}-${item.episode_number}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={`/watch/${anime.id}?ep=${item.episode_number}`}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30"
                  >
                    <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                      <img src={anime.cover} alt={getAnimeTitle(anime, language)} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {getAnimeTitle(anime, language)}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {t("history.episode")} {item.episode_number}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(item.watched_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Play className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
