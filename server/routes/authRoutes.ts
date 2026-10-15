import { Router } from 'express';
import { randomBytes } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { db, isDuplicateKeyError, IUser } from '../db.js';
import { hashPassword, comparePassword, generateToken, authMiddleware, AuthRequest } from '../auth.js';

export const authRouter = Router();
const googleAuthClient = new OAuth2Client();

function setAuthCookie(res: import('express').Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function formatAuthUser(user: IUser | null) {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    touristCategory: user.touristCategory,
    role: user.role,
    createdAt: user.createdAt
  };
}

// GET /api/auth/google/config
authRouter.get('/google/config', (_req, res) => {
  return res.json({ clientId: process.env.GOOGLE_CLIENT_ID || null });
});

// POST /api/auth/google
authRouter.post('/google', async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const credential = typeof req.body?.credential === 'string' ? req.body.credential : '';
    if (!clientId) return res.status(503).json({ error: 'Google sign-in is not configured for this deployment.' });
    if (!credential) return res.status(400).json({ error: 'Google credential is required.' });

    const ticket = await googleAuthClient.verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      return res.status(401).json({ error: 'Google did not provide a verified email for this account.' });
    }

    const email = payload.email.trim().toLowerCase();
    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser({
        name: payload.name?.trim() || email.split('@')[0],
        email,
        password: hashPassword(randomBytes(32).toString('hex')),
        touristCategory: 'Solo Traveler',
        role: 'user'
      });
    }

    const token = generateToken(user);
    setAuthCookie(res, token);
    return res.json({ message: 'Google sign-in successful', token, user: formatAuthUser(user) });
  } catch (err) {
    console.warn('Google sign-in verification failed:', err);
    return res.status(401).json({ error: 'Google sign-in could not be verified. Please try again.' });
  }
});

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, touristCategory } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = hashPassword(password);
    const newUser = await db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      touristCategory: touristCategory || 'Solo Traveler',
      role: 'user'
    });

    const token = generateToken(newUser);

    setAuthCookie(res, token);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        touristCategory: newUser.touristCategory,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (err: any) {
    if (isDuplicateKeyError(err)) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    setAuthCookie(res, token);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        touristCategory: user.touristCategory,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
authRouter.get('/me', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user!;
  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      touristCategory: user.touristCategory,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// PUT /api/auth/profile
authRouter.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const { name, touristCategory } = req.body;

    const updated = await db.updateUser(user._id, {
      name: name ? name.trim() : user.name,
      touristCategory: touristCategory || user.touristCategory
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        touristCategory: updated.touristCategory,
        role: updated.role,
        createdAt: updated.createdAt
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Profile update failed' });
  }
});
