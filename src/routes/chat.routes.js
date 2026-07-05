import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import {
    createConversation,
    getConversations,
    getMessages,
} from "../controllers/chat.controller.js";

const router = Router();

router.post(
    "/conversation",
    verifyJWT,
    createConversation
);

router.get(
    "/conversations",
    verifyJWT,
    getConversations
);

router.get(
    "/messages/:conversationId",
    verifyJWT,
    getMessages
);

export default router;