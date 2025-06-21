export const generateChatTitle = (firstMessage) => {
  if (!firstMessage || typeof firstMessage !== 'string') {
    return "New Chat";
  }
  
  const words = firstMessage.trim().split(" ").slice(0, 5).join(" ");
  return words.length > 30 ? words.substring(0, 30) + "..." : words;
};

export const formatTimestamp = (date) => {
  return new Date(date).toISOString();
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

export const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id) || typeof id === 'string';
};