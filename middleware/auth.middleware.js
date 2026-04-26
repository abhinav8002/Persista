import jwt from "jsonwebtoken";
import { response_401, response_500 } from "../utils/responseCodes.js";
import prisma from "../config/db.config.js";

export async function verifyUser(req, res, next) {
	var token = req.header("Authorization");
	if (!token) return response_401(res, "Unauthorized");
	try {
		token = token.split(" ")[1];
		const decoded = jwt.verify(token, process.env.SECRET);
		const user = await prisma.user.findUnique({
			where: {
				email: decoded.email,
			},
		});
		if (!user) return response_401(res, "Unauthorised");
		req.user = user;
		next();
	} catch (err) {
		return response_500(res, err);
	}
}

export async function verifyAdmin(req, res, next) {
	var token = req.header("Authorization");
	if (!token) return response_401(res, "Unauthorized");
	try {
		token = token.split(" ")[1];
		const decoded = jwt.verify(token, process.env.SECRET);
		const user = await prisma.user.findUnique({
			where: {
				email: decoded.email,
			},
			include: {
				projects: {
					where: {
						projectId: decoded.projectId,
						isAdmin: true,
					},
				},
			},
		});

		if (!user || !user.projects.length)
			return response_401(res, "Unauthorized");

		req.user = user;
		next();
	} catch (err) {
		return response_500(res, err);
	}
}
