import app from "./app";
import connectDB from "./config/db";

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 9000;

    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
