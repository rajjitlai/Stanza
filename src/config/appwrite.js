import { Client, Account, ID } from "appwrite";

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);

export async function createSession(email) {
    try {
        const userId = ID.unique();

        const sessionToken = await account.createEmailToken(
            userId,
            email,
            true
        );

        return { sessionToken, userId };

    } catch (error) {
        console.error("Error creating session:", error);
        throw error;
    }
}

export default client;
