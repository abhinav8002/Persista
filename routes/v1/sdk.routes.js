import { Router } from "express";

import { getLLMResponse, createChat } from "../../controllers/sdk/chat.controller.js";
import { verifyApiKey } from "../../middleware/sdk.middleware.js";

var router = Router();

router.post("/chat/getresponse", verifyApiKey, getLLMResponse);
router.post("/chat/create", verifyApiKey, createChat);

export default router;
