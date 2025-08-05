import userModel from "../../models/user.model";

interface ServiceReturn {
  success: boolean;
  message: string;
  data?: any;
}

export const createUser = async (
  name,
  email,
  phone,
  password
): Promise<ServiceReturn> => {
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) return { success: false, message: "User already exists" };
    const user = await userModel.create({
      name,
      phone,
      email,
      password,
    });
    return {
      success: true,
      message: "Successfully registered user",
      data: user,
    };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};

export const deleteUserById = async (id) => {
  try {
    const user = await userModel.findById(id);
    if (!user) return "User doesnot exist";
    await userModel.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};
