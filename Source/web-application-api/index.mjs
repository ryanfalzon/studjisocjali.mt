import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./swagger-config.mjs";
import healthCheckRoutes from "./routes/health-check-routes.mjs";
import reviewsRoutes from "./routes/reviews-routes.mjs";

const app = express();
const port = process.env.PORT || 3000;

if (process.env.SWAGGER_ENABLED == 1) {
  const swaggerDocs = swaggerJsdoc(swaggerConfig);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use("/health", healthCheckRoutes);
app.use("/reviews", reviewsRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  if (process.env.SWAGGER_ENABLED == 1) {
    console.log(
      `Swagger docs are available at http://localhost:${port}/api-docs`
    );
  }
});
