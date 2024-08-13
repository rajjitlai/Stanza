import { Client, Account, ID } from "appwrite";

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);

export const createMagicURL = async(email, redirectUrl) => {
    try {
        const userId = ID.unique();

        const response = await account.createMagicURLToken(
            userId,
            email,
            redirectUrl
        );

        return response;

    } catch (error) {
        console.error("Error creating login session:", error);
        throw error;
    }
}

export const verifyMagicURL = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const secret = urlParams.get('secret')
    const userId = urlParams.get('userId')

    if (secret) {
        const user = await account.updateMagicURLSession(userId, secret)
        return user;
    } else {
        throw new Error('Invalid parameters')
    }
}

export default client;