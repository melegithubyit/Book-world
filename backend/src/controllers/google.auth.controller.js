import User from '../models/User.js';
import { verifyGoogleToken } from '../services/googleAuth.service.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser.emailVerified) {
      return res.status(400).json({ message: 'Google email not verified' });
    }

    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        user.googleId = googleUser.googleId;
        user.avatar = googleUser.avatar;
        await user.save();
      }
    } else {
      user = await User.create({
        fullName: googleUser.fullName,
        email: googleUser.email,
        avatar: googleUser.avatar,
        googleId: googleUser.googleId,
        authProvider: 'google',
      });
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      accessToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        preferencesCompleted:
          user.preferences &&
          (user.preferences.authors.length > 0 || user.preferences.genres.length > 0),
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(401).json({ message: 'Google Authentication failed' });
  }
};
