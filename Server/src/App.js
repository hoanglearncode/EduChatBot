import express from "express";
import morgan from "morgan";
import { corsConfig } from "./config/cors.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(corsConfig);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("combined"));

// Routes
app.use(routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;