import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_me";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    clientId: number;
    role: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    res.status(401).json({ error: "Invalid token format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      clientId: decoded.clientId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}