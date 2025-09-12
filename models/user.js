import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    timeZone: String,
    dailyInsightsTime: {
        type: String,
        default: "06:00",
    },
    countries: [String],
    categories: [String],
    lastInsightsSent: Date,
    dailyInsightsEnabled: Boolean,
})

export const User = mongoose.model("User", userSchema);