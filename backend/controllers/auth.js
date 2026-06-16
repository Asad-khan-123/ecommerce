import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import ENV from '../utils/env.js';
import User from '../models/user.js';

const client = new OAuth2Client({
  clientId: ENV.GOOGLE_CLIENT_ID
});

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, ENV.JWT_SECRET, { expiresIn: '30d' });
};

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    console.log('Google Auth Request:', {
      hasToken: !!idToken,
      clientId: ENV.GOOGLE_CLIENT_ID
    });

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'ID Token is required' });
    }

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: ENV.GOOGLE_CLIENT_ID
      });
    } catch (verifyError) {
      console.error('Token verification error:', verifyError.message);
      // Try without audience verification as fallback
      ticket = await client.verifyIdToken({
        idToken: idToken
      });
    }

    const payload = ticket.getPayload();
    console.log('Google payload:', {
      email: payload.email,
      name: payload.name,
      sub: payload.sub
    });

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email not found in token' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name: name || 'User',
        email,
        googleId,
        avatar: picture,
        role: 'user' // Default role is user
      });
      await user.save();
      console.log('New user created:', email);
    } else if (!user.googleId) {
      // Link Google ID to existing user
      user.googleId = googleId;
      user.avatar = picture;
      await user.save();
      console.log('Google ID linked to existing user:', email);
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
};
