import { connectToDatabase } from "@/backend/database/connection";
import User from "@/backend/models/userModel";
import bcrypt from "bcrypt";
import runValidation from "@/backend/validation/joivalidation";
import schemas from "@/backend/validation/userValidation";
import qrcode from 'qrcode';
import { authenticator } from 'otplib';

// export async function POST(req) {
//   try {
//     await connectToDatabase();
//     const body = await req.json();
//     const { email, password } = body;

//     const errorResponse = runValidation(schemas.twofacschema, body);
//     if (errorResponse) return errorResponse;

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//       return Response.json({ message: "User does not exist" }, { status: 400 });
//     }
//     if (!user.AccountVerified) {
//       return Response.json({ message: "Account not verified" }, { status: 400 });
//     }

//     const checkPassword = await bcrypt.compare(password, user.password);
//     if (!checkPassword) {
//       return Response.json({ message: "Incorrect password" }, { status: 400 });
//     }
//     if (user.twofaEnabled) {
//       return Response.json({ message: "Two-factor authentication already enabled" }, { status: 400 });
//     }

//     // ✅ Generate secret and otpauth URI
//     const secretKey = authenticator.generateSecret();
//     const otpauth = authenticator.keyuri(email, "ACME Co", secretKey);


//     return Response.json({
//       message: "Two-factor authentication setup initialized",
//       otpauth,
//       secretKey: secretKey
//     });

//   } catch (error) {
//     console.error("Error in two-factor authentication:", error);
//     return Response.json({ message: "Internal server error" }, { status: 500 });
//   }
// }



//failed to generate QR code
