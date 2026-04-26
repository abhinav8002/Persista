import { response_401, response_500 } from "../utils/responseCodes.js";
import prisma from "../config/db.config.js";

export async function verifyApiKey(req, res, next) {
  const key = req.header("Authorization");
  if (!key) return response_401(res, "Unauthorized");
  try {
    const match = await prisma.project.findFirst({
      where: {
        primaryApiKey: key,
      },
    });
    if (!match) return response_401(res, "Unauthorized");
    next();
  } catch (err) {
    return response_500(res, err);
  }
}
