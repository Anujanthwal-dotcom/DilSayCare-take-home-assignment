import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // put real secret in .env
const JWT_EXPIRES_IN = "1h"; // token expiry

// Generate token
export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify token
export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}