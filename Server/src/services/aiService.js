import { AI_RESPONSES } from "../utils/constants.js";

export const simulateAIResponse = (userMessage) => {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const randomResponse =
          AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
        
        resolve({
          content: `${randomResponse}\n\nBạn đã hỏi: "${userMessage}"\n\n*Đây là phản hồi mẫu. Module AI thực tế sẽ được tích hợp sau.*`,
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: "ai",
        });
      },
      1000 + Math.random() * 2000 // Random delay 1-3 seconds
    );
  });
};

export const processUserMessage = async (content) => {
  try {
    // Future: Replace with actual AI service call
    const response = await simulateAIResponse(content);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("❌ Error processing AI response:", error);
    return {
      success: false,
      message: "Failed to process AI response",
      error: error.message,
    };
  }
};