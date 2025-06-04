import { connectToDatabase } from "@/backend/database/connection";
import Post from "@/backend/models/postModel";
import { verifyToken } from "@/backend/utils/jwt";

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return new Response(JSON.stringify({ message: "Post ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const decoded = verifyToken(token);

    const post = await Post.findById(postId);

    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (post.createdBy.toString() !== decoded.userId) {
      return new Response(
        JSON.stringify({ message: "Unauthorized: You aren't authorized to do this action" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    await Post.findByIdAndDelete(postId);

    return new Response(JSON.stringify({ message: "Post DELETED successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE /posts error:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
