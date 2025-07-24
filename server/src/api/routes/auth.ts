import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

const router = Router();

// --- Mock Database & Types ---
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: 'ADMIN' | 'USER';
  teamId: string;
  bio: string;
  createdAt: number;
};

// In-memory array to simulate a user database
const users: User[] = [];

// Add default users at startup
if (users.length === 0) {
  users.push({
    id: 'user_1',
    email: 'justintang412@gmail.com',
    firstName: 'Justin',
    lastName: 'Tang',
    passwordHash: '$2b$10$5c/A4d0dvL63HqXp6JQLp.yEpQEXUfw5isswnn1f73lmeCryCpYfq', // bcrypt hash for 'password'
    role: 'ADMIN' as 'ADMIN',
    teamId: 'team_1',
    bio: 'Default admin user',
    createdAt: Date.now(),
  });
  console.log('Users at startup:', users);
}

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// --- Route Handlers ---

// 1. POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      firstName,
      lastName,
      passwordHash,
      role: 'ADMIN',
      teamId: `team_${Date.now()}`,
      bio: '',
      createdAt: Date.now(),
    };

    users.push(newUser);

    // Create session
    req.session.userId = newUser.id;

    // Return user data (without password hash)
    const { passwordHash: _, ...userResponse } = newUser;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 2. POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Create session
    req.session.userId = user.id;

    const { passwordHash: _, ...userResponse } = user;
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 3. GET /auth/me - Get current user
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = users.find((u) => u.id === req.session.userId);
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const { passwordHash: _, ...userResponse } = user;
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 4. POST /auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Error logging out' });
      return;
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

export default router; 