import { FastifyReply, FastifyRequest } from "fastify";
import { getGeminiResponse } from "../../config/gemini";
import { userDetails } from "../user/user.service";

export const geminisuggestion = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const id = (req as any).user._id;
  const user = await userDetails(id);
  if (!user.success) {
    throw new Error(user.message);
  }
  const userJson = JSON.stringify(user.data)
  const geminiResponse = await getGeminiResponse(
    "give the details of users expenses and a suggest them something to manage money",
    userJson
  );
  return res.send({ data: geminiResponse });
};
