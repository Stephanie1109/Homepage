
import clientPromise from "@/lib/mongodb";


export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "faze_odyssey"
    );

    await db.command({ ping: 1 });
    
    console.log("✅ Connected to MongoDB Atlas!");

    return Response.json({
      success: true,
      message: "Connected to MongoDB Atlas!",
      database: db.databaseName,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return Response.json(
      {
        success: false,
        message: "MongoDB connection failed",
      },
      { status: 500 }
    );
  }
}
