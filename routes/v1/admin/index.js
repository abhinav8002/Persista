import { Router } from 'express';
var router = Router();
import {
	regenerateKey,
	getAllProjects,
	getAllKeys, 
    getProject,
	createKey,
	deleteKey,
	deleteProject,
	editProject,
	assignDev,
	unassignDev,
} from "../../../controllers/admin.controller.js";

//regenerate and delete primary api key routes and controllers are left to be implemented

router.get('/:id/projects', getAllProjects);
router.get('/:id/keys', getAllKeys);
router.post("/:id/keys", createKey);
router.delete('/keys/:id', deleteKey);
router.get('/assign/:id', assignDev);
router.get('/unassign', unassignDev);
// router.get('/analytics', getAnalytics);
router.post('/:id/edit', editProject);
router.get('/:id', getProject);
router.delete('/:id', deleteProject);
router.get('/:id/regenerate', regenerateKey);

export default router;
