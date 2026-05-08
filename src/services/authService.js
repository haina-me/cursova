import { auth, db } from "../config/firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};


export const getUserData = async (uid) => {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
};


export const onAuthChange = (callback) => {
    onAuthStateChanged(auth, callback);
};

export { auth }; 