import { writable } from "svelte/store";
export const users = writable([]);
export const timeout = writable(false);