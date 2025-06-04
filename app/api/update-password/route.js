import { connectToDatabase } from "@/backend/database/connection";
import User from "@/backend/models/userModel";
import schemas from "@/backend/validation/userValidation";
import runValidation from "@/backend/validation/joivalidation";
import bcrypt from "bcrypt";
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, verificationCode, newPassword } = body;

    const validationErrorRespone = runValidation(schemas.updatePassword, body);
    if (validationErrorRespone) return validationErrorRespone;

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const verifyVerificationCode = bcrypt.hash(user.verificationCode, 10);
    const isMatch = bcrypt.compare(verificationCode, verifyVerificationCode);
    
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Invalid Verificationcode " }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (Date.now() - user.verificationCodeExpires  > 2*60*1000) {
      return new Response(JSON.stringify({ message: "Verification code has expired" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    return new Response(JSON.stringify({ message: "Password updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in POST /api/update-password:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}