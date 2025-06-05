import { connectToDatabase } from "@/backend/database/connection";
import User from "@/backend/models/userModel";
import runValidation from "@/backend/validation/joivalidation";
import schemas from "@/backend/validation/userValidation";
import bcrypt from "bcrypt";
import { generateToken } from "@/backend/utils/jwt";
export async function POST(request) {
  try {
    const body = await request.json();

    const validationErrorRespone = runValidation(schemas.registerSchema, body);
    if (validationErrorRespone) return validationErrorRespone;

    const hashpassword = await bcrypt.hash(body.password, 10);
    body.password = hashpassword;

    const { name, email, password, confpass } = body;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    //cereate jwt
const token = generateToken(
  {
    userId: newUser._id,
    email: newUser.email,
  },
  "1h"
);
    const isProduction = process.env.NODE_ENV === "production";
    const cookie = `Authorization=Bearer ${token}; Path=/; Max-Age=${3600}; HttpOnly=${isProduction}; Secure=${isProduction}`;
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "User Registered Successfully",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(JSON.stringify({ message: "Error registering user" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
