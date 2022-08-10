import { customAlphabet } from "nanoid";
const alphabet = "123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";

export async function generate(size = 6) {
	const generator = customAlphabet(alphabet, size);
	return await generator();
}