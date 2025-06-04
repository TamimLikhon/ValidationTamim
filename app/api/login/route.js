import { connectToDatabase } from "@/backend/database/connection";
import User from "@/backend/models/userModel";
import schemas from "@/backend/validation/userValidation";
import runValidation from "@/backend/validation/joivalidation";
import bcrypt from "bcrypt";
import { generateToken } from "@/backend/utils/jwt";
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    const validationErrorRespone = runValidation(schemas.loginSchema, body);
    if (validationErrorRespone) return validationErrorRespone;

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return new Response(JSON.stringify({ message: "Email does not exist" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Compare password
    const isvalid = await bcrypt.compare(password, user.password);
    if (!isvalid) {
      return new Response(JSON.stringify({ message: "Incorrect password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create JWT token
const token = generateToken(
  {
    userId: user._id,
    email: user.email,
  },
  "1h"
);

    const isProduction = process.env.NODE_ENV === "production";
    const cookie = `Authorization=Bearer ${token}; Path=/; Max-Age=${3600}; HttpOnly=${isProduction}; Secure=${isProduction}`;

    return new Response(
      JSON.stringify({
        success: true,
        token,
        message: "User Logged in successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ message: "Invalid email or password" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
