
import clientPromise from "@/lib/mongodb";

type LeaderboardEntry = {
  playerName: string;
  score: number;
  updatedAt: Date;
};

async function getCollection() {
  const client = await clientPromise;

  const db = client.db(
    process.env.MONGODB_DB || "faze_odyssey"
  );

  return db.collection<LeaderboardEntry>("leaderboard");
}

// GET: Retrieve top players
export async function GET() {
  try {
    const collection = await getCollection();

    const players = await collection
      .find({}, {
        projection: {
          _id: 0,
          playerName: 1,
          score: 1,
        },
      })
      .sort({ score: -1, playerName: 1 })
      .limit(50)
      .toArray();

    return Response.json(
      { success: true, players },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Leaderboard GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load leaderboard",
      },
      { status: 500 }
    );
  }
}

// POST: Submit a player's score
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const playerName =
      typeof body.playerName === "string"
        ? body.playerName.trim()
        : "";

    const score = body.score;

    if (
      !playerName ||
      playerName.length > 24 ||
      !Number.isSafeInteger(score) ||
      score < 0 ||
      score > 1000000
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid player name or score",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection();

    await collection.updateOne(
      { playerName },
      {
        $max: { score },
        $set: { updatedAt: new Date() },
      },
      { upsert: true }
    );

    return Response.json({
      success: true,
      message: "Score submitted successfully!",
    });
  } catch (error) {
    console.error("Leaderboard POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to submit score",
      },
      { status: 500 }
    );
  }
}
