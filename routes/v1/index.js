import { Router } from "express";
import adminRouter from "./admin/index.js";
import authRouter from "./auth.routes.js";
import actionsRoter from "./actions.routes.js";
import sdkRouter from "./sdk.routes.js";
import { verifyAdmin, verifyUser } from "../../middleware/auth.middleware.js";
import  { verifyApiKey } from "../../middleware/sdk.middleware.js";
import { createProject } from "../../controllers/admin.controller.js";
import { editEndpoints } from "../../controllers/actions.controller.js";

var router = Router();

router.use("/admin", verifyUser, adminRouter);
router.use("/auth", authRouter);
router.post("/project", verifyUser, createProject)
router.patch("/project/:id", verifyUser, editEndpoints);
router.use("/actions", verifyUser, actionsRoter);
router.use("/sdk", verifyApiKey, sdkRouter);


export default router;
