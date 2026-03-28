import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import AnimeCard from "@/components/AnimeCard";
import { animeList, genres, getAnimeTitle } from "@/data/animeData";
import { useI18n } from "@/lib/i18n";

export default function Browse() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { t, language } = useI18n();
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("rating");

  const filtered = useMemo(() => {
    let result = [...animeList];
    
    // 🔥 FILTER SEARCH (BARU)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((anime) => 
        getAnimeTitle(anime, language).toLowerCase().includes(query)
      );
    }
    
    // Filter genre
    if (selectedGenre !== "All") {
      result = result.filter((a) => a.genres.includes(selectedGenre));
    }
    
    // Filter status
    if (selectedStatus !== "All") {
      result = result.filter((a) => a.status === selectedStatus);
    }
    
    // Sorting
    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popularity") return a.popularity - b.popularity;
      if (sortBy === "newest") return b.year - a.year;
      return getAnimeTitle(a, language).localeCompare(getAnimeTitle(b, language));
    });
    
    return result;
  }, [selectedGenre, selectedStatus, sortBy, language, searchQuery]);

  // 🔥 TAMPILKAN SEMUA GENRE (15 genre)
  const allGenres = [t("browse.allGenres"), ...genres];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-black text-foreground sm:text-4xl">
            {t("browse.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {searchQuery 
              ? `${t("browse.searchResults")} "${searchQuery}"` 
              : t("browse.subtitle")}
          </p>
        </motion.div>

        {/* 🔥 GENRE FILTER - SCROLL HORIZONTAL (SEMUA GENRE) */}
        <div className="mt-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            {allGenres.map((genre, i) => {
              const genreValue = i === 0 ? "All" : genres[i - 1];
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genreValue)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
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

        {/* Filter dan Sort */}
        <div className="mt-4 flex flex-wrap gap-3">
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

        {/* 🔥 HASIL PENCARIAN */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">{t("browse.noResults")}</p>
              {searchQuery && (
                <button
                  onClick={() => window.location.href = "/browse"}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  {t("browse.clearSearch")}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* 🔥 INFO JUMLAH HASIL */}
        {filtered.length > 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("browse.showing")} {filtered.length} {t("browse.results")}
          </p>
        )}
      </div>
    </Layout>
  );
}