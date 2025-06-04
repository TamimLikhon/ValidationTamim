import { connectToDatabase } from "@/backend/database/connection";
import Post from "@/backend/models/postModel";
import User from "@/backend/models/userModel";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const postsPerPage = 10;
    const skip = (page - 1) * postsPerPage;

    const posts = await Post.find()
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(postsPerPage)
      .populate({
        path: "createdBy",
        select: "email", 
        model: User,     
      });

    return new Response(
      JSON.stringify({ success: true, message: "Posts fetched", data: posts }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GET /api/posts/all error:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: "Server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
