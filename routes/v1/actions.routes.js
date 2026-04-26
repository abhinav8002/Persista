import { Router } from "express";
var router = Router();
import { getAllActions, createAction, deleteAction, getAction, editAction } from "../../controllers/actions.controller.js";

router.get('/:projectId/all', getAllActions);
router.post("/:projectId", createAction);
router.delete("/:projectId/:id", deleteAction);
router.get("/:id", getAction);
router.patch("/:projectId/:id", editAction);

export default router;
