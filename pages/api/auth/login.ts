// pages/api/login.js

import bcrypt from "bcryptjs";
import { db } from "@/db";
import { signToken } from "@/lib/jwt";
import { encrypt, login } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set the token in an HTTP-only cookie
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
      path: "/",
    });

    // If credentials are valid, return user
    return res
      .status(200)
      .json({ id: user.id, email: user.email, username: user.username });
  } else {
    return res.status(500).json({ message: "Invalid HTTP METHOD" });
  }
}
