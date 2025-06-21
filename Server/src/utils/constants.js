export const AI_RESPONSES = [
  "Tôi hiểu câu hỏi của bạn. Đây là một chủ đề rất thú vị và tôi sẽ cố gắng trả lời một cách chi tiết nhất.",
  "Cảm ơn bạn đã chia sẻ. Dựa trên thông tin bạn cung cấp, tôi nghĩ rằng...",
  "Đây là một câu hỏi hay! Để trả lời chính xác, tôi cần phân tích một số khía cạnh...",
  "Tôi sẽ giải thích vấn đề này một cách dễ hiểu. Trước tiên, chúng ta cần hiểu...",
  "Dựa vào kinh nghiệm và kiến thức của tôi, tôi có thể gợi ý một số hướng giải quyết...",
];

export const NEWS_ITEMS = [
  "📈 Thị trường chứng khoán hôm nay có những diễn biến tích cực...",
  "🌍 Tin tức quốc tế: Các nhà lãnh đạo thế giới họp bàn về biến đổi khí hậu...",
  "🏫 Giáo dục: Bộ Giáo dục công bố chương trình học mới...",
  "💻 Công nghệ: Breakthrough mới trong lĩnh vực AI và machine learning...",
  "🏥 Sức khỏe: Nghiên cứu mới về vaccine và điều trị bệnh...",
];

export const MESSAGE_TYPES = {
  USER: "user",
  AI: "ai",
  SYSTEM: "system",
  NEWS: "news",
};

export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  SEND_MESSAGE: "send",
  RECEIVE_MESSAGE: "res",
  NEWS_REQUEST: "news",
  NEWS_RESPONSE: "res_res",
  NEW_MESSAGE: "new_message",
  CONNECTED: "connected",
  ERROR: "error",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 50,
  MAX_LIMIT: 100,
};