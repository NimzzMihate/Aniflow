import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Anime } from "@/data/animeData";
import { getAnimeTitle } from "@/data/animeData";
import { useI18n } from "@/lib/i18n";

interface Props {
  anime: Anime;
  index?: number;
  showRank?: boolean;
}

export default function AnimeCard({ anime, index = 0, showRank = false }: Props) {
  const { language, t } = useI18n();
  const title = getAnimeTitle(anime, language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/anime/${anime.id}`} className="group block">
        <div className="card-glow relative overflow-hidden rounded-xl bg-card">
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={anime.cover}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-background/80 px-2 py-1 backdrop-blur-sm">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs font-semibold text-foreground">{anime.rating}</span>
            </div>

            <div className="absolute left-2 top-2">
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  anime.status === "Airing"
                    ? "bg-primary/90 text-primary-foreground"
                    : anime.status === "Upcoming"
                    ? "bg-accent/90 text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {anime.status}
              </span>
            </div>

            {showRank && (
              <div className="absolute bottom-2 left-2">
                <span className="font-display text-4xl font-black text-foreground/80 text-glow">
                  #{anime.rank}
                </span>
              </div>
            )}
          </div>

          <div className="p-3">
            <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {anime.genres.slice(0, 2).join(" • ")} • {anime.episodes} {t("common.eps")}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
