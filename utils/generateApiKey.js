import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// Function to generate a random API key
export function generateRandomAPIKey(length = process.env.API_KEY_LENGTH) {
	const charset =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-";
	let apiKey = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		apiKey += charset.charAt(randomIndex);
	}

	return apiKey;
}