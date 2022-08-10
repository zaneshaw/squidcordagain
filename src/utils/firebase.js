import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
