import { sql } from "@vercel/postgres";

export async function createUser({
  email,
  firstName,
  lastName,
  password,
}: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) {
  try {
    const { rows } = await sql`
      INSERT INTO users (email, first_name, last_name, password)
      VALUES (${email}, ${firstName}, ${lastName}, ${password})
      RETURNING id, email, first_name, last_name, created_at;
    `;
    return rows[0];
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function findUserByEmail(email: string) {
  const { rows } = await sql`
    SELECT * FROM users WHERE email = ${email};
  `;
  return rows[0] || null;
}