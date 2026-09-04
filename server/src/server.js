import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

const startServer = async () => {
  await connectDB();

  const app = createApp();
  const server = app.listen(ENV.PORT, () => {
    console.log(`[Freelance OS Server] Running on http://localhost:${ENV.PORT} [${ENV.NODE_ENV}]`);
  });

  const handleShutdown = () => {
    console.log('[Freelance OS Server] Received termination signal. Closing HTTP server gracefully.');
    server.close(() => {
      console.log('[Freelance OS Server] Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
};

startServer();
