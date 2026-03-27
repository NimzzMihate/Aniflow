import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, TrendingUp, Trophy, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { getTopRanked, getMostPopular, animeList, getAnimeTitle } from "@/data/animeData";
import type { Anime } from "@/data/animeData";
import { useI18n } from "@/lib/i18n";

type Tab = "top" | "popular" | "airing";

export default function Rankings() {
  const [activeTab, setActiveTab] = useState<Tab>("top");
  const { t, language } = useI18n();

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "top", label: t("rankings.topRated"), icon: <Trophy className="h-4 w-4" /> },
    { key: "popular", label: t("rankings.mostPopular"), icon: <Heart className="h-4 w-4" /> },
    { key: "airing", label: t("rankings.topAiring"), icon: <TrendingUp className="h-4 w-4" /> },
  ];

  const getList = (): Anime[] => {
    if (activeTab === "top") return getTopRanked();
    if (activeTab === "popular") return getMostPopular();
    return animeList.filter((a) => a.status === "Airing").sort((a, b) => b.rating - a.rating);
  };

  const list = getList();

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-black text-foreground sm:text-4xl">
            {t("rankings.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("rankings.subtitle")}</p>
        </motion.div>

        <div className="mt-8 flex gap-2 rounded-xl bg-secondary p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {list.map((anime, i) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/anime/${anime.id}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:bg-card/80 sm:p-4"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center sm:h-12 sm:w-12">
                  <span
                    className={`font-display text-2xl font-black sm:text-3xl ${
                      i === 0
                        ? "text-primary text-glow"
                        : i === 1
                        ? "text-accent"
                        : i === 2
                        ? "text-orange-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                </div>

                <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-14">
                  <img
                    src={anime.cover}
                    alt={getAnimeTitle(anime, language)}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base">
                    {getAnimeTitle(anime, language)}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {anime.studio} • {anime.type} • {anime.episodes} {t("common.eps")}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {anime.genres.slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-shrink-0 flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-display text-lg font-bold text-foreground">
                      {anime.rating}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {(anime.members / 1000000).toFixed(1)}M {t("rankings.members")}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
