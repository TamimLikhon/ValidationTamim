import { connectToDatabase } from "@/backend/database/connection";
import Post from "@/backend/models/postModel";
import { verifyToken } from "@/backend/utils/jwt";

export async function GET(request) {
  try {
    await connectToDatabase();

    // 🔒 Extract token from cookie
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return new Response(JSON.stringify({ message: "Unauthorized: No cookie" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const match = cookieHeader.match(/Authorization=Bearer\s([^;]+)/);
    const token = match?.[1];

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized: No token found in cookie" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔍 Verify token and get userId
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    // 📦 Fetch posts for this user
    const posts = await Post.find({ createdBy: userId });


    return new Response(JSON.stringify({ message: "Posts fetched successfully", posts }), {
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
