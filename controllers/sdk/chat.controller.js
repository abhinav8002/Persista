import prisma from "../../config/db.config.js";
import { response_500, response_404, response_201, response_200 } from "../../utils/responseCodes.js";
import axios from "axios";

const getContext = (action) => {
  return `Here is some information about ${action.project.title}: ${action.project.description}\n${action.pitch}`;
};

export const createChat = async (req, res) => {
  try {
    const { actionId } = req.body;

    const action = await prisma.action.findUnique({
      where: {
        id: actionId,
      },
      select: {
        firstQuery: true,
      },
    });

    if (!action) return response_404(res, "Action not found");

    const chat = await prisma.chat.create({
      data: {
        actionId: actionId,
      },
    });

    response_201(res, {
      id: chat.id,
      response: action.firstQuery,
    });
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};

export const getLLMResponse = async (req, res) => {
  try {
    const { chatId, answer } = req.body;

    const [chatObj, chats] = await Promise.all([
      prisma.chat.findUnique({
        where: {
          id: chatId,
        },
        include: {
          action: {
            select: {
              id: true,
              instruction: true,
              pitch: true,
              project: {
                select: {
                  title: true,
                  description: true,
                  chatEndpoint: true,
                },
              },
            },
          },
        },
      }),
      prisma.messages.findMany({
        where: {
          chatId: chatId,
        },
        select: {
          message: true,
          response: true,
        },
      }),
    ]);

    if (!chatObj) return response_404(res, "Chat not found");
    if (chatObj.status !== "INDETERMINATE") return response_404(res, "Chat has ended");

    let history = "";
    chats.map((chat) => {
      history += `${chat.message}---${chat.response};`;
    });

    if (!chatObj) return response_404(res, "Action not found");

    let body = new FormData();
    body.append("query", answer);
    body.append("context", getContext(chatObj.action));
    body.append("instruction", chatObj.action.instruction);
    body.append("history", history);
    body.append("id", chatId);

    var response = await axios.post(chatObj.action.project.chatEndpoint, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await prisma.messages.create({
      data: {
        chatId: chatId,
        message: answer,
        response: response.data.response,
        sentiment: response.data.sentiment_score,
        isUser: true,
      },
    });

    if (response.data.status !== 0) {
      await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          status: response.data.status === 1 ? "POSITIVE" : "NEGATIVE",
        },
      });
    }

    response_200(res, response.data);
  } catch (error) {
    console.log(error);
    response_500(res, error);
  }
};
