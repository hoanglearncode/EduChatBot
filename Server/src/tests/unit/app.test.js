// src/tests/app.test.js
import request from "supertest";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";
import app from "./app.js";

// Test database URL
const TEST_DB_URL = "mongodb://localhost:27017/chatbot_test";

describe("EduGuide AI Backend", () => {
  let server;
  let httpServer;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(TEST_DB_URL);

    // Start server
    httpServer = createServer(app);
    server = httpServer.listen(0);
  });

  afterAll(async () => {
    // Clean up
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  describe("Health Check", () => {
    test("GET /api/health should return success", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Server is running");
    });
  });

  describe("Chat History API", () => {
    test("GET /history should return empty array initially", async () => {
      const response = await request(app).get("/history").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    test("GET /history with pagination", async () => {
      const response = await request(app)
        .get("/history?limit=10&page=1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.page).toBe(1);
    });

    test("GET /history/:chatId should return 404 for non-existent chat", async () => {
      const response = await request(app)
        .get("/history/non-existent-id")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Chat not found");
    });
  });

  describe("Socket.IO", () => {
    let clientSocket;
    let serverSocket;

    beforeAll((done) => {
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = new Client(`http://localhost:${port}`);

        httpServer.on("connection", (socket) => {
          serverSocket = socket;
        });

        clientSocket.on("connect", done);
      });
    });

    afterAll(() => {
      httpServer.close();
      clientSocket.close();
    });

    test("should connect successfully", (done) => {
      clientSocket.on("connected", (data) => {
        expect(data.success).toBe(true);
        expect(data.message).toBe("Connected to EduGuide AI server");
        done();
      });
    });

    test("should handle send message", (done) => {
      const testMessage = {
        content: "Hello, this is a test message",
        id: "test-chat-id",
        timestamp: new Date().toISOString(),
      };

      clientSocket.emit("send", testMessage);

      clientSocket.on("res", (response) => {
        expect(response.success).toBe(true);
        expect(response.data.content).toBeDefined();
        expect(typeof response.data.content).toBe("string");
        done();
      });
    });

    test("should handle news request", (done) => {
      clientSocket.emit("news", { timestamp: new Date().toISOString() });

      clientSocket.on("res_res", (response) => {
        expect(response.success).toBe(true);
        expect(response.data.content).toBeDefined();
        expect(response.data.content).toContain("📰");
        done();
      });
    });
  });

  describe("Error Handling", () => {
    test("should return 404 for unknown routes", async () => {
      const response = await request(app).get("/unknown-route").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Route not found");
    });

    test("should handle invalid JSON", async () => {
      const response = await request(app)
        .post("/history")
        .send("invalid json")
        .set("Content-Type", "application/json")
        .expect(400);
    });
  });
});

// src/tests/utils.test.js
import {
  generateChatTitle,
  sanitizeInput,
  isValidObjectId,
  parsePagination,
  formatMessage,
  getTimeAgo,
} from "../utils/index.js";

describe("Utility Functions", () => {
  describe("generateChatTitle", () => {
    test("should generate title from message", () => {
      const message = "How to learn programming effectively?";
      const title = generateChatTitle(message);
      expect(title).toBe("How to learn programming effectively");
    });

    test("should truncate long messages", () => {
      const longMessage =
        "This is a very long message that should be truncated because it exceeds the maximum length limit";
      const title = generateChatTitle(longMessage, 30);
      expect(title.length).toBeLessThanOrEqual(30);
      expect(title).toContain("...");
    });

    test("should return default for empty message", () => {
      const title = generateChatTitle("");
      expect(title).toBe("New Chat");
    });
  });

  describe("sanitizeInput", () => {
    test("should remove HTML tags", () => {
      const input = 'Hello <script>alert("xss")</script> world';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello scriptalert("xss")/script world');
    });

    test("should trim whitespace", () => {
      const input = "  hello world  ";
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe("hello world");
    });

    test("should handle non-string input", () => {
      const sanitized = sanitizeInput(null);
      expect(sanitized).toBe("");
    });
  });

  describe("isValidObjectId", () => {
    test("should validate correct ObjectId", () => {
      const validId = "507f1f77bcf86cd799439011";
      expect(isValidObjectId(validId)).toBe(true);
    });

    test("should reject invalid ObjectId", () => {
      const invalidId = "invalid-id";
      expect(isValidObjectId(invalidId)).toBe(false);
    });
  });

  describe("parsePagination", () => {
    test("should parse valid pagination params", () => {
      const req = {
        query: { page: "2", limit: "20" },
      };
      const result = parsePagination(req);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(20);
    });

    test("should use defaults for invalid params", () => {
      const req = {
        query: { page: "invalid", limit: "-5" },
      };
      const result = parsePagination(req);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.skip).toBe(0);
    });
  });

  describe("formatMessage", () => {
    test("should format code message", () => {
      const formatted = formatMessage('console.log("hello")', "code");
      expect(formatted).toContain("```");
    });

    test("should format error message", () => {
      const formatted = formatMessage("Something went wrong", "error");
      expect(formatted).toContain("❌");
      expect(formatted).toContain("Error");
    });
  });

  describe("getTimeAgo", () => {
    test('should return "vừa xong" for recent time', () => {
      const recentTime = new Date(Date.now() - 30000); // 30 seconds ago
      const result = getTimeAgo(recentTime);
      expect(result).toBe("vừa xong");
    });

    test("should return minutes for time within hour", () => {
      const time = new Date(Date.now() - 300000); // 5 minutes ago
      const result = getTimeAgo(time);
      expect(result).toContain("phút trước");
    });
  });
});

// Jest configuration (package.json)
const jestConfig = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/tests/**", "!src/scripts/**"],
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
};

// src/tests/setup.js
import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Set test timeout
jest.setTimeout(30000);

// Global test helpers
global.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error, // Keep error for debugging
};
