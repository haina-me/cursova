import { auth, db } from "./config/firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


const loginForm = document.querySelector('.card');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();


        const email = loginForm.elements['email'].value;
        const password = loginForm.elements['password'].value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log("Успішний вхід!");
            })
            .catch((error) => alert("Помилка: " + error.message));
    });
}


onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Користувач авторизований:", user.uid);
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
            const data = snap.data();
            if (data.role === "director") {
                window.location.replace("/director.html");
            } else {
                alert("Ваша роль: " + data.role + ". Доступ до панелі директора заборонено.");
            }
        } else {
            console.error("Документ користувача не знайдено в Firestore");
        }
    }
});
