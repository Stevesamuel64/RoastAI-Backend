import nodemailer from "nodemailer";
import { formatPremiumNewsEmail } from "./emailFormatter.js";
import dotenv from "dotenv";
dotenv.config();

export async function sendNewsEmail(userEmail, newsItems) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
          from: `"Daily News RoastAI" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "✨ Your Premium Daily News Summary",
            html: formatPremiumNewsEmail(newsItems),
            text: newsItems.map((item, i) => `${i + 1}. ${item.title}\n${item.description || item.content}\n${item.url}`).join("\n\n"),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Email failed:", error);
        throw error;
    }
}