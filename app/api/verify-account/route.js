import { connectToDatabase } from "@/backend/database/connection";
import User from "@/backend/models/userModel";
import runValidation from "@/backend/validation/joivalidation";
import schemas from "@/backend/validation/userValidation";
import bcrypt from "bcrypt";
import transport from "@/backend/controllers/mailer";
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email,password } = body;

    // Validate input
    const validationErrorResponse = runValidation(schemas.verifiedAccount, body);
    if (validationErrorResponse) return validationErrorResponse;

    // Find user
    const user = await User.findOne({ email}).select("+password");
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid Email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    //check password
        const isvalid = await bcrypt.compare(password, user.password);
        if (!isvalid) {
          return new Response(JSON.stringify({ message: "Incorrect password" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

    // Generate a random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);

    user.AccountVerificationCode = hashedCode;
    user.AccountVerificationCodeExpires = Date.now();
    user.AccountVerified = false;
    await user.save();

    // Send verification code via email
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

    return new Response(JSON.stringify({ message: "Account Verificationcode sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in POST /api/verify-account:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}