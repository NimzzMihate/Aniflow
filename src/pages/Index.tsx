import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AnimeRow from "@/components/AnimeRow";
import { getTopRanked, getMostPopular, getAiring } from "@/data/animeData";
import { useI18n } from "@/lib/i18n";

export default function Index() {
  const { t } = useI18n();

  return (
    <Layout>
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimeRow title={t("home.trending")} anime={getAiring()} linkTo="/browse" />
        <AnimeRow title={t("home.topRanked")} anime={getTopRanked().slice(0, 5)} linkTo="/rankings" showRank />
        <AnimeRow title={t("home.popular")} anime={getMostPopular().slice(0, 5)} linkTo="/browse" />
      </div>
    </Layout>
  );
}
