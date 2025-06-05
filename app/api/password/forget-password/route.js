import { connectToDatabase } from "@/backend/database/connection";
import User from "@/backend/models/userModel";
import transport from "@/backend/utils/mailer";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "Email does not exist" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if(user.AccountVerified === false) {
      return new Response(JSON.stringify({ message: "Only Verified user can change password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate a random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);

    user.verificationCode = hashedCode;
    user.verificationCodeExpires = Date.now();
    await user.save();

    async function sendMail(to, subject, text) {
      const mailOptions = {
        from: process.env.DEV_MAIL,
        to,
        subject,
        text,
      };
      await transport.sendMail(mailOptions);
    }

    await sendMail(user.email, "Verification Code", `Your verification code is: ${code}`);

    return new Response(JSON.stringify({ message: "Verification code sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in POST /api/forget-password:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
