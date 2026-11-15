
"use client";

// ==========================================
// THE FAZE ODYSSEY
// Chapter V — My Voyage
// Player Profile - Version 1.0
// ==========================================

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Player = {
  playerName: string;
  score: number;
};

function getVoyageTier(score: number) {
  if (score >= 10000) {
    return {
      title: "LEGEND",
      next: null,
      min: 10000,
      max: 10000,
      icon: "👑",
      description: "You have reached the final voyage tier.",
    };
  }

  if (score >= 5000) {
    return {
      title: "CHAMPION",
      next: "LEGEND",
      min: 5000,
      max: 10000,
      icon: "🏆",
      description: "One final challenge stands ahead.",
    };
  }

  if (score >= 2000) {
    return {
      title: "WARRIOR",
      next: "CHAMPION",
      min: 2000,
      max: 5000,
      icon: "⚔️",
      description: "Your name is rising through the ranks.",
    };
  }

  return {
    title: "EXPLORER",
    next: "WARRIOR",
    min: 0,
    max: 2000,
    icon: "🧭",
    description: "Every great voyage begins with a first step.",
  };
}

export default function ProfilePage() {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/leaderboard", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load leaderboard");
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.players)) {
        throw new Error("Invalid leaderboard response");
      }

      setPlayers(data.players);
    } catch {
      setMessage(
        "Unable to load your profile from MongoDB Atlas."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedName =
      localStorage.getItem("fazePlayer") || "";

    setPlayerName(savedName);
    setReady(true);
    loadProfile();
  }, [loadProfile]);

  const sortedPlayers = [...players].sort(
    (a, b) => b.score - a.score
  );

  const playerIndex = sortedPlayers.findIndex(
    (player) => player.playerName === playerName
  );

  const currentPlayer =
    playerIndex >= 0 ? sortedPlayers[playerIndex] : null;

  const bestScore = currentPlayer?.score ?? 0;
  const rank = playerIndex >= 0 ? playerIndex + 1 : null;

  const tier = getVoyageTier(bestScore);

  const progress =
    tier.next === null
      ? 100
      : Math.max(
          0,
          Math.min(
            100,
            ((bestScore - tier.min) /
              (tier.max - tier.min)) * 100
          )
        );

  return (
    <main className="min-h-screen bg-transparent text-[#f2e9d5]">

      {/* NAVIGATION */}
      <nav className="odyssey-nav flex flex-wrap items-center justify-between gap-5 px-6 py-5 md:px-12">

        <Link
          href="/"
          className="text-xl font-black tracking-wider text-[#f2e9d5]"
        >
          THE <span className="text-red-500">FAZE</span> ODYSSEY
        </Link>

        <div className="flex flex-wrap gap-5 text-xs font-bold tracking-widest md:text-sm">
          <Link href="/" className="odyssey-nav-link">
            HOME
          </Link>

          <Link href="/arena" className="odyssey-nav-link">
            ARENA
          </Link>

          <Link href="/ranks" className="odyssey-nav-link">
            LEGENDS
          </Link>

          <Link href="/vault" className="odyssey-nav-link">
            VAULT
          </Link>

          <Link href="/community" className="odyssey-nav-link">
            THE AGORA
          </Link>
          
          <Link
            href="/profile"
            className="font-bold text-[#e4c68d]"
          >
            MY VOYAGE
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-16">

        {/* PAGE HEADING */}
        <p className="font-bold tracking-[0.3em] text-[#b39158]">
          CHAPTER V — MY VOYAGE
        </p>

        <h1 className="odyssey-title mt-5 text-5xl md:text-7xl">
          YOUR
          <span className="block text-[#e31837]">
            LEGACY.
          </span>
        </h1>

        <p className="mt-6 text-lg italic text-[#e4c68d]">
          The old legends made history. Your turn.
        </p>

        <p className="mt-4 max-w-2xl text-zinc-300">
          Every challenge is another chapter in your story.
          Track your achievements, rise through the ranks,
          and chart your own path.
        </p>

        <div className="odyssey-divider mt-10" />

        {/* LOADING */}
        {(!ready || loading) && (
          <div className="mt-12 text-center text-[#e4c68d]">
            Loading your voyage...
          </div>
        )}

        {/* PLAYER NEEDS A GAMER TAG */}
        {ready && !loading && !playerName && (
          <div className="odyssey-card mt-12 p-8 text-center">

            <p className="text-5xl">🧭</p>

            <h2 className="odyssey-title mt-5 text-3xl">
              YOUR VOYAGE AWAITS.
            </h2>

            <p className="mt-4 text-zinc-300">
              Return home and enter your gamer tag
              to begin your journey.
            </p>

            <Link href="/" className="odyssey-button mt-8">
              BEGIN YOUR VOYAGE →
            </Link>
          </div>
        )}

        {/* PROFILE CONTENT */}
        {ready && !loading && playerName && (
          <div className="mt-12 space-y-10">

            {/* PLAYER IDENTITY */}
            <div className="odyssey-card p-8">

              <div className="flex flex-wrap items-center gap-6">

                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#b39158] bg-[#142f42] text-5xl">
                  {tier.icon}
                </div>

                <div className="flex-1">

                  <p className="text-xs font-bold tracking-[0.25em] text-[#b39158]">
                    THE CAPTAIN OF THIS VOYAGE
                  </p>

                  <h2 className="mt-3 break-all text-3xl font-black md:text-4xl">
                    {playerName}
                  </h2>

                  <p className="mt-3 text-[#e4c68d]">
                    {currentPlayer
                      ? `${tier.title} · Recorded Explorer`
                      : "Explorer · Awaiting first recorded score"}
                  </p>

                </div>

                <button
                  onClick={loadProfile}
                  className="rounded-lg border border-[#b39158] px-5 py-3 font-bold text-[#e4c68d] hover:bg-[#172b3c]"
                >
                  REFRESH PROFILE
                </button>

              </div>
            </div>

            {/* PLAYER STATISTICS */}
            <div className="grid gap-5 md:grid-cols-3">

              <div className="odyssey-card p-7 text-center">

                <p className="text-sm tracking-widest text-[#b39158]">
                  PERSONAL BEST
                </p>

                <p className="mt-5 text-4xl font-black text-[#e4c68d]">
                  {currentPlayer
                    ? bestScore.toLocaleString()
                    : "—"}
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  Highest Recorded Score
                </p>
              </div>

              <div className="odyssey-card p-7 text-center">

                <p className="text-sm tracking-widest text-[#b39158]">
                  GLOBAL RANK
                </p>

                <p className="mt-5 text-4xl font-black text-[#e4c68d]">
                  {rank !== null ? `#${rank}` : "—"}
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  Top 50 Leaderboard Position
                </p>
              </div>

              <div className="odyssey-card p-7 text-center">

                <p className="text-sm tracking-widest text-[#b39158]">
                  VOYAGE TIER
                </p>

                <p className="mt-5 text-2xl font-black text-[#e4c68d]">
                  {currentPlayer ? tier.title : "UNRANKED"}
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  Prototype Progression
                </p>
              </div>

            </div>

            {/* PROGRESSION */}
            <div className="odyssey-card p-8">

              <p className="font-bold tracking-[0.25em] text-[#b39158]">
                THE PATH OF A LEGEND
              </p>

              <h2 className="odyssey-title mt-4 text-3xl">
                YOUR PROGRESSION.
              </h2>

              <p className="mt-4 text-zinc-300">
                {currentPlayer
                  ? tier.description
                  : "Submit your first game score to begin progressing."}
              </p>

              {/* Progress Bar */}
              <div className="mt-8 h-4 overflow-hidden rounded-full border border-[#b39158]/50 bg-[#07131f]">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#b39158] to-[#e31837] transition-all duration-500"
                  style={{
                    width: `${currentPlayer ? progress : 0}%`,
                  }}
                />
              </div>

              <div className="mt-4 flex justify-between text-sm text-[#e4c68d]">
                <span>
                  {currentPlayer ? tier.title : "EXPLORER"}
                </span>

                <span>
                  {currentPlayer && !tier.next
                    ? "MAX TIER"
                    : tier.next || "WARRIOR"}
                </span>
              </div>

              <p className="mt-5 text-xs text-zinc-400">
                Demo progression is based on your highest
                recorded score, not accumulated XP.
              </p>
            </div>

            {/* CAPTAIN'S LOG */}
            <div className="odyssey-card p-8">

              <p className="font-bold tracking-[0.25em] text-[#b39158]">
                THE CAPTAIN&apos;S LOG
              </p>

              <h2 className="odyssey-title mt-4 text-3xl">
                YOUR JOURNEY CONTINUES.
              </h2>

              <div className="mt-8 grid gap-5 md:grid-cols-3">

                <Link
                  href="/arena"
                  className="rounded-lg border border-[#b39158]/40 bg-[#102637] p-6 transition hover:border-[#e4c68d]"
                >
                  <p className="text-4xl">⚔️</p>

                  <h3 className="mt-4 text-xl font-bold">
                    THE ARENA
                  </h3>

                  <p className="mt-3 text-sm text-zinc-300">
                    Enter the trials and improve your skills.
                  </p>
                </Link>

                <Link
                  href="/ranks"
                  className="rounded-lg border border-[#b39158]/40 bg-[#102637] p-6 transition hover:border-[#e4c68d]"
                >
                  <p className="text-4xl">🏛️</p>

                  <h3 className="mt-4 text-xl font-bold">
                    HALL OF LEGENDS
                  </h3>

                  <p className="mt-3 text-sm text-zinc-300">
                    Compare your performance with other players.
                  </p>
                </Link>

                <Link
                  href="/vault"
                  className="rounded-lg border border-[#b39158]/40 bg-[#102637] p-6 transition hover:border-[#e4c68d]"
                >
                  <p className="text-4xl">🗝️</p>

                  <h3 className="mt-4 text-xl font-bold">
                    THE VAULT
                  </h3>

                  <p className="mt-3 text-sm text-zinc-300">
                    Discover treasures and merchandise.
                  </p>
                </Link>

              </div>
            </div>

            {/* ALERTS */}
            {message && (
              <p role="status" className="text-center text-red-400">
                {message}
              </p>
            )}

            {!message && !currentPlayer && (
              <p className="text-center text-sm text-zinc-400">
                No score found among the top 50 records.
                Your score may not have been submitted yet,
                or you may be outside the current top 50.
              </p>
            )}

          </div>
        )}

        <p className="mt-12 text-center text-xs text-zinc-400">
          HackUTA 2026 · Independent prototype ·
          Leaderboard data powered by MongoDB Atlas
        </p>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#b39158]/30 px-6 py-10 text-center">

        <p className="font-black tracking-widest text-[#e4c68d]">
          THE FAZE ODYSSEY
        </p>

        <p className="mt-3 text-sm italic text-zinc-400">
          The old legends made history. Your turn.
        </p>

      </footer>
    </main>
  );
}
