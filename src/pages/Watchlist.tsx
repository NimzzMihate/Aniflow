import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Layout from "@/components/Layout";
import AnimeCard from "@/components/AnimeCard";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { getAnimeById } from "@/data/animeData";

export default function Watchlist() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchWatchlist = async () => {
      const { data } = await supabase
        .from("watchlist")
        .select("anime_id")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });
      setWatchlistIds(data?.map((d) => d.anime_id) || []);
      setLoading(false);
    };
    fetchWatchlist();
  }, [user]);

  const removeFromWatchlist = async (animeId: string) => {
    if (!user) return;
    await supabase.from("watchlist").delete().eq("user_id", user.id).eq("anime_id", animeId);
    setWatchlistIds((prev) => prev.filter((id) => id !== animeId));
  };

  const animeItems = watchlistIds.map((id) => getAnimeById(id)).filter(Boolean);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-black text-foreground">{t("watchlist.title")}</h1>
        </motion.div>

        {loading ? (
          <p className="mt-8 text-muted-foreground">{t("common.loading")}</p>
        ) : animeItems.length === 0 ? (
          <p className="mt-8 text-muted-foreground">{t("watchlist.empty")}</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {animeItems.map((anime, i) => (
              <div key={anime!.id} className="relative group">
                <AnimeCard anime={anime!} index={i} />
                <button
                  onClick={() => removeFromWatchlist(anime!.id)}
                  className="absolute right-2 top-2 z-10 rounded-lg bg-destructive p-1.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
