import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, ArrowLeft, List } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { getAnimeById, getAnimeTitle } from "@/data/animeData";
import { useI18n } from "@/lib/i18n";

// ==================== VIDEO MAPPING ====================
// Video sample gratis dari Google (legal untuk demo)
const episodeVideos: Record<string, Record<number, string>> = {
  "one-punch-man-s3": {
    1: "https://files.catbox.moe/12ivfz.mp4",
  },
  "pokemon-2024": {
    1: "https://files.catbox.moe/ofanex.mp4",
  },
  "jujutsu-kaisen": {
    1: "https://files.catbox.moe/owasn8.mp4",
  },
  "majo-no-tabitabi": {
    1: "https://files.catbox.moe/tkd3wm.mp4",
  },
  "kimi-no-nawa": {
    1: "https://files.catbox.moe/6thq2n.mp4",
  },
};

// Judul episode (untuk tampilan)
const episodeTitles: Record<string, Record<number, string>> = {
  "one-punch-man-s3": {
    1: "The Strongest Hero Returns",
  },
  "pokemon-2024": {
    1: "The New Beginning! Liko and Sprigatito",
  },
  "jujutsu-kaisen": {
    1: "Ryomen Sukuna",
  },
  "majo-no-tabitabi": {
    1: "The Witch, Elaina",
  },
  "kimi-no-nawa": {
    1: "The Threads of Fate",
  },
};

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const epParam = parseInt(searchParams.get("ep") || "1");
  const anime = getAnimeById(id || "");
  const { t, language } = useI18n();

  // Video refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [currentEp, setCurrentEp] = useState(epParam);

  if (!anime) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center pt-16">
          <p className="text-muted-foreground">Anime not found</p>
        </div>
      </Layout>
    );
  }

  // Ambil video URL berdasarkan anime id dan episode
  const videoUrl = episodeVideos[anime.id]?.[currentEp] || "";
  const getEpisodeTitle = (ep: number) => {
    return episodeTitles[anime.id]?.[ep] || `${t("watch.episode")} ${ep}`;
  };

  const totalEps = Math.min(anime.episodes, 24);
  const episodes = Array.from({ length: totalEps }, (_, i) => i + 1);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Update current time dari video
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Set duration saat video loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle video end
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Progress bar click
  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
    setIsMuted(false);
  };

  // Mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume / 100;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  // Update volume saat volume state berubah
  useEffect(() => {
    if (videoRef.current && !isMuted) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume, isMuted]);

  // Reset playing state saat ganti episode
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentEp]);

  return (
    <div className="min-h-screen bg-background">
      {/* Video Player Area */}
      <div className="relative w-full bg-black" style={{ aspectRatio: "16/9", maxHeight: "70vh" }}>
        {/* HTML5 Video Player */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 h-full w-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="mb-3 h-1 w-full cursor-pointer rounded-full bg-white/20 transition-all hover:h-2"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Prev Episode */}
              <button
                onClick={() => currentEp > 1 && setCurrentEp(currentEp - 1)}
                disabled={currentEp <= 1}
                className="text-white/80 transition-colors hover:text-white disabled:opacity-30"
              >
                <SkipBack className="h-5 w-5" />
              </button>

              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-white transition-colors hover:text-primary">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </button>

              {/* Next Episode */}
              <button
                onClick={() => currentEp < totalEps && setCurrentEp(currentEp + 1)}
                disabled={currentEp >= totalEps}
                className="text-white/80 transition-colors hover:text-white disabled:opacity-30"
              >
                <SkipForward className="h-5 w-5" />
              </button>

              {/* Time */}
              <span className="text-xs text-white/70">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-white/80 transition-colors hover:text-white">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="hidden w-20 accent-primary sm:block"
                />
              </div>

              {/* Episode list toggle */}
              <button
                onClick={() => setShowEpisodes(!showEpisodes)}
                className="text-white/80 transition-colors hover:text-white"
              >
                <List className="h-5 w-5" />
              </button>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="text-white/80 transition-colors hover:text-white">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info section below player */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to={`/anime/${anime.id}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {t("detail.back")}
          </Link>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main info */}
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {getAnimeTitle(anime, language)}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {getEpisodeTitle(currentEp)} • {t("watch.episode")} {currentEp} / {anime.episodes}
            </p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => currentEp > 1 && setCurrentEp(currentEp - 1)}
                disabled={currentEp <= 1}
                className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-30"
              >
                <SkipBack className="h-4 w-4" />
                {t("watch.prevEp")}
              </button>
              <button
                onClick={() => currentEp < totalEps && setCurrentEp(currentEp + 1)}
                disabled={currentEp >= totalEps}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-30"
              >
                {t("watch.nextEp")}
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Episode sidebar */}
          <motion.div
            initial={false}
            animate={{ width: showEpisodes ? "auto" : 0, opacity: showEpisodes ? 1 : 0 }}
            className="hidden overflow-hidden lg:block"
          >
            <div className="w-72 rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 font-display text-sm font-bold text-foreground">
                {t("watch.episodeList")}
              </h3>
              <div className="max-h-[400px] space-y-1 overflow-y-auto scrollbar-hide">
                {episodes.map((ep) => (
                  <button
                    key={ep}
                    onClick={() => setCurrentEp(ep)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      currentEp === ep
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-xs font-bold">
                      {ep}
                    </span>
                    <span className="truncate">{getEpisodeTitle(ep)}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile episode list */}
        {showEpisodes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mt-6 overflow-hidden rounded-xl border border-border bg-card p-4 lg:hidden"
          >
            <h3 className="mb-3 font-display text-sm font-bold text-foreground">
              {t("watch.episodeList")}
            </h3>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {episodes.map((ep) => (
                <button
                  key={ep}
                  onClick={() => {
                    setCurrentEp(ep);
                    setShowEpisodes(false);
                  }}
                  className={`rounded-lg py-2 text-xs font-bold transition-colors ${
                    currentEp === ep
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {ep}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}