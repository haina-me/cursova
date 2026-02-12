import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCByWnhs435dVjgr-DcEv67RNKMklkX5pE",
    authDomain: "florist-3a3b3.firebaseapp.com",
    projectId: "florist-3a3b3",
    storageBucket: "florist-3a3b3.firebasestorage.app",
    messagingSenderId: "223626542328",
    appId: "1:223626542328:web:230fd38d99df8952698f0d",
    measurementId: "G-CVCGKR8WXG"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);