import { comparePassword } from "../../config/auth";
import userModel from "../../models/user.model";
import { ServiceReturn } from "../../types";

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

export const loginUser = async (email, password): Promise<ServiceReturn> => {
  try {
    const userExists = await userModel.findOne({ email });
    if (!userExists) return { success: false, message: "User doesnot exists" };
    const isPasswordCorrect = await comparePassword(
      password,
      userExists.password
    );
    if (!isPasswordCorrect)
      return { success: false, message: "Incorrect Password" };
    return {
      success: true,
      message: "login successfull",
      data: {
        _id: userExists._id,
        name: userExists.name,
        phone: userExists.phone,
        email: userExists.email,
      },
    };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};

export const deleteUserById = async (id): Promise<ServiceReturn> => {
  try {
    const user = await userModel.findById(id);
    if (!user) return { success: false, message: "User doesnot exist" };
    await userModel.findByIdAndDelete(id);
    return { success: true, message: "user deleted" };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};

export const getUserById = async (id): Promise<ServiceReturn> => {
  try {
    const user = await userModel.findById(id).select("-password");
    if (!user) return { success: false, message: "User doesnot exist" };
    return { success: true, data: user, message: "user data fetched" };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};

export const logOutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.send({ message: "Logged out successfully" });
  } catch (error) {
    return res.send({ error: "Internal error", data: error });
  }
};
