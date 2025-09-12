import cron from "node-cron";
import mongoose from "mongoose";
import { User } from "./models/user.js";
import { fetchNewsForUser } from "./utils/newsAPI.js";
import { sendNewsEmail as sendEmail } from "./utils/emailSender.js";
import { generateFunnySummary } from "./utils/aiSummarizer.js"
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.log("❌ MongoDB connection error:", err));

let cachedNews = {};
let cachedFunnySummary = {};

cron.schedule("0 0 * * *", async () => {
    console.log("Scheduler running at @1");
    try {
        const currentTime = new Date();

        // Fetch users whose daily insights are enabled and due
        const users = await User.find({
            dailyInsightsEnabled: true,
            dailyInsightsTime: { $lte: currentTime }
        });

        for (const user of users) {
            try {
                // Fetch news for this user
                const newsItems = await fetchNewsForUser(user) || [];
                cachedNews[user._id] = Array.isArray(newsItems) ? newsItems : [];
                // Generate funny summary
                const funnySummary = await generateFunnySummary(newsItems);
                cachedFunnySummary[user._id] = funnySummary;
                console.log(cachedFunnySummary[user._id],"- cachedFunnySummary")
                console.log(`✅ News + summary refreshed for ${user.email}`);
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            } catch (userErr) {
                console.error(`❌ Error fetching/summarizing for ${user.email}:`, userErr);
            }
        }
    } catch (err) {
        console.error("❌ Failed to refresh news:", err);
    }
});

cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        console.log(`🕒 Scheduler running at ${currentTime}`);

        // Start of today for checking duplicates
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Fetch users who are enabled and haven't received email today
        const users = await User.find({
            dailyInsightsEnabled: true,
            $or: [
                { lastInsightsSent: { $lt: startOfToday } },
                { lastInsightsSent: { $exists: false } }
            ]
        });

        // Filter users whose dailyInsightsTime matches current hour/minute
        const usersToSend = users.filter(user => {
            const [hour, minute] = user.dailyInsightsTime.split(":").map(Number);
            return hour === currentHour && minute === currentMinute;
        });

        for (const user of usersToSend) {
            try {
                let newsToSend;

                if (cachedFunnySummary && cachedFunnySummary[user._id]) {
                    newsToSend = cachedFunnySummary[user._id];
                } else if (cachedNews && cachedNews[user._id]?.length) {
                    newsToSend = cachedNews[user._id].slice(0, 5);
                } else {
                    console.log(`⚠️ No news available for ${user.email}, skipping email.`);
                    continue;
                }

                await sendEmail(user.email, newsToSend);
                console.log(`📧 Email sent to ${user.email} at ${currentTime}`);

                // Update lastInsightsSent to prevent duplicates
                user.lastInsightsSent = now;
                await user.save();

            } catch (err) {
                console.error(`❌ Failed for ${user.email}:`, err);
            }
        }

    } catch (err) {
        console.error("❌ Error in scheduler:", err);
    }
});
