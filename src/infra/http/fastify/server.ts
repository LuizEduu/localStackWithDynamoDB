import { server, envConfig } from "./config";

const start = async () => {
  try {
    await server.listen({ port: envConfig.PORT });

    console.log(`🚀 HTTP server is running on port ${envConfig.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
