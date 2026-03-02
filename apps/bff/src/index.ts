import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import csrf from "tiny-csrf";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { apiRouter } from "./routes/api.routes.js";
import { eventsRouter } from "./routes/events.routes.js";

const app = express();

if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

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
  skip: () => env.NODE_ENV === "development",
});

app.use("/api/", limiter);
app.use("/auth/", limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.SESSION_SECRET));
app.use(
  csrf(
    env.SESSION_SECRET,
    env.NODE_ENV === "development" ? [] : ["POST", "PUT", "PATCH", "DELETE"],
  ),
);

const setupSession = async () => {
  let store;

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
app.use("/event", eventsRouter);

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

const PORT = env.PORT;

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
