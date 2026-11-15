"use client";

// THE ARENA: launches the Odyssey game with the player's gamertag, and saves the score to the Hall of Legends as they
// play and when they leave. How the two talk is in lib/odyssey.ts.

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { GAME_ORIGIN, gameLink, isOdysseyScore } from "@/lib/odyssey";

type Player = { playerName: string; score: number };
type Phase = "ready" | "playing" | "left" | "refused";

// the gamer tag the home page saved (null while the page is drawn on the server)
const onStorage = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const readTag = () => (localStorage.getItem("fazePlayer") || "").trim();

// this gamer tag's best score and place on the Hall of Legends (null: not on it yet, or the board didn't answer)
async function bestOf(name: string): Promise<{ best: number | null; rank: number | null } | null> {
  try {
    const response = await fetch("/api/leaderboard", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.success) return null;
    const players: Player[] = data.players;
    const i = players.findIndex((p) => p.playerName === name);
    return { best: i >= 0 ? players[i].score : null, rank: i >= 0 ? i + 1 : null };
  } catch {
    return null;
  }
}

export default function ArenaPage() {
  const tag = useSyncExternalStore(onStorage, readTag, () => null);
  const player = tag || "";
  const [phase, setPhase] = useState<Phase>("ready");
  const status = tag === null ? "loading" : tag === "" ? "noTag" : phase;
  const [score, setScore] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [boardTick, setBoardTick] = useState(0); // (a new score saved, or the game closed: read the board again)
  const game = useRef<Window | null>(null);
  const saved = useRef(-1); // the highest score this page has saved
  const saving = useRef<Promise<void>>(Promise.resolve());

  // one save at a time, highest score only (the board keeps the best anyway)
  const save = useCallback(
    (name: string, value: number) => {
      saving.current = saving.current.then(async () => {
        if (value <= saved.current) return;
        try {
          const response = await fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerName: name, score: value }),
            keepalive: true,
          });
          const data = await response.json();
          if (!response.ok || !data.success) throw new Error("not saved");
          saved.current = value;
          setMessage("");
          setBoardTick((n) => n + 1);
        } catch {
          setMessage("Couldn't save your score just now. It will try again on your next points.");
        }
      });
    },
    [],
  );

  useEffect(() => {
    if (!player) return;
    let live = true;
    bestOf(player).then((b) => {
      if (!live || !b) return;
      setBest(b.best);
      setRank(b.rank);
    });
    return () => {
      live = false;
    };
  }, [player, boardTick]);

  // the game tab tells us the score (only messages from the game's own address count)
  useEffect(() => {
    if (!player) return;
    function onMessage(e: MessageEvent) {
      if (!GAME_ORIGIN || e.origin !== GAME_ORIGIN || !isOdysseyScore(e.data)) return;
      const m = e.data;
      if (!m.site) {
        // a test voyage, or the game's content rules didn't take the gamertag
        if (m.player !== player) setPhase("refused");
        return;
      }
      if (m.player !== player) return;
      setScore(m.score);
      setPhase(m.final ? "left" : "playing");
      save(player, m.score);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [player, save]);

  // the game tab was closed
  useEffect(() => {
    if (status !== "playing") return;
    const t = window.setInterval(() => {
      if (game.current && game.current.closed) {
        game.current = null;
        setPhase("left");
        setBoardTick((n) => n + 1);
      }
    }, 1000);
    return () => window.clearInterval(t);
  }, [status]);

  function launch() {
    const url = gameLink(player, window.location.origin);
    const w = window.open(url, "odyssey");
    if (!w) {
      // a pop-up blocker: play in this tab instead (Leave in the game comes back to the Hall of Legends)
      window.location.href = url;
      return;
    }
    game.current = w;
    setMessage("");
    setPhase("playing");
  }

  return (
    <main className="min-h-screen bg-transparent text-[#f2e9d5]">

      {/* Navigation */}
      <nav className="odyssey-nav flex flex-wrap items-center justify-between gap-5 px-6 py-5 md:px-12">
        <Link href="/" className="text-xl font-black tracking-wider text-[#f2e9d5]">
          THE <span className="text-red-500">FAZE</span> ODYSSEY
        </Link>

        <div className="flex flex-wrap gap-5 text-xs font-bold tracking-widest md:text-sm">
          <Link href="/" className="odyssey-nav-link">HOME</Link>
          <Link href="/arena" className="font-bold text-[#e4c68d]">ARENA</Link>
          <Link href="/ranks" className="odyssey-nav-link">LEGENDS</Link>
          <Link href="/vault" className="odyssey-nav-link">VAULT</Link>
          <Link href="/community" className="odyssey-nav-link">THE AGORA</Link>
          <Link href="/profile" className="odyssey-nav-link">MY VOYAGE</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16">

        <p className="font-bold tracking-[0.3em] text-[#b39158]">CHAPTER II — THE ARENA</p>

        <h1 className="odyssey-title mt-5 text-5xl md:text-6xl">
          PROVE YOUR
          <span className="block text-[#e31837]">SKILLS.</span>
        </h1>

        <p className="mt-5 text-lg italic text-[#e4c68d]">
          Seven islands. Three crewmates. One way home.
        </p>

        <p className="mt-4 text-zinc-300">
          Sail the ship, forge what each island needs, and win the Phaeacian games with your own hands.
          Every point you earn goes to the Hall of Legends.
        </p>

        <div className="odyssey-divider mt-10" />

        {status === "loading" && (
          <div className="mt-12 text-center text-[#e4c68d]">Loading the arena...</div>
        )}

        {status === "noTag" && (
          <div className="odyssey-card mt-12 p-8 text-center">
            <p className="text-5xl">🧭</p>
            <h2 className="odyssey-title mt-5 text-3xl">NAME YOUR CAPTAIN.</h2>
            <p className="mt-4 text-zinc-300">Enter your gamer tag on the home page to set sail.</p>
            <Link href="/" className="odyssey-button mt-8">ENTER YOUR GAMER TAG →</Link>
          </div>
        )}

        {status !== "loading" && status !== "noTag" && (
          <div className="mt-12 space-y-8">

            <div className="odyssey-card p-8">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#b39158] bg-[#142f42] text-4xl">
                  ⛵
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold tracking-[0.25em] text-[#b39158]">CAPTAIN</p>
                  <h2 className="mt-2 break-all text-3xl font-black md:text-4xl">{player}</h2>
                  <Link href="/" className="mt-2 inline-block text-sm text-[#e4c68d] underline">
                    Not you? Change gamer tag
                  </Link>
                </div>
                <button onClick={launch} className="odyssey-button">
                  {status === "playing" ? "BACK TO THE GAME →" : status === "left" ? "SAIL AGAIN →" : "SET SAIL →"}
                </button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="odyssey-card p-7 text-center">
                <p className="text-sm tracking-widest text-[#b39158]">THIS VOYAGE</p>
                <p className="mt-5 text-4xl font-black text-[#e4c68d]">
                  {score !== null ? score.toLocaleString() : "—"}
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  {status === "playing" ? "Live from the game" : status === "left" ? "Saved when you left" : "Points so far"}
                </p>
              </div>
              <div className="odyssey-card p-7 text-center">
                <p className="text-sm tracking-widest text-[#b39158]">PERSONAL BEST</p>
                <p className="mt-5 text-4xl font-black text-[#e4c68d]">
                  {best !== null ? best.toLocaleString() : "—"}
                </p>
                <p className="mt-2 text-sm text-zinc-300">On the Hall of Legends</p>
              </div>
              <div className="odyssey-card p-7 text-center">
                <p className="text-sm tracking-widest text-[#b39158]">GLOBAL RANK</p>
                <p className="mt-5 text-4xl font-black text-[#e4c68d]">{rank !== null ? `#${rank}` : "—"}</p>
                <p className="mt-2 text-sm text-zinc-300">Top 50</p>
              </div>
            </div>

            {status === "refused" && (
              <p className="odyssey-card p-5 text-center text-[#e4c68d]">
                The game can&apos;t use that gamer tag, so this voyage won&apos;t be ranked. Pick another on the home page.
              </p>
            )}

            {message && <p className="text-center text-sm text-[#e4c68d]">{message}</p>}

            <div className="odyssey-card p-8">
              <p className="font-bold tracking-[0.25em] text-[#b39158]">HOW IT WORKS</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-300">
                <li>The game opens in a new tab under your gamer tag. Keep this tab open to see your score live.</li>
                <li>Your score is saved as you earn points, and again when you press Leave or close the game.</li>
                <li>Only your best voyage counts on the Hall of Legends.</li>
                <li>Use Chrome on a computer. The hand-gesture games need the RealSense camera running on the same computer.</li>
              </ul>
              <Link href="/ranks" className="mt-6 inline-block font-bold text-[#e4c68d] underline">
                See the Hall of Legends →
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
