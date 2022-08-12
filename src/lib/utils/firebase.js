import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, doc, getDoc } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyD2LujrAaEfPqvE13EVam7PkDVnCRUZELk",
	authDomain: "squidcord-ee3bf.firebaseapp.com",
	projectId: "squidcord-ee3bf",
	storageBucket: "squidcord-ee3bf.appspot.com",
	messagingSenderId: "970707296726",
	appId: "1:970707296726:web:12ac9f42055ba51f48c477",
	measurementId: "G-3GXQ2ZEJL3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

connectFirestoreEmulator(db, "172.18.20.16", 2341);
connectAuthEmulator(auth, "http://172.18.20.16:9099");

export async function getUser(uid) {
	const ref = doc(db, "users", uid);
	const snap = await getDoc(ref);
	if (snap.exists()) {
		return snap.data();
	} else {
		console.error("User doesn't exist!");
		return null;
	}
};
