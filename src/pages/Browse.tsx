import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import AnimeCard from "@/components/AnimeCard";
import { animeList, genres, getAnimeTitle } from "@/data/animeData";
import { useI18n } from "@/lib/i18n";

export default function Browse() {
  const { t, language } = useI18n();
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("rating");

  const filtered = useMemo(() => {
    let result = [...animeList];
    if (selectedGenre !== "All") result = result.filter((a) => a.genres.includes(selectedGenre));
    if (selectedStatus !== "All") result = result.filter((a) => a.status === selectedStatus);
    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popularity") return a.popularity - b.popularity;
      if (sortBy === "newest") return b.year - a.year;
      return getAnimeTitle(a, language).localeCompare(getAnimeTitle(b, language));
    });
    return result;
  }, [selectedGenre, selectedStatus, sortBy, language]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-black text-foreground sm:text-4xl">
            {t("browse.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("browse.subtitle")}</p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            {[t("browse.allGenres"), ...genres.slice(0, 10)].map((genre, i) => {
              const genreValue = i === 0 ? "All" : genres[i - 1];
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genreValue)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedGenre === genreValue
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">{t("browse.allStatus")}</option>
            <option value="Airing">{t("browse.airing")}</option>
            <option value="Completed">{t("browse.completed")}</option>
            <option value="Upcoming">{t("browse.upcoming")}</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="rating">{t("browse.sortRating")}</option>
            <option value="popularity">{t("browse.sortPopularity")}</option>
            <option value="newest">{t("browse.sortNewest")}</option>
            <option value="title">{t("browse.sortTitle")}</option>
          </select>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((anime, i) => (
            <AnimeCard key={anime.id} anime={anime} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">
            {t("browse.noResults")}
          </div>
        )}
      </div>
    </Layout>
  );
}
