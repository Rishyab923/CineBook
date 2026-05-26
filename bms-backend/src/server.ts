import { register } from './config/metrics';
import app from "./app";
import connectDB from "./config/db";

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 9000;

    // Connect MongoDB
    await connectDB();

    // Prometheus Metrics Endpoint
    app.get('/metrics', async (_req, res) => {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    });

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
