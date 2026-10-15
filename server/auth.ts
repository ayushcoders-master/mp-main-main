
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db, IUser } from './db.js';

// JWT secret configuration
const DEV_FALLBACK_SECRET = 'dev-only-insecure-secret-change-me';
let warnedAboutSecret = false;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (secret && secret.length >= 32) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'A JWT_SECRET of at least 32 characters must be configured in production.'
    );
  }

  if (secret) {
    throw new Error(
      'JWT_SECRET must contain at least 32 characters.'
    );
  }

  if (!warnedAboutSecret) {
    console.warn(
      'WARNING: JWT_SECRET is not configured. Using an insecure development secret.'
    );
    warnedAboutSecret = true;
  }

  return DEV_FALLBACK_SECRET;
}

export function assertAuthConfig(): void {
  getJwtSecret();
}

export interface AuthRequest extends Request {
  user?: IUser;
}

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

// Password hashing
export function hashPassword(plainText: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainText, salt);
}

export function comparePassword(
  plainText: string,
  hashed: string
): boolean {
  return bcrypt.compareSync(plainText, hashed);
}

// Generate JWT
export function generateToken(user: IUser): string {
  return jwt.sign(
    {
      id: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
}

// Verify JWT
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded === 'string' ||
      typeof decoded.id !== 'string' ||
      typeof decoded.email !== 'string' ||
      typeof decoded.role !== 'string' ||
      typeof decoded.name !== 'string'
    ) {
      return null;
    }

    return decoded as TokenPayload;
  } catch {
    return null;
  }
}

// Authentication middleware
export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  let token = '';

  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(
      /(?:^|;\s*)token=([^;]+)/
    );

    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  if (!token) {
    res.status(401).json({
      error: 'Authentication token required'
    });
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({
      error: 'Invalid or expired token'
    });
    return;
  }

  try {
    const user = await db.getUserById(decoded.id);

    if (!user) {
      res.status(401).json({
        error: 'User account no longer exists'
      });
      return;
    }

    // Always use the current database role, not the JWT role.
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
}

// Optional authentication middleware
export async function optionalAuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const decoded = verifyToken(token);

      if (decoded) {
        const user = await db.getUserById(decoded.id);

        if (user) {
          req.user = user;
        }
      }
    }
  } catch (err) {
    console.warn('Optional authentication lookup failed:', err);
  }

  next();
}

// Admin authorization middleware
export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      error: 'Administrator privileges required'
    });
    return;
  }

  next();
}

