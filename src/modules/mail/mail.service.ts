import { Mail } from "../../models/mail.model";
import { ServiceReturn } from "../../types";

export const createMail = async (userId, message): Promise<ServiceReturn> => {
  try {
    const mail = await Mail.create({
      userId,
      message,
    });
    if (!mail) {
      return { success: false, message: "Mail not sent" };
    }
    return { success: true, message: "Mail sent", data: mail };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};

export const getMail = async (userId): Promise<ServiceReturn> => {
  try {
    const mail = await Mail.find({ userId });
    return { success: true, message: "fetched", data: mail };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};

export const deleteMail = async (mailId): Promise<ServiceReturn> => {
  try {
    await Mail.findByIdAndDelete(mailId);
    return { success: true, message: "Mail deleted" };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};
