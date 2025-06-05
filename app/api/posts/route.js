import { connectToDatabase } from "@/backend/database/connection";
import Post from "@/backend/models/postModel";
import { verifyToken } from "@/backend/utils/jwt";
import { getUserFromRequest } from "@/backend/utils/getUserFromToken";
export async function GET(request) {
  try {
    await connectToDatabase();
    // // 📦 Fetch posts for this user
    // const posts = await Post.find({ createdBy: userId });

        // ✅ Get user from token
    const { user, error, status } = getUserFromRequest(request);
    if (error) {
      return new Response(JSON.stringify({ message: error }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // const { searchParams } = new URL(request.url);
    // const postId = searchParams.get("id");

    const post = await Post.find(user.postId).populate('createdBy', 'email');
    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Posts fetched successfully", post }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /posts error:", error.message);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
