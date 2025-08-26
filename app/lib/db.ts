import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Neon connection string
});

// ✅ Create a new user
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
  const query = `
    INSERT INTO users (email, first_name, last_name, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, first_name, last_name, created_at;
  `;
  const values = [email, firstName, lastName, password];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// ✅ Find a user by email
export async function findUserByEmail(email: string) {
  const query = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

// ✅ Update a user's password (for forgot password / reset)
export async function updateUserPassword(email: string, hashedPassword: string) {
  const query = `
    UPDATE users
    SET password = $1
    WHERE email = $2
    RETURNING id, email, first_name, last_name, updated_at;
  `;
  const { rows } = await pool.query(query, [hashedPassword, email]);
  return rows[0];
}