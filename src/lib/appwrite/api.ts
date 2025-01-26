import { ID } from "appwrite";
import { INewUser } from "../../types";
import { account, appwriteConfig, avatars, databases } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.username
    );

    if (!newAccount) throw new Error("Failed to create user account");

    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accoountId: newAccount.$id,
      name: newAccount.name,
      username: user.username,
      email: newAccount.email,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create user account");
  }
}

export async function saveUserToDB(user: {
  accoountId: string;
  name: string;
  username?: string;
  email: string;
  imageUrl: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}
