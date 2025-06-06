import { connectToDatabase } from "@/backend/database/connection";
import Post from "@/backend/models/postModel";
import { getUserFromRequest } from "@/backend/utils/getUserFromToken";

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

    // ✅ Validate token
    const { user, error, status } = getUserFromRequest(request);
    if (error) {
      return new Response(JSON.stringify({ message: error }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const post = await Post.findById(postId).select("+createdBy");

    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (post.createdBy.toString() !== user.userId) {
      return new Response(
        JSON.stringify({
          message: "Unauthorized: You aren't authorized to do this action",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    await Post.findByIdAndDelete(postId);

    return new Response(
      JSON.stringify({ message: "Post DELETED successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("DELETE /posts error:", error.message);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
