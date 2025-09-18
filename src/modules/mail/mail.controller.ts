import { FastifyReply, FastifyRequest } from "fastify";
import { createMail, deleteMail, getMail } from "./mail.service";
import { userDetails } from "../user/user.service";
import { getGeminiResponse } from "../../config/gemini";
import { MailParams } from "./mail.types";

export const createMailHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const userid = (req as any).user._id;
  const user = await userDetails(userid);
  if (!user.success) {
    throw new Error(user.message);
  }
  const userJson = JSON.stringify(user.data);
  const geminiResponse = await getGeminiResponse(
    "give the details of users expenses and a suggest them something to manage money",
    userJson
  );
  const mail = await createMail(userid, geminiResponse);
  if (!mail.success) {
    throw new Error(mail?.message || "some error occured");
  }
  return res.send({ message: mail.message, data: mail.data });
};

export const getMailHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const userid = (req as any).user._id;
  const mail = await getMail(userid);
  if (!mail.success) {
    throw new Error(mail?.message || "some error occured");
  }
  return res.send({ message: mail.message, data: mail.data });
};

export const deleteMailHandler = async (
  req: FastifyRequest<{ Params: MailParams }>,
  res: FastifyReply
) => {
  const mailId = req.params.mailid;
  const mail = await deleteMail(mailId);
  if (!mail.success) {
    throw new Error(mail.message);
  }
  return res.send({ data: mail?.data, message: mail.message });
};
