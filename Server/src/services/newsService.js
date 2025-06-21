import { NEWS_ITEMS } from "../utils/constants.js";

export const simulateNewsResponse = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomNews =
        NEWS_ITEMS[Math.floor(Math.random() * NEWS_ITEMS.length)];
      
      resolve({
        content: `📰 **Tin tức mới nhất:**\n\n${randomNews}\n\n*Đây là tin tức mẫu. Module tin tức thực tế sẽ được tích hợp sau.*`,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: "news",
        isNews: true,
      });
    }, 1500);
  });
};

export const fetchLatestNews = async () => {
  try {
    // Future: Replace with actual news API call
    const newsResponse = await simulateNewsResponse();
    return {
      success: true,
      data: newsResponse,
    };
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    return {
      success: false,
      message: "Failed to fetch news",
      error: error.message,
    };
  }
};