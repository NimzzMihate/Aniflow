import { Play, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const heroImage = "https://files.catbox.moe/ktl9nj.jpg";
import { animeList, getAnimeTitle, getAnimeSynopsis } from "@/data/animeData";
import { useI18n } from "@/lib/i18n";

export default function HeroSection() {
  const featured = animeList[0];
  const { language, t } = useI18n();
  const title = getAnimeTitle(featured, language);
  const synopsis = getAnimeSynopsis(featured, language);

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      <img
        src={heroImage}
        alt="Featured anime"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

      <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              {t("hero.featured")}
            </span>
            <span className="text-sm text-muted-foreground">#{featured.rank} {t("hero.ranked")}</span>
          </div>
          <h1 className="font-display text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-secondary-foreground/80 sm:text-base">
            {synopsis}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{featured.genres.join(", ")}</span>
            <span>•</span>
            <span>{featured.episodes} {t("hero.episodes")}</span>
            <span>•</span>
            <span>⭐ {featured.rating}</span>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              to={`/watch/${featured.id}?ep=1`}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-glow)]"
            >
              <Play className="h-4 w-4 fill-current" /> {t("hero.watchNow")}
            </Link>
            <Link
              to={`/anime/${featured.id}`}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
            >
              <Info className="h-4 w-4" /> {t("hero.details")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
