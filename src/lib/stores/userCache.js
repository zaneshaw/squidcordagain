import { writable, get } from "svelte/store";

export const users = writable([]);
export const timeout = writable(false);

export function inCache(uid) {
	return get(users).find((x) => x.uid === uid);
}
