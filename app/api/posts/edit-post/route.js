import { connectToDatabase } from "@/backend/database/connection";
import Post from "@/backend/models/postModel";
import schemas from "@/backend/validation/userValidation";
import runValidation from "@/backend/validation/joivalidation";
import { verifyToken } from "@/backend/utils/jwt";
import { getUserFromRequest } from "@/backend/utils/getUserFromToken";

export async function PUT(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { Title, Description } = body;

    const validationError = runValidation(schemas.PostSchema, body);
    if (validationError) return validationError;

    //validate Token
    const { user, error, status } = getUserFromRequest(request);
    if (error) {
      return new Response(JSON.stringify({ message: error }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");
    const post = await Post.findById(postId);

    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (post.createdBy.toString() !== user.userId) {
      return new Response(
        JSON.stringify({
          message: "Unauthorized: You can only edit your own posts",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    post.Title = Title;
    post.Description = Description;

    await post.save();

    return new Response(
      JSON.stringify({ message: "Post updated successfully", post }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("PUT /posts/edit error:", error.message);
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
