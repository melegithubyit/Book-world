import User from "../models/User.js";

export const getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('preferences');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.preferences);

    }catch (error) {
        res.status(500).json({ message: 'Error fetching user preferences' });
    }
}

export const updatePreferences = async (req, res) => {
    try {
        const { genres = [], authors = [] } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId, 
            { preferences: { genres, authors } },
            { new: true }).select('preferences');

        res.status(200).json({
            message: 'Preferences updated successfully',
            preferences: user.preferences
        });

    }catch (error) {
        res.status(500).json({ message: 'Error updating user preferences' });
    }
}