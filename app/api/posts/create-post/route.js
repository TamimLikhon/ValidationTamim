import { connectToDatabase } from "@/backend/database/connection";
import Post from "@/backend/models/postModel";
import runValidation from "@/backend/validation/joivalidation";
import schemas from "@/backend/validation/userValidation";
import { verifyToken } from "@/backend/utils/jwt";
import { getUserFromRequest } from "@/backend/utils/getUserFromToken";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { Title, Description } = body;

    const validationError = runValidation(schemas.PostSchema, body);
    if (validationError) return validationError;

    // Validate token
    const { user, error, status } = getUserFromRequest(request);
    if (error) {
      return new Response(JSON.stringify({ message: error }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newPost = new Post({
      Title,
      Description,
      createdBy: user.userId,
    });

    await newPost.save();

    return new Response(JSON.stringify({ message: "Post created", newPost  }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /create-post error:", error.message);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
