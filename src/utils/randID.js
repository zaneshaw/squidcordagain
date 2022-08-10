import { customAlphabet } from "nanoid";
const alphabet = "123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";

export function generate(size = 6) {
	const generator = customAlphabet(alphabet, size);
	return generator();
}
