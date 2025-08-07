import userModel from "../../models/user.model";
import { Wallet } from "../../models/wallet.model";
import { Wallettrack } from "../../models/walletTracker.model";
import { ServiceReturn } from "../../types";

export const createWallet = async (id): Promise<ServiceReturn> => {
  try {
    const wallet = await Wallet.create({
      userId: id,
      amount: 0,
    });
    if (!wallet) return { message: "Wallet not created", success: false };
    return { message: "wallet created", success: true };
  } catch (error) {
    return { data: error, message: "internal error", success: false };
  }
};

export const createWalletTrack = async (
  walletId,
  description,
  amount,
  status
): Promise<ServiceReturn> => {
  try {
    const walletTrack = await Wallettrack.create({
      walletId,
      description,
      amount,
      status,
    });
    if (!walletTrack)
      return { success: false, message: "wallet track not created" };
    return {
      success: true,
      data: walletTrack,
      message: "Amount added to wallet",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      data: error,
    };
  }
};

export const AddToWallet = async (
  userId: string,
  amount: number,
  description?: string
): Promise<ServiceReturn> => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, amount: 0 });
    }

    wallet.amount += amount;
    await wallet.save();

    await createWalletTrack(wallet._id, description, amount, "credited");

    return {
      success: true,
      data: wallet,
      message: "Amount added to wallet",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      data: error,
    };
  }
};
export const SubFromWallet = async (
  userId: string,
  amount: number,
  description?: string
): Promise<ServiceReturn> => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, amount: 0 });
    }

    wallet.amount -= amount;
    await wallet.save();

    await createWalletTrack(wallet._id, description, amount, "debited");

    return {
      success: true,
      data: wallet,
      message: "Amount debited from wallet",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      data: error,
    };
  }
};
