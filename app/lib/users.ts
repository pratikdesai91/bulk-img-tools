// app/lib/users.ts
interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const users: User[] = [];