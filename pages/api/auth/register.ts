// pages/api/register.js

import bcrypt from "bcryptjs";
import { db } from "@/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("server register");

    const { email, password, username } = req.body;
    const existingUser = await db.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    console.log("New User");
    console.log(newUser);

    return res.status(201).json({ user: newUser });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
