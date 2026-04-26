import prisma from "../config/db.config.js";
import { response_200, response_201, response_500, response_404 } from "../utils/responseCodes.js";

// router.get("/", getAllActions);
// router.post("/", createAction);
// router.delete("/:id", deleteAction);
// router.get("/:id", getAction);
// router.patch("/:id", editAction);

export const getAllActions = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return response_404(res, "Project ID not found");

    const actions = await prisma.action.findMany({
      where: {
        projectId,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            primaryApiKey: true,
          },
        },
      },
    });
    response_200(res, actions);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const createAction = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, pitch, firstQuery } = req.body;
    const action = await prisma.action.create({
      data: {
        title,
        pitch,
        projectId,
        firstQuery,
      },
      select: {
        id: true,
        title: true,
        pitch: true,
        firstQuery: true,
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            primaryApiKey: true,
          },
        },
      },
    });
    response_201(res, action);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const deleteAction = async (req, res) => {
  try {
    const { id } = req.params;
    const action = await prisma.action.delete({
      where: {
        id,
      },
    });
    response_200(res, action);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const getAction = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const action = await prisma.action.findUnique({
      where: {
        id,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            primaryApiKey: true,
          },
        },
      },
    });
    response_200(res, action);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const editAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pitch } = req.body;
    const action = await prisma.action.update({
      where: {
        id,
      },
      data: {
        title,
        pitch,
      },
    });
    response_200(res, action);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const editEndpoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { chatEndpoint, analyticsEndpoint } = req.body;

    if (!chatEndpoint && !analyticsEndpoint) {
      return response_404(res, "Endpoints not found");
    }

    const data = {};

    if (chatEndpoint) {
      data.chatEndpoint = chatEndpoint;
    }

    if (analyticsEndpoint) {
      data.analyticsEndpoint = analyticsEndpoint;
    }

    const project = await prisma.project.update({
      where: {
        id,
      },
      data,
    });

    response_200(res, project);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};
