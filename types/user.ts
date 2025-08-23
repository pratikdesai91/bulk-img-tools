export interface User {
  fullName: string;
  email: string;
  password: string;
}
// Example: after login
localStorage.setItem(
  "loggedInUser",
  JSON.stringify({ firstName: "John", lastName: "Doe", email: "john@example.com" })
);