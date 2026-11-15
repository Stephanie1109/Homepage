
import Link from "next/link";

// ==========================================
// THE FAZE ODYSSEY
// Treasure Vault - Version 3.0
// ==========================================

// Official merchandise store
const SHOP_URL = "https://fazeproshop.com/";

// Merchandise collections
const collections = [
  {
    name: "THE WARRIOR'S ARMOR",
    category: "01 / ESPORTS GEAR",
    description:
      "Explore official FaZe jerseys and team apparel.",
    icon: "⚔️",
    href: "https://fazeproshop.com/collections/jerseys",
  },
  {
    name: "THE LEGEND'S WARDROBE",
    category: "02 / LIFESTYLE",
    description:
      "Discover FaZe hoodies and sweatshirts.",
    icon: "👕",
    href: "https://fazeproshop.com/collections/sweatshirts",
  },
  {
    name: "THE TREASURE CHEST",
    category: "03 / ALL MERCH",
    description:
      "Explore the complete FaZe merchandise collection.",
    icon: "🗝️",
    href: "https://fazeproshop.com/collections/all",
  },
];

export default function VaultPage() {
  return (
    <main className="min-h-screen bg-transparent text-[#f2e9d5]">

      {/* ======================================
          NAVIGATION
      ====================================== */}
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

          <Link href="/vault" className="font-bold text-[#e4c68d]">
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

      {/* ======================================
          HERO SECTION
      ====================================== */}
      <section className="relative overflow-hidden border-b border-[#b39158]/30 bg-[#07131f]/50 px-6 pb-20 pt-24">

        {/* Decorative Gold Symbols */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-12 text-6xl text-[#b39158]/30"
        >
          ✧
        </div>

        <div className="mx-auto max-w-6xl">

          <p className="font-bold tracking-[0.3em] text-[#b39158]">
            CHAPTER IV — THE TREASURE VAULT
          </p>

          <h1 className="odyssey-title mt-6 text-5xl md:text-7xl">
            REP YOUR
            <span className="block text-[#e31837]">
              LEGACY.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg italic text-[#e4c68d]">
            Every voyage has its treasures.
          </p>

          <p className="mt-4 max-w-2xl leading-relaxed text-zinc-300">
            Discover the gear behind the FaZe legacy.
            Explore official merchandise and represent
            your favorite team beyond the arena.
          </p>

          <a
            href={SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="odyssey-button mt-8"
          >
            VISIT OFFICIAL STORE ↗
          </a>
        </div>
      </section>

      {/* ======================================
          MERCHANDISE COLLECTIONS
      ====================================== */}
      <section className="mx-auto max-w-6xl px-6 py-20">

        <div className="mb-10">

          <p className="font-bold tracking-[0.3em] text-[#b39158]">
            TREASURES OF THE VOYAGE
          </p>

          <h2 className="odyssey-title mt-4 text-4xl md:text-5xl">
            EXPLORE THE COLLECTIONS.
          </h2>

          <p className="mt-5 max-w-2xl text-zinc-300">
            Every legend has a signature style.
            Find the gear that represents yours.
          </p>

        </div>

        {/* Collection Cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {collections.map((item) => (
            <div
              key={item.name}
              className="odyssey-card overflow-hidden"
            >

              {/* Category Illustration */}
              <div className="relative flex h-52 items-center justify-center border-b border-[#b39158]/30 bg-gradient-to-br from-[#193a4b] via-[#102637] to-[#060f19]">

                <span className="text-7xl">
                  {item.icon}
                </span>

                <span className="absolute right-4 top-4 text-xl text-[#b39158]/60">
                  ✧
                </span>
              </div>

              {/* Collection Information */}
              <div className="p-7">

                <p className="text-xs font-bold tracking-[0.2em] text-[#b39158]">
                  {item.category}
                </p>

                <h3 className="mt-3 text-2xl font-black text-[#f2e9d5]">
                  {item.name}
                </h3>

                <p className="mt-4 min-h-16 text-sm leading-relaxed text-zinc-300">
                  {item.description}
                </p>

                {/* Functional External Link */}
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block border-b border-[#b39158] pb-1 font-bold text-[#e4c68d] transition hover:text-white"
                >
                  EXPLORE COLLECTION ↗
                </a>

              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-400">
          Merchandise selections and availability are
          managed by the external official store.
        </p>
      </section>

      {/* ======================================
          LEGACY REWARDS CONCEPT
      ====================================== */}
      <section className="border-y border-[#b39158]/30 bg-[#07131f]/70 px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <p className="font-bold tracking-[0.3em] text-[#b39158]">
            THE LEGACY REWARDS
          </p>

          <h2 className="odyssey-title mt-5 text-4xl md:text-5xl">
            YOUR SKILLS.
            <span className="block text-[#e31837]">
              YOUR REWARDS.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl leading-relaxed text-zinc-300">
            Your journey doesn't end after one challenge.
            Return to the Arena, improve your performance,
            and build your legacy in the Hall of Legends.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Play */}
            <div className="odyssey-card p-7">
              <p className="text-4xl">⚔️</p>

              <h3 className="mt-5 text-xl font-black">
                I. PLAY
              </h3>

              <p className="mt-3 text-sm text-zinc-300">
                Complete interactive challenges and
                develop your gaming skills.
              </p>
            </div>

            {/* Compete */}
            <div className="odyssey-card p-7">
              <p className="text-4xl">🏆</p>

              <h3 className="mt-5 text-xl font-black">
                II. COMPETE
              </h3>

              <p className="mt-3 text-sm text-zinc-300">
                Challenge other players and rise
                through the global leaderboard.
              </p>
            </div>

            {/* Unlock */}
            <div className="odyssey-card p-7">
              <p className="text-4xl">🗝️</p>

              <h3 className="mt-5 text-xl font-black">
                III. UNLOCK
              </h3>

              <p className="mt-3 text-sm text-zinc-300">
                Future rewards could include
                exclusive merchandise drops,
                digital collectibles, and early access.
              </p>
            </div>

          </div>

          <p className="mt-8 text-xs text-zinc-400">
            Rewards and exclusive merchandise access
            are proposed future features, not currently
            available through this prototype.
          </p>

          <Link href="/ranks" className="odyssey-button mt-8">
            ENTER THE HALL OF LEGENDS →
          </Link>

        </div>
      </section>

      {/* ======================================
          MONETIZATION CONCEPT
      ====================================== */}
      <section className="mx-auto max-w-6xl px-6 py-20">

        <p className="font-bold tracking-[0.3em] text-[#b39158]">
          BEYOND THE ARENA
        </p>

        <h2 className="odyssey-title mt-4 text-3xl md:text-4xl">
          PLAY. CONNECT. REPRESENT.
        </h2>

        <p className="mt-6 max-w-3xl leading-relaxed text-zinc-300">
          The FaZe Odyssey connects competitive
          fan engagement with merchandise discovery.
          A future partnership could introduce
          sponsored challenges, exclusive drops,
          and reward-based shopping experiences.
        </p>

        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="odyssey-button mt-8"
        >
          EXPLORE FAZE MERCH ↗
        </a>

      </section>

      {/* ======================================
          FOOTER
      ====================================== */}
      <footer className="border-t border-[#b39158]/30 px-6 py-10 text-center">

        <p className="font-black tracking-widest text-[#e4c68d]">
          THE FAZE ODYSSEY
        </p>

        <p className="mt-3 text-sm italic text-zinc-400">
          The old legends made history. Your turn.
        </p>

        <p className="mt-6 text-xs text-zinc-500">
          HackUTA 2026 · Independent hackathon prototype.
          Not an official FaZe Clan storefront.
          Purchases are handled by the external store.
        </p>

      </footer>

    </main>
  );
}
