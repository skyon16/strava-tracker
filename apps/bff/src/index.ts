import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { apiRouter } from "./routes/api.routes.js";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "X-XSRF-Token",
    ],
    exposedHeaders: ["Set-Cookie"],
  }),
);

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);
app.use("/auth/", limiter);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

const setupSession = async () => {
  let store;

  if (env.USE_REDIS_SESSION && env.REDIS_URL) {
    try {
      const redisClient = createClient({
        url: env.REDIS_URL,
      });

      redisClient.on("error", (err: Error) => {
        console.error("Redis Client Error:", err);
      });

      await redisClient.connect();
      console.log("✅ Connected to Redis for session storage");

      store = new RedisStore({
        client: redisClient,
        prefix: "sess:",
      });
    } catch (error) {
      console.error("❌ Failed to connect to Redis:", error);
      console.log("⚠️  Falling back to memory store");
    }
  }

  app.use(
    session({
      store,
      name: env.SESSION_NAME,
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      },
    }),
  );
};

await setupSession();

const csrfProtection = csrf({
  cookie: false,
  value: (req: Request) => {
    return (
      (req.headers["x-csrf-token"] as string | undefined) ||
      (req.headers["x-xsrf-token"] as string | undefined) ||
      req.body?._csrf ||
      req.query?._csrf
    );
  },
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }
  next(err);
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error:
      env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

const PORT = parseInt(env.PORT);

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 BFF Server Started Successfully                          ║
║                                                               ║
║   Environment:  ${env.NODE_ENV.padEnd(44)} ║
║   Port:         ${PORT.toString().padEnd(44)} ║
║   Frontend:     ${env.FRONTEND_URL.padEnd(42)} ║
║                                                               ║
║   Health Check: http://localhost:${PORT}/health${" ".repeat(20)} ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});
