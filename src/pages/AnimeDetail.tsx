import { useParams, Link } from "react-router-dom";
import { Star, Calendar, Film, Users, ArrowLeft, Play, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import AnimeRow from "@/components/AnimeRow";
import { getAnimeById, getAnimeTitle, getAnimeSynopsis, animeList } from "@/data/animeData";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const anime = getAnimeById(id || "");
  const { t, language } = useI18n();
  const { user } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    if (!user || !anime) return;
    supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("anime_id", anime.id)
      .single()
      .then(({ data }) => setInWatchlist(!!data));
  }, [user, anime]);

  const toggleWatchlist = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    if (!anime) return;

    if (inWatchlist) {
      await supabase.from("watchlist").delete().eq("user_id", user.id).eq("anime_id", anime.id);
      setInWatchlist(false);
      toast.success("Removed from watchlist");
    } else {
      await supabase.from("watchlist").insert({ user_id: user.id, anime_id: anime.id });
      setInWatchlist(true);
      toast.success("Added to watchlist");
    }
  };

  if (!anime) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Anime Not Found</h1>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">
              {t("nav.home")}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const title = getAnimeTitle(anime, language);
  const synopsis = getAnimeSynopsis(anime, language);

  const related = animeList
    .filter((a) => a.id !== anime.id && a.genres.some((g) => anime.genres.includes(g)))
    .slice(0, 6);

  const episodes = Array.from({ length: Math.min(anime.episodes, 12) }, (_, i) => ({
    number: i + 1,
    title: `${t("watch.episode")} ${i + 1}`,
    duration: "24 min",
  }));

  return (
    <Layout>
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={anime.cover}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="-mt-48 relative flex flex-col gap-6 sm:flex-row sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0"
          >
            <div className="mx-auto w-48 overflow-hidden rounded-2xl shadow-2xl sm:w-56">
              <img src={anime.cover} alt={title} className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 pt-4 sm:pt-12"
          >
            <Link
              to="/"
              className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {t("detail.back")}
            </Link>
            <h1 className="font-display text-3xl font-black text-foreground sm:text-4xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-semibold text-foreground">{anime.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Film className="h-4 w-4" />
                <span>{anime.episodes} {t("common.eps")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{anime.season} {anime.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{(anime.members / 1000).toFixed(0)}K</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {anime.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {g}
                </span>
              ))}
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                  anime.status === "Airing"
                    ? "bg-primary/15 text-primary"
                    : anime.status === "Upcoming"
                    ? "bg-accent/15 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {anime.status}
              </span>
            </div>

            <div className="mt-5 flex gap-3">
              <Link
                to={`/watch/${anime.id}?ep=1`}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-glow)]"
              >
                <Play className="h-4 w-4 fill-current" /> {t("hero.watchNow")}
              </Link>
              <button
                onClick={toggleWatchlist}
                className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                {inWatchlist ? (
                  <><Check className="h-4 w-4 text-primary" /> {t("detail.removeFromList")}</>
                ) : (
                  <><Plus className="h-4 w-4" /> {t("detail.addToList")}</>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-lg font-bold text-foreground">{t("detail.synopsis")}</h2>
            <p className="mt-3 leading-relaxed text-secondary-foreground/80">{synopsis}</p>

            <h2 className="mt-10 font-display text-lg font-bold text-foreground">{t("detail.episodes")}</h2>
            <div className="mt-4 space-y-2">
              {episodes.map((ep) => (
                <Link
                  key={ep.number}
                  to={`/watch/${anime.id}?ep=${ep.number}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:bg-card/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {ep.number}
                    </div>
                    <span className="text-sm font-medium text-foreground">{ep.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{ep.duration}</span>
                    <Play className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-bold text-foreground">{t("detail.information")}</h3>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  [t("detail.type"), anime.type],
                  [t("detail.studio"), anime.studio],
                  [t("detail.status"), anime.status],
                  [t("detail.season"), `${anime.season} ${anime.year}`],
                  [t("detail.episodes"), anime.episodes.toString()],
                  [t("detail.rank"), `#${anime.rank}`],
                  [t("detail.popularity"), `#${anime.popularity}`],
                  [t("detail.members"), anime.members.toLocaleString()],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <AnimeRow title={t("detail.related")} anime={related} />
        )}
      </div>
    </Layout>
  );
}
