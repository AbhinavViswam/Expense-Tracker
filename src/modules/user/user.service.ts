import mongoose from "mongoose";
import { comparePassword } from "../../config/auth";
import userModel from "../../models/user.model";
import { Wallet } from "../../models/wallet.model";
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

export const userDetails = async (id) => {
  try {

    const details  = await userModel.aggregate([
      {$match:{_id:new mongoose.Types.ObjectId(id)}},
      {
        $lookup:{
          from:"categories",
          localField:"_id",
          foreignField:"userId",
          as:"category"
        }
      },
      {
        $lookup:{
          from:"wallets",
          localField:"_id",
          foreignField:"userId",
          as:"wallet"
        }
      },
      {
        $lookup:{
          from:"expenses",
          localField:"_id",
          foreignField:"userid",
          as:"expense"
        }
      },
      {
        $project:{
          password:0
        }
      }
    ])
    return {success:true , message:"fetched", data:details[0]}
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};
