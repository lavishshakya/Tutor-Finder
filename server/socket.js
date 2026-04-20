import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

const getTokenFromSocket = (socket) => {
  const authToken = socket.handshake.auth?.token;
  if (authToken) {
    return authToken;
  }

  const queryToken = socket.handshake.query?.token;
  if (queryToken) {
    return queryToken;
  }

  const header = socket.handshake.headers?.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }

  return null;
};

export const setupSocketServer = (httpServer, allowedOrigins = []) => {
  const io = new Server(httpServer, {
    transports: ["websocket"],
    cors: {
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        if (
          allowedOrigins.includes(origin) ||
          origin.includes("vercel.app") ||
          process.env.NODE_ENV !== "production"
        ) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = getTokenFromSocket(socket);
      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret_key"
      );

      const user = await User.findById(decoded.id).select("_id role name");
      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userRoom = `user:${socket.userId}`;
    socket.join(userRoom);

    socket.emit("socket:ready", {
      userId: socket.userId,
      connectedAt: new Date().toISOString(),
    });

    socket.on("join:conversation", (conversationId) => {
      if (!conversationId || typeof conversationId !== "string") {
        return;
      }
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("leave:conversation", (conversationId) => {
      if (!conversationId || typeof conversationId !== "string") {
        return;
      }
      socket.leave(`conversation:${conversationId}`);
    });
  });

  return io;
};
