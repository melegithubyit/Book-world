import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const normalizedEmail = (email || "").toLowerCase().trim();

        // step 1: vaidate the input
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Full name, email and password required!" })
        }

        // step 2: check if the user already existed.
        const existingUser = await User.findOne({ email: normalizedEmail });
        if(existingUser){
            return res.status(409).json({message: "user already exists!"})
        }

        // step 3: hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // step 4: create user
        const user = await User.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword
        })

        const accessToken = signAccessToken(user._id);
        const refreshToken = signRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(201).json({
            message: "Signup successfully!",
            accessToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                preferencesCompleted: user.preferences && (user.preferences.authors.length > 0 || user.preferences.genres.length > 0),
            }
        })
    }catch (error) {
        console.error('Signup error:', error);

        if (error?.code === 11000) {
            return res.status(409).json({ message: 'user already exists!' });
        }

        if (error?.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.fromEntries(
                    Object.entries(error.errors || {}).map(([key, value]) => [key, value?.message])
                ),
            });
        }

        res.status(500).json({ message: 'Signup failed' });
    }
}


export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const normalizedEmail = (email || "").toLowerCase().trim();
        
        // step 1: validate the input
        if (!email || !password){
            return res.status(400).json({message: "email and password required!"})
        }
        // step 2: find the user
        const user = await User.findOne({ email: normalizedEmail }).select('+password')
        if (!user || !user.password){
            return res.status(401).json({message: "Invalid Credentials" })
        }

        // step 3: compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({message: "Invalid Credentials" })
        }
        // step 4: generate the token
        const accessToken = signAccessToken(user._id);
        const refreshToken = signRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({
            message: "Login successfully!",
            accessToken,
            user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            preferencesCompleted: user.preferences && (user.preferences.authors.length > 0 || user.preferences.genres.length > 0),
            }
        })
    }catch(error){
        console.error('Login error:', error);
        res.status(500).json({message: "Login failed"})
    }
} 



export const refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: 'No refresh token' });
    }

    try {
        const payload = verifyRefreshToken(token);
        const newAccessToken = signAccessToken(payload.userId);

        const user = await User.findById(payload.userId).select('fullName email avatar preferences');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            accessToken: newAccessToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                preferencesCompleted: user.preferences && (user.preferences.authors.length > 0 || user.preferences.genres.length > 0),
            }
        });

    }catch(error){
        res.status(500).json({ message: 'Could not refresh token' });
    }
}


export const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
}
