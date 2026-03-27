import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimeCard from "./AnimeCard";
import type { Anime } from "@/data/animeData";
import { useI18n } from "@/lib/i18n";

interface Props {
  title: string;
  anime: Anime[];
  linkTo?: string;
  showRank?: boolean;
}

export default function AnimeRow({ title, anime, linkTo, showRank }: Props) {
  const { t } = useI18n();

  return (
    <section className="py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
        {linkTo && (
          <Link
            to={linkTo}
            className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t("home.viewAll")} <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {anime.map((a, i) => (
          <div key={a.id} className="w-[160px] flex-shrink-0 sm:w-[180px]">
            <AnimeCard anime={a} index={i} showRank={showRank} />
          </div>
        ))}
      </div>
    </section>
  );
}
