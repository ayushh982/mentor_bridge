import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

const PORT = process.env.PORT || 8000;

import connectDB from "./config/db.js";
import app from "./app.js";
import initializeSocket from "./socket/socket.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    },
});

initializeSocket(io);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Server Error", err);
    });