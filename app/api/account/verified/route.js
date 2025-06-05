import { connectToDatabase } from "@/backend/database/connection";
import User from "@/backend/models/userModel";
import schemas from "@/backend/validation/userValidation";
import runValidation from "@/backend/validation/joivalidation";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, verificationCode } = body;
    
        // Validate input
        const validationErrorResponse = runValidation(schemas.verifyAccountSchema, body);
        if (validationErrorResponse) return validationErrorResponse;
    
        await connectToDatabase();
    
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
        return new Response(JSON.stringify({ message: "Email does not exist" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
        }
    
        // Verify the verification code
        const isMatch = await bcrypt.compare(verificationCode, user.AccountVerificationCode);
        if (!isMatch) {
        return new Response(JSON.stringify({ message: "Invalid verification code" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
        }
    
        // Check if the verification code has expired
        if (Date.now() - user.AccountVerificationCodeExpires > 2 * 60 * 1000) {
        return new Response(JSON.stringify({ message: "Verification code has expired" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
        }
    
        // Mark the account as verified
        user.AccountVerified = true;
        user.AccountVerificationCode = null;
        user.AccountVerificationCodeExpires = null;
        await user.save();
    
        return new Response(JSON.stringify({ message: "Account verified successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
        });
    
    } catch (error) {
        console.error("Error in POST /api/verified:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }
    }