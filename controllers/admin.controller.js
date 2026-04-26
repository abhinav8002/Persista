import prisma from "../config/db.config.js";
import { response_200, response_201, response_500, response_404 } from "../utils/responseCodes.js";
import { generateRandomAPIKey } from "../utils/generateApiKey.js";

// router.get("/keys", getAllKeys);
// router.post("/keys", createKey);
// router.delete("/keys/:id", deleteKey);
// router.get("/assign/:role", assignDev);
// router.get("/unassign", unassignDev);
// router.get("/analytics", getAnalytics);
// router.post("edit", editProject);

export const getAllKeys = async (req, res) => {
  try {
    const { id } = req.params;
    const keys = await prisma.apiKey.findMany({
      where: {
        projectId: id,
      },
      select: {
        id: true,
        apiKey: true,
        modelType: true,
        apiKeyDescription: true,
        chatEndpoint: true,
        sentimentEndpoint: true,
        analyticsEndpoint: true,
      },
    });
    response_200(res, keys);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const createKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { apiKey, modelType, apiKeyDescription, chatEndpoint, sentimentEndpoint, analyticsEndpoint } = req.body;
    const key = await prisma.apiKey.create({
      data: {
        apiKey,
        modelType,
        apiKeyDescription,
        projectId: id,
      },
    });
    response_201(res, key);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const deleteKey = async (req, res) => {
  try {
    const { id } = req.params;
    const key = await prisma.apiKey.delete({
      where: {
        id,
      },
    });
    response_200(res, "Key deleted successfully");
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const assignDev = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.query.role;
    const devId = req.query.devId;

    const user = await prisma.user.findUnique({
      where: {
        email: devId,
      },
    });

    if (!user) return response_404(res, "User not found");

    const userProjectRelation = await prisma.userProjectRelation.create({
      data: {
        projectId: id,
        userId: user.id,
        isAdmin: role === "admin" ? true : false,
      },
    });

    response_200(res, "Developer assigned successfully");
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const unassignDev = async (req, res) => {
  try {
    const { id } = req.params;
    const devId = req.query.devId;

    const user = await prisma.user.findUnique({
      where: {
        email: devId,
      },
    });

    if (!user) return response_404(res, "User not found");

    const userProjectRelation = await prisma.userProjectRelation.delete({
      where: {
        projectId: id,
        userId: user.id,
      },
    });

    response_200(res, "Developer unassigned successfully");
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

// export const getAnalytics = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const analytics = await prisma.analytics.findMany({
// 			where: {
// 				projectId: id,
// 			},
// 		});
// 		res.status(200).json(analytics);
// 	} catch (error) {
// 		console.log(error);
// 		response_500(res, error);
// 	}
// };

export const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, chatEndpoint } = req.body;

    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        chatEndpoint,
      },
      select: {
        title: true,
        description: true,
        userProjects: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                picture: true,
              },
            },
            isAdmin: true,
          },
        },
        primaryApiKey: true,
        chatEndpoint: true,
        analyticsEndpoint: true,
        apiKeys: {
          select: {
            id: true,
            apiKey: true,
            modelType: true,
            apiKeyDescription: true,
          },
        },
        actions: {
          select: {
            id: true,
            title: true,
            pitch: true,
            projectId: true,
          },
        },
      },
    });
    response_200(res, project);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        description: true,
        userProjects: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                picture: true,
              },
            },
            isAdmin: true,
          },
        },
        primaryApiKey: true,
        chatEndpoint: true,
        analyticsEndpoint: true,
        apiKeys: {
          select: {
            id: true,
            apiKey: true,
            modelType: true,
            apiKeyDescription: true,
          },
        },
        actions: {
          select: {
            id: true,
            title: true,
            pitch: true,
            projectId: true,
          },
        },
      },
    });
    response_200(res, project);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await prisma.project.findMany({
      where: {
        userProjects: {
          some: {
            userId: id,
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        userProjects: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                picture: true,
              },
            },
            isAdmin: true,
          },
        },
        primaryApiKey: true,
        chatEndpoint: true,
        analyticsEndpoint: true,
        apiKeys: {
          select: {
            id: true,
            apiKey: true,
            modelType: true,
            apiKeyDescription: true,
          },
        },
        actions: {
          select: {
            id: true,
            title: true,
            pitch: true,
            projectId: true,
          },
        },
      },
    });
    response_200(res, projects);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, chatEndpoint } = req.body;
    const primaryApiKey = generateRandomAPIKey();

    const project = await prisma.project.create({
      data: {
        title,
        description,
        primaryApiKey,
        chatEndpoint,
      },
    });

    const userProjectRelation = await prisma.userProjectRelation.create({
      data: {
        projectId: project.id,
        userId: req.user.id,
        isAdmin: true,
      },
    });

    const resp = await prisma.project.findUnique({
      where: {
        id: project.id,
      },
      select: {
        title: true,
        description: true,
        userProjects: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                picture: true,
              },
            },
            isAdmin: true,
          },
        },
        primaryApiKey: true,
        chatEndpoint: true,
        analyticsEndpoint: true,
        apiKeys: {
          select: {
            id: true,
            apiKey: true,
            modelType: true,
            apiKeyDescription: true,
          },
        },
        actions: {
          select: {
            id: true,
            title: true,
            pitch: true,
            projectId: true,
          },
        },
      },
      order: {
        createdAt: "desc",
      },
    });

    response_201(res, resp);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userProjectRelation = await prisma.userProjectRelation.deleteMany({
      where: {
        projectId: id,
      },
    });

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        projectId: id,
      },
    });

    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      await prisma.apiKey.delete({
        where: {
          id: apiKey.id,
        },
      });
    }

    const actions = await prisma.action.findMany({
      where: {
        projectId: id,
      },
    });

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      await prisma.action.delete({
        where: {
          id: action.id,
        },
      });
    }

    const project = await prisma.project.delete({
      where: {
        id,
      },
    });

    response_200(res, "Project deleted successfully");
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const regenerateKey = async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = generateRandomAPIKey();
    const key = await prisma.project.update({
      where: {
        id,
      },
      data: {
        primaryApiKey: apiKey,
      },
    });
    response_201(res, key);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};
