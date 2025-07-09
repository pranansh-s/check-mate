import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";

import SocketController from "./controllers/socket.controller.js";
import {
  appCors,
  appRateLimiter,
  handleRouteErrors,
} from "./utils/middleware.js";
import { configSocket } from "./config.js";

import routes from "./routes.js";

const app = express();
const server = createServer(app);
const io = configSocket(server);

const socketController = new SocketController();
io.on("connection", socketController.useSocketConnection);

app.use(helmet());
app.use(appCors);
app.use(appRateLimiter);
app.use(express.json());

app.use(routes);
app.use(handleRouteErrors);

const PORT = process.env.PORT ?? 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
