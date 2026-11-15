// The Odyssey game (the 3D voyage: github.com/binoygeorge97/odyssey).
//
// The Arena opens the game with the player's gamertag:
//   <game>/game.html?player=<gamertag>&site=<this site's address>
// The game sails under that tag. While it runs it tells this site the score (window.postMessage, only to this site's
// address), as it changes and when the player leaves; the Arena saves it with POST /api/leaderboard, which keeps each
// gamertag's best score ($max). The game's server can also send the score here itself (ODYSSEY_SITE on its side).
//
// Set NEXT_PUBLIC_ODYSSEY_URL to the game page if it moves (in .env.local, or in Vercel's settings).

export const GAME_URL =
  process.env.NEXT_PUBLIC_ODYSSEY_URL ||
  "https://desktop-7ir94h6.tail81150a.ts.net/game.html";

export const GAME_ORIGIN = (() => {
  try {
    return new URL(GAME_URL).origin;
  } catch {
    return "";
  }
})();

// what the game says (web/game.html, siteTell)
export type OdysseyScore = {
  type: "odyssey:score";
  player: string; // the gamertag the voyage sails under ("Sailor" if the game's content rules refused it)
  score: number; // the voyage's points so far
  run: number; // the voyage's number on the game's server
  over: boolean; // reached Ithaca
  site: boolean; // false: not for the board (a test voyage, or a refused gamertag)
  final: boolean; // the player left (or closed the tab)
  crewHome: number | null; // at the end: how many of the crew got home
};

export function isOdysseyScore(d: unknown): d is OdysseyScore {
  if (!d || typeof d !== "object") return false;
  const m = d as Record<string, unknown>;
  return (
    m.type === "odyssey:score" &&
    typeof m.player === "string" &&
    typeof m.score === "number" &&
    Number.isSafeInteger(m.score) &&
    m.score >= 0 &&
    m.score <= 1000000 &&
    typeof m.site === "boolean"
  );
}

// the link that opens the game for this gamertag
export function gameLink(player: string, siteOrigin: string): string {
  const u = new URL(GAME_URL);
  u.searchParams.set("player", player.trim().slice(0, 24));
  u.searchParams.set("site", siteOrigin);
  return u.toString();
}
