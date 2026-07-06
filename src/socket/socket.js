import Message from "../models/Message.js";

const users = new Map();

const initializeSocket = (io) => {

    io.on("connection", (socket) => {

        console.log("User Connected:", socket.id);

        socket.on("join", (userId) => {
            users.set(userId, socket.id);
        });

        socket.on("send_message", async (data) => {

            const {
                conversationId,
                sender,
                receiver,
                text,
            } = data;

            const message = await Message.create({
                conversation: conversationId,
                sender,
                text,
            });

            const populatedMessage = await Message.findById(message._id)
                .populate("sender", "fullName avatar");

            const receiverSocket = users.get(receiver);

            if (receiverSocket) {
                io.to(receiverSocket).emit(
                    "receive_message",
                    populatedMessage
                );
            }

            socket.emit(
                "receive_message",
                populatedMessage
            );

        });

        socket.on("disconnect", () => {

            for (const [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    break;
                }
            }

            console.log("User Disconnected");

        });

    });

};

export default initializeSocket;