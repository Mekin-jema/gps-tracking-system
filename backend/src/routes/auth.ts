import express, { NextFunction, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import userModel, { IUser } from '../models/user.model';
// import User from '../models/User';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      role: role || 'driver'
    });
    
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ user: { id: user._id, username, email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ user: { id: user._id, username: user.username, email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});



router.get('/me', async (req, res) => {

  try {
    // @ts-ignore
    const token = req.cookies.token;
    // console.log(token);

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded) {

      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});


interface AuthRequest extends Request {
  user?: IUser;
}

// Middleware to protect routes
// const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     let token: string | undefined;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };

//       const user = await userModel.findById(decoded.id).select('-password');
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       req.user = user; // ✅ Now TypeScript knows about `user`
//       next();
//     } else {
//       return res.status(401).json({ message: 'Not authorized, no token' });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({ message: 'Not authorized' });
//   }
// };




export default router;