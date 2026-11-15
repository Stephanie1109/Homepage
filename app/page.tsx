
"use client";

import TechStackBanner from "./TechStackBanner";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const destinations = [
  {
    number: "01",
    name: "THE ORIGINS",
    subtitle: "Remember the legends",
    description:
      "From legendary trickshots to world championships. Discover the moments that started it all.",
    icon: "📜",
    href: "#origins",
  },
  {
    number: "02",
    name: "THE ARENA",
    subtitle: "Prove your skills",
    description:
      "Enter the battlefield, take on challenges, and establish your own legacy.",
    icon: "⚔️",
    href: "/arena",
  },
  {
    number: "03",
    name: "HALL OF LEGENDS",
    subtitle: "Earn your place",
    description:
      "Challenge the leaderboard and compete against players from around the world.",
    icon: "🏛️",
    href: "/ranks",
  },
  {
    number: "04",
    name: "THE VAULT",
    subtitle: "Claim your treasures",
    description:
      "Explore FaZe merchandise and discover future opportunities to earn rewards.",
    icon: "🗝️",
    href: "/vault",
  },
  {
    number: "05",
    name: "THE AGORA",
    subtitle: "Find your crew",
    description:
      "Share FaZe memories, discuss the Arena, and connect with fellow fans on your journey.",
    icon: "💬",
    href: "/community",
  },
];

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");

  // NEW: Remember returning player
  useEffect(() => {
    const savedName = localStorage.getItem("fazePlayer");

    if (savedName) {
      setName(savedName);
    }
  }, []);

  function startJourney() {
    if (!name.trim()) return;

    localStorage.setItem("fazePlayer", name.trim());
    router.push("/arena");
  }

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

          <Link href="/profile" className="odyssey-nav-link">
            MY VOYAGE
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="odyssey-ocean relative flex min-h-[650px] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">

        {/* Decorative symbols */}
        <div className="pointer-events-none absolute left-8 top-12 text-5xl text-[#b39158] opacity-50">
          ✧
        </div>

        <div className="pointer-events-none absolute bottom-12 right-8 text-6xl text-[#b39158] opacity-30">
          ⚓
        </div>

        <p className="mb-6 text-sm font-bold tracking-[0.35em] text-[#e4c68d]">
          AN EPIC JOURNEY BEGINS
        </p>

        <h1 className="odyssey-title text-5xl md:text-8xl">
          THE FAZE
          <span className="block text-[#e31837]">
            ODYSSEY
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-xl italic text-[#e4c68d] md:text-2xl">
          The old legends made history. Your turn.
        </p>

        <p className="mt-6 max-w-xl text-zinc-300">
          Rediscover the legacy. Conquer new challenges.
          Chart your own course through the world of FaZe.
        </p>

        {/* Player Input */}
        <input
          className="odyssey-input mt-10 w-full max-w-sm"
          placeholder="Enter your gamer tag"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") startJourney();
          }}
          maxLength={24}
        />

        <button
          onClick={startJourney}
          disabled={!name.trim()}
          className="odyssey-button mt-5"
        >
          BEGIN YOUR VOYAGE →
        </button>

        <a
          href="#voyage"
          className="mt-12 text-xs font-bold tracking-[0.25em] text-[#e4c68d] hover:text-white"
        >
          EXPLORE THE JOURNEY ↓
        </a>
      </section>

      {/* GOLD DIVIDER */}
      <div className="odyssey-divider" />

      {/* VOYAGE MAP */}
      <section
        id="voyage"
        className="scroll-mt-24 mx-auto max-w-6xl px-6 py-24"
      >
        <div className="text-center">
          <p className="font-bold tracking-[0.3em] text-[#b39158]">
            YOUR JOURNEY AWAITS
          </p>

          <h2 className="odyssey-title mt-4 text-4xl md:text-6xl">
            CHART YOUR COURSE.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-zinc-300">
            Every destination holds a new challenge.
            Choose where your story begins.
          </p>
        </div>

        {/* Interactive Destinations */}
        <div className="relative mx-auto mt-16 max-w-3xl">

          {/* Dotted voyage route */}
          <div
            className="absolute bottom-12 left-7 top-12 hidden border-l-2 border-dashed border-[#b39158]/50 md:block"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {destinations.map((item) => (
              <Link
                key={item.number}
                href={item.href}
                className="odyssey-card relative z-10 flex flex-col gap-5 p-6 md:flex-row md:items-center"
              >

                {/* Milestone */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#b39158] bg-[#081827] text-2xl font-black text-[#e4c68d]">
                  {item.number}
                </div>

                {/* Destination content */}
                <div className="flex-1">
                  <p className="text-xs font-bold tracking-widest text-[#b39158]">
                    {item.subtitle.toUpperCase()}
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-[#f2e9d5]">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-5xl">
                    {item.icon}
                  </span>

                  <span className="text-2xl text-[#e4c68d]">
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ORIGINS SECTION */}
      <section
        id="origins"
        className="scroll-mt-24 border-y border-[#b39158]/30 bg-[#07131f]/80 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <p className="font-bold tracking-[0.3em] text-[#b39158]">
            CHAPTER I — THE ORIGINS
          </p>

          <h2 className="odyssey-title mt-5 text-4xl md:text-6xl">
            EVERY LEGEND
            <span className="block text-[#e31837]">
              HAS AN ORIGIN.
            </span>
          </h2>

          <p className="mt-6 max-w-3xl leading-relaxed text-zinc-300">
            FaZe Clan began in 2010 with a passion
            for gaming, creativity, and trickshot
            culture. Over the years, its legacy has
            expanded across competitive esports,
            entertainment, and a global fan community.
          </p>

          <p className="mt-5 max-w-3xl leading-relaxed text-zinc-300">
            The FaZe Odyssey brings longtime fans
            back to the moments that defined the
            culture, while inviting a new generation
            to create the next chapter.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* THE TRICKSHOT ERA */}
            <a
              href="https://fazeclan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="odyssey-card block p-7 transition hover:-translate-y-1"
            >
              <p className="text-4xl">🎯</p>

              <h3 className="mt-5 text-xl font-bold">
                THE TRICKSHOT ERA
              </h3>

              <p className="mt-3 text-sm text-zinc-300">
                Explore the gaming culture that helped
                launch FaZe Clan.
              </p>

              <p className="mt-6 text-sm font-bold text-[#e4c68d]">
                EXPLORE FAZE HISTORY ↗
              </p>
            </a>

            {/* WORLD CHAMPIONS */}
            <a
              href="https://fazeclan.com/pages/esports"
              target="_blank"
              rel="noopener noreferrer"
              className="odyssey-card block p-7 transition hover:-translate-y-1"
            >
              <p className="text-4xl">🏆</p>

              <h3 className="mt-5 text-xl font-bold">
                WORLD CHAMPIONS
              </h3>

              <p className="mt-3 text-sm text-zinc-300">
                Discover FaZe's competitive history
                and major esports achievements.
              </p>

              <p className="mt-6 text-sm font-bold text-[#e4c68d]">
                EXPLORE ESPORTS ↗
              </p>
            </a>

            {/* THE NEXT CHAPTER */}
            <Link
              href="/arena"
              className="odyssey-card block p-7 transition hover:-translate-y-1"
            >
              <p className="text-4xl">🌊</p>

              <h3 className="mt-5 text-xl font-bold">
                THE NEXT CHAPTER
              </h3>

              <p className="mt-3 text-sm text-zinc-300">
                The next generation joins the journey
                through challenges and competition.
              </p>

              <p className="mt-6 text-sm font-bold text-[#e4c68d]">
                ENTER THE ARENA →
              </p>
            </Link>

          </div>

          <Link
            href="/arena"
            className="odyssey-button mt-10"
          >
            CONTINUE TO THE ARENA →
          </Link>

        </div>
      </section>

      {/* TECHNOLOGY STACK BANNER */}
      <TechStackBanner />

      {/* FOOTER */}
      <footer className="px-6 py-10 text-center">

        <p className="font-black tracking-widest text-[#e4c68d]">
          THE FAZE ODYSSEY
        </p>

        <p className="mt-3 text-sm italic text-zinc-400">
          The old legends made history. Your turn.
        </p>

        <p className="mt-6 text-xs text-zinc-500">
          HackUTA 2026 · Project FAZE ODYSSEY
        </p>
      </footer>

    </main>
  );
}
