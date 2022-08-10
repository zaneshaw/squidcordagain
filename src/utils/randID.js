import { customAlphabet } from "nanoid";
const defaultAlphabet = "123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";

export function generate(alphabet = defaultAlphabet, size = 6) {
	const generator = customAlphabet(alphabet, size);
	return generator();
}
