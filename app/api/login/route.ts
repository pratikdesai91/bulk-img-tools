import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/app/lib/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Compare hashed password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Login successful
  return NextResponse.json({
    success: true,
    user: { email: user.email, firstName: user.first_name, lastName: user.last_name },
  });
  // app/api/login/route.ts
return NextResponse.json({
  success: true,
  user: { email: user.email, firstName: user.first_name, lastName: user.last_name },
});

}