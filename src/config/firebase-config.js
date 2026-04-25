import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCByWnhs435dVjgr-DcEv67RNKMklkX5pE",
    authDomain: "florist-3a3b3.firebaseapp.com",
    projectId: "florist-3a3b3",
    storageBucket: "florist-3a3b3.firebasestorage.app",
    messagingSenderId: "223626542328",
    appId: "1:223626542328:web:230fd38d99df8952698f0d",
    measurementId: "G-CVCGKR8WXG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);