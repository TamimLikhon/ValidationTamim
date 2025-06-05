import { connectToDatabase } from "@/backend/database/connection";
import Post from "@/backend/models/postModel";
import User from "@/backend/models/userModel";


export async function GET(request, {params}) {
  try {
    await connectToDatabase();
    const {slug}  = await params;
    const post = await Post.findOne({ slug }).populate('createdBy', 'email');

    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Post fetched", post }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
