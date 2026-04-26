import express from "express";
const router = express.Router();
import { gitHubRedirect, tokenTransfer } from "../../controllers/auth/githubAuth.controller.js";
import { googleLogin, googleCallback, handleGoogleCallback } from "../../controllers/auth/googleAuth.controller.js";
import { response_200, response_500 } from "../../utils/responseCodes.js";
import { verifyUser } from "../../middleware/auth.middleware.js";

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback, handleGoogleCallback);

router.get("/github", gitHubRedirect);
router.get("/github/callback", tokenTransfer);

router.get("/verify", verifyUser, (req, res) => {
	response_200(res, "Verified", req.user);
});


export default router;
