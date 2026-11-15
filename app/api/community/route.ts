
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ==========================================
// THE FAZE ODYSSEY
// Agora API — Posts, Replies, and Likes
// ==========================================

const categories = [
  "The Legacy",
  "The Arena",
  "The Crew",
] as const;

type Reply = {
  playerName: string;
  content: string;
  createdAt: Date;
};

type CommunityPost = {
  playerName: string;
  category: string;
  content: string;
  createdAt: Date;
  replies?: Reply[];
  likes?: number;
  likedBy?: string[];
};

async function getCollection() {
  const client = await clientPromise;

  const db = client.db(
    process.env.MONGODB_DB || "faze_odyssey"
  );

  return db.collection<CommunityPost>("community");
}

// ==========================================
// GET — LOAD POSTS AND REPLIES
// ==========================================

export async function GET() {
  try {
    const collection = await getCollection();

    const posts = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();

    return Response.json(
      {
        success: true,
        posts: posts.map((post) => ({
          id: post._id.toString(),
          playerName: post.playerName,
          category: post.category,
          content: post.content,
          createdAt: post.createdAt,
          replies: post.replies || [],
          likes: post.likes || 0,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Community GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load posts",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// POST — CREATE COMMUNITY POST
// ==========================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const playerName =
      typeof body.playerName === "string"
        ? body.playerName.trim()
        : "";

    const category = body.category;

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (
      !playerName ||
      playerName.length > 24 ||
      !categories.some((item) => item === category) ||
      !content ||
      content.length > 500
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid post",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection();

    await collection.insertOne({
      playerName,
      category,
      content,
      createdAt: new Date(),
      replies: [],
      likes: 0,
      likedBy: [],
    });

    return Response.json({
      success: true,
      message: "Post published!",
    });
  } catch (error) {
    console.error("Community POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to publish post",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// PATCH — REPLY OR LIKE
// ==========================================

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { postId, action } = body;

    if (
      typeof postId !== "string" ||
      !ObjectId.isValid(postId)
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid post ID",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection();
    const _id = new ObjectId(postId);

    // --------------------------------------
    // REPLY TO A POST
    // --------------------------------------

    if (action === "reply") {
      const playerName =
        typeof body.playerName === "string"
          ? body.playerName.trim()
          : "";

      const content =
        typeof body.content === "string"
          ? body.content.trim()
          : "";

      if (
        !playerName ||
        playerName.length > 24 ||
        !content ||
        content.length > 300
      ) {
        return Response.json(
          {
            success: false,
            message: "Invalid reply",
          },
          { status: 400 }
        );
      }

      const reply: Reply = {
        playerName,
        content,
        createdAt: new Date(),
      };

      const result = await collection.updateOne(
        { _id },
        {
          $push: {
            replies: reply,
          },
        }
      );

      if (result.matchedCount === 0) {
        return Response.json(
          {
            success: false,
            message: "Post not found",
          },
          { status: 404 }
        );
      }

      return Response.json({
        success: true,
        message: "Reply published!",
      });
    }

    // --------------------------------------
    // LIKE A POST
    // --------------------------------------

    if (action === "like") {
      const visitorId = body.visitorId;

      // Browser-generated anonymous visitor ID

    if (
      typeof visitorId !== "string" ||
      visitorId.length < 10 ||
      visitorId.length > 100
    ) {

        return Response.json(
          {
            success: false,
            message: "Invalid visitor ID",
          },
          { status: 400 }
        );
      }

      // Increment only if this visitor
      // has not liked this post before.
      const result = await collection.updateOne(
        {
          _id,
          likedBy: { $ne: visitorId },
        },
        {
          $addToSet: {
            likedBy: visitorId,
          },
          $inc: {
            likes: 1,
          },
        }
      );

      if (result.modifiedCount === 0) {
        return Response.json(
          {
            success: false,
            message: "Already liked or post not found",
          },
          { status: 409 }
        );
      }

      return Response.json({
        success: true,
        message: "Post liked!",
      });
    }

    return Response.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Community PATCH error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to update post",
      },
      { status: 500 }
    );
  }
}
