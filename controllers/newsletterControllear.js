import { User } from '../models/user.js';

export const saveNewsletter = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const data = req.body;

    const user = await User.findById(userID).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.password = data.password || user.password;
    user.timeZone = data.timeZone || user.timeZone;
    user.dailyInsightsTime = data.dailyInsightsTime || user.dailyInsightsTime;
    user.countries = [
      ...new Set([...(user.countries || []), ...(data.countries || [])]),
    ];
    user.categories = [
      ...new Set([...(user.categories || []), ...(data.categories || [])]),
    ];
    user.lastInsightsSent = data.lastInsightsSent || user.lastInsightsSent;
    user.dailyInsightsEnabled =
      data.dailyInsightsEnabled || user.dailyInsightsEnabled;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
