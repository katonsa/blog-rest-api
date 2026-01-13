import 'dotenv/config';
import { app } from './app';
import { prisma } from './db/prisma';

const APP_PORT = Number(process.env.APP_PORT) || 3000;
const ENVIRONMENT = process.env.NODE_ENV;
const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT_MS) || 30_000;

const startServer = async () => {
  try {
    await prisma.$connect();
    // Start server
    const server = app.listen(APP_PORT, () => {
      console.info(
        `Server running on port ${APP_PORT} in ${ENVIRONMENT} environment mode.`
      );
    });

    // Graceful shutdown
    let isShuttingDown = false;

    const gracefulShutdown = async (signal: string) => {
      if (isShuttingDown) {
        console.info(`${signal} received but shutdown already in progress.`);
        return;
      }
      isShuttingDown = true;

      console.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async (err) => {
        if (err) {
          console.error('Error closing HTTP server:', err);
        }
        console.info('HTTP server closed');

        try {
          await prisma.$disconnect();
          console.info('Database connection closed');
        } catch (disconnectError) {
          console.error('Error disconnecting from database:', disconnectError);
        }

        process.exit(0);
      });

      // Force shutdown after timeout
      const forceShutdownTimer = setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT_MS);
      forceShutdownTimer.unref();
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: any) => {
      console.error('Unhandled Rejection:', reason);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
