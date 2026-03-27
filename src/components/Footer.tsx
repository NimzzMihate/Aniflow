import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Play className="h-3.5 w-3.5 fill-primary-foreground text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              Ani<span className="text-primary">Flow</span>
            </span>
          </Link>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/browse" className="transition-colors hover:text-foreground">{t("nav.browse")}</Link>
            <Link to="/rankings" className="transition-colors hover:text-foreground">{t("nav.rankings")}</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 AniFlow. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
