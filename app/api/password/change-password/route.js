import { connectToDatabase } from "@/backend/database/connection";
import User from "@/backend/models/userModel";
import runValidation from "@/backend/validation/joivalidation";
import schemas from "@/backend/validation/userValidation";
import bcrypt from "bcrypt";
import transport from "@/backend/utils/mailer";
import { getUserFromRequest } from "@/backend/utils/getUserFromToken";

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email} = body;

    // Validate input
    const validationErrorResponse = runValidation(schemas.changePasswordSchema, body);
    if (validationErrorResponse) return validationErrorResponse;

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid Email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Get user from token
    const { error, status } = getUserFromRequest(request);
    if (error) {
      return new Response(JSON.stringify({ message: error }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);

    user.passChangeCode = hashedCode;
    user.passChangeCodeExpires = Date.now();

    async function sendMail(to, subject, text) {
      const mailOptions = {
        from: process.env.DEV_MAIL,
        to,
        subject,
        text,
      };
      await transport.sendMail(mailOptions);
    }
    await sendMail(
      user.email,
      "Password Change Verification Code",
      `Your password change verification code is: ${code}`
    );

    await user.save();

    return new Response(
      JSON.stringify({ success: true, message: "Password change verification code sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in change password route:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}