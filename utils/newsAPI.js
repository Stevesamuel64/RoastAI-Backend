import 'node-fetch';
import dotenv from "dotenv";
dotenv.config();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export const fetchNewsForUser = async (user) => {
    try {
        if (!user.dailyInsightsEnabled) return [];

        const keywords = [...user.categories, ...user.countries].join(' OR ');
        const url = `https://newsapi.org/v2/everything?q=${keywords}&apiKey=${NEWS_API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch news for ${user.email}: ${response.status}`);
            return [];
        }

        const data = await response.json();
        return data.articles || [];

    } catch (error) {
        console.error(`Error fetching news for ${user.email}:`, error.message);
        return [];
    }
};

