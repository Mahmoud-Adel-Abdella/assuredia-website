import { Router } from "express";
import { db, users, clients } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_me";

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  clientName: z.string().min(1),
  baseUrl: z.string().url().optional(),
  telegramUsername: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error });
    return;
  }

  const { email, password, clientName, baseUrl, telegramUsername } = parsed.data;

  try {
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create client
    const [newClient] = await db
      .insert(clients)
      .values({
        clientName,
        baseUrl: baseUrl || null,
        telegramUsername: telegramUsername || null,
        isActive: true,
      })
      .returning();

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash: hashedPassword,
        clientId: newClient.id,
        role: "admin",
      })
      .returning();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, clientId: newClient.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
      client: { id: newClient.id, name: newClient.clientName, baseUrl: newClient.baseUrl },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const userRows = await db.select().from(users).where(eq(users.email, email));
    if (userRows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const user = userRows[0];
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Get client info
    const clientRows = await db.select().from(clients).where(eq(clients.id, user.clientId));
    const client = clientRows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, clientId: user.clientId, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
      client: { id: client.id, name: client.clientName, baseUrl: client.baseUrl },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;