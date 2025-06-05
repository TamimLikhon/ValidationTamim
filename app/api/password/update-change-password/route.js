import { connectToDatabase } from "@/backend/database/connection";
import User from "@/backend/models/userModel";
import runValidation from "@/backend/validation/joivalidation";
import schemas from "@/backend/validation/userValidation";
import bcrypt from "bcrypt";
import { getUserFromRequest } from "@/backend/utils/getUserFromToken";
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, oldPassword, newPassword, PassChngVerificationCode } = body;

    // Validate input
    const validationErrorResponse = runValidation(
      schemas.UpdatechangePasswordSchema,
      body
    );
    if (validationErrorResponse) return validationErrorResponse;

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid Email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check old password
    const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidOldPassword) {
      return new Response(
        JSON.stringify({ message: "Incorrect old password" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isValidVerificationCode = await bcrypt.compare(PassChngVerificationCode,user.passChangeCode);
    if (!isValidVerificationCode) {
      return new Response(
        JSON.stringify({ message: "Invalid verification code" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if the verification code has expired
    if (Date.now() - user.passChangeCodeExpires > 2 * 60 * 1000) {
      return new Response(
        JSON.stringify({ message: "Verification code has expired" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash new password and update user
    user.password = await bcrypt.hash(newPassword, 10);
    user.passChangeCodeExpires = null;
    user.passChangeCode = null; 
    await user.save();

    // ✅ Get user from token
    const { error, status } = getUserFromRequest(request);
    if (error) {
      return new Response(JSON.stringify({ message: error }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password changed successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
