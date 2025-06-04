import { connectToDatabase } from "@/backend/database/connection";
import Post from "@/backend/models/postModel";
import runValidation from "@/backend/validation/joivalidation";
import schemas from "@/backend/validation/userValidation";
import { verifyToken } from "@/backend/utils/jwt";
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { Title, Description } = body;

    // Validate input without createdBy
    const validationError = runValidation(schemas.PostSchema, body);
    if (validationError) return validationError;

   const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
      return new Response(JSON.stringify({ message: "Unauthorized: No cookie" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract Bearer token from cookie
    const match = cookieHeader.match(/Authorization=Bearer\s([^;]+)/);
    const token = match?.[1];

     if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized: No token found in cookie" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Verify token
    const decoded = verifyToken(token);
    const newPost = new Post({
      Title,
      Description,
      createdBy: decoded.userId,
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
