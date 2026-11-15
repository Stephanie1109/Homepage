
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Player = {
  playerName: string;
  score: number;
};

export default function RanksPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [scoreInput, setScoreInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadLeaderboard = useCallback(async () => {
    try {
      const response = await fetch("/api/leaderboard", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Could not load leaderboard");
      }

      setPlayers(data.players);
      setMessage("");
    } catch {
      setMessage("Failed to connect to the leaderboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedName =
      localStorage.getItem("fazePlayer") || "";

    setPlayerName(savedName);
    loadLeaderboard();
  }, [loadLeaderboard]);

  async function submitScore() {
    const score = Number(scoreInput);
    const name = playerName.trim();

    if (
      !name ||
      name.length > 24 ||
      !scoreInput.trim() ||
      !Number.isSafeInteger(score) ||
      score < 0 ||
      score > 1000000
    ) {
      setMessage("Enter a valid gamer tag and score.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: name,
          score,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Submission failed");
      }

      localStorage.setItem("fazePlayer", name);

      setScoreInput("");
      await loadLeaderboard();
      setMessage("Score saved to MongoDB Atlas!");
    } catch {
      setMessage("Unable to save your score.");
    } finally {
      setSubmitting(false);
    }
  }

  const myRank = players.findIndex(
    (player) => player.playerName === playerName
  );

  return (
    <main className="min-h-screen bg-transparent text-[#f2e9d5]">

      {/* Navigation */}
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

          <Link
            href="/ranks"
            className="font-bold text-[#e4c68d]"
          >
            LEGENDS
          </Link>

          <Link href="/vault" className="odyssey-nav-link">
            VAULT
          </Link>

          <Link href="/community" className="odyssey-nav-link">
            THE AGORA
          </Link>

          <Link href="/profile" className="odyssey-nav-link">
            MY VOYAGE
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16">

        {/* Odyssey Heading */}
        <p className="font-bold tracking-[0.3em] text-[#b39158]">
          CHAPTER III — HALL OF LEGENDS
        </p>

        <h1 className="odyssey-title mt-5 text-5xl md:text-6xl">
          THE HALL OF
          <span className="block text-[#e31837]">
            LEGENDS.
          </span>
        </h1>

        <p className="mt-5 text-lg italic text-[#e4c68d]">
          The old legends made history. Your turn.
        </p>

        <p className="mt-4 text-zinc-300">
          Every victory brings you closer to immortality.
          Compete, conquer, and earn your place among the legends.
        </p>

        <p className="mt-5 text-xs uppercase tracking-wider text-[#b39158]">
          Global Rankings · Powered by MongoDB Atlas
        </p>

        <div className="odyssey-divider mt-10" />

        {/* Top 3 Players */}
        {!loading && players.length > 0 && (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {players.slice(0, 3).map((player, index) => (
              <div
                key={player.playerName}
                className="odyssey-card p-6 text-center"
              >
                <p className="text-4xl">
                  {["🥇", "🥈", "🥉"][index]}
                </p>

                <p className="mt-4 text-xl font-bold text-[#f2e9d5]">
                  {player.playerName}
                </p>

                <p className="mt-2 text-2xl font-black text-[#e4c68d]">
                  {player.score.toLocaleString()}
                </p>

                <p className="mt-2 text-xs tracking-widest text-[#b39158]">
                  POINTS
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="mt-10 overflow-hidden rounded-xl border border-[#b39158]/40 bg-[#081827]/90">

          <div className="grid grid-cols-12 bg-[#152f40] px-5 py-4 text-xs font-bold tracking-wider text-[#e4c68d]">
            <span className="col-span-2">RANK</span>
            <span className="col-span-6">PLAYER</span>
            <span className="col-span-4 text-right">
              SCORE
            </span>
          </div>

          {loading ? (
            <p className="p-8 text-center text-zinc-300">
              Loading the Hall of Legends...
            </p>
          ) : players.length === 0 ? (
            <p className="p-8 text-center text-zinc-300">
              No legends have been recorded yet.
              Be the first to claim your place!
            </p>
          ) : (
            players.map((player, index) => (
              <div
                key={player.playerName}
                className={`grid grid-cols-12 border-t border-[#b39158]/20 px-5 py-4 ${
                  player.playerName === playerName
                    ? "bg-[#643044]/40"
                    : "bg-[#0e2433]/80"
                }`}
              >
                <span className="col-span-2 font-bold text-[#e4c68d]">
                  #{index + 1}
                </span>

                <span className="col-span-6">
                  {player.playerName}

                  {player.playerName === playerName && (
                    <span className="ml-2 text-xs text-[#e31837]">
                      YOU
                    </span>
                  )}
                </span>

                <span className="col-span-4 text-right font-bold">
                  {player.score.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Current Player */}
        {myRank >= 0 && (
          <div className="mt-6 rounded-xl border border-[#b39158]/60 bg-[#172b3c]/80 p-5">

            <p className="text-sm font-bold tracking-widest text-[#b39158]">
              YOUR PERSONAL BEST
            </p>

            <p className="mt-2 text-xl font-bold text-[#f2e9d5]">
              #{myRank + 1} — {playerName}
            </p>

            <p className="mt-2 text-[#e4c68d]">
              {players[myRank].score.toLocaleString()} points
            </p>
          </div>
        )}

        {/* Demo Score Submission */}
        <div className="odyssey-card mt-12 p-6">

          <p className="text-xs font-bold tracking-[0.25em] text-[#b39158]">
            THE TRIALS
          </p>

          <h2 className="odyssey-title mt-3 text-2xl">
            TEST YOUR LEGACY.
          </h2>

          <p className="mt-3 text-sm text-zinc-300">
            Submit a demonstration score to MongoDB Atlas.
            Your Arena game will be integrated here next.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <input
              type="text"
              maxLength={24}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Gamer tag"
              className="odyssey-input"
            />

            <input
              type="number"
              min="0"
              max="1000000"
              step="1"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              placeholder="Enter score"
              className="odyssey-input"
            />

            <button
              onClick={submitScore}
              disabled={submitting}
              className="odyssey-button"
            >
              {submitting ? "SAVING..." : "SUBMIT SCORE"}
            </button>

            <button
              onClick={loadLeaderboard}
              className="rounded-lg border border-[#b39158] px-6 py-3 font-bold text-[#e4c68d] transition hover:bg-[#172b3c]"
            >
              REFRESH RANKS
            </button>
          </div>

          {message && (
            <p
              role="status"
              className="mt-4 text-sm text-[#e4c68d]"
            >
              {message}
            </p>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          HackUTA 2026 prototype · Demo scores ·
          Powered by MongoDB Atlas
        </p>

      </section>

      {/* Footer */}
      <footer className="border-t border-[#b39158]/30 px-6 py-8 text-center">
        <p className="font-bold tracking-widest text-[#e4c68d]">
          THE FAZE ODYSSEY
        </p>

        <p className="mt-3 text-sm italic text-zinc-400">
          The old legends made history. Your turn.
        </p>
      </footer>

    </main>
  );
}
