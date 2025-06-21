import * as newsService from "../../services/newsService.js";

export const handleNews = async (socket, data) => {
  try {
    console.log("📰 News request received:", data);

    // Get news response
    const newsResponse = await newsService.fetchLatestNews();

    if (newsResponse.success) {
      // Send news response back to client
      socket.emit("res_res", {
        success: true,
        data: newsResponse.data,
      });

      console.log("📰 News response sent successfully");
    } else {
      throw new Error(newsResponse.message || "Failed to fetch news");
    }
  } catch (error) {
    console.error("❌ Error processing news request:", error);
    socket.emit("res_res", {
      success: false,
      message: "Failed to fetch news",
      error: error.message,
    });
  }
};