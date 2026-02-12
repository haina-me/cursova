import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { auth, db } from "./config/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const form = document.querySelector('form');

form.addEventListener('submit', (event) => {

    event.preventDefault();
    const email = form.elements['email'].value;
    const password = form.elements['password'].value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;

            onAuthStateChanged(auth, async (user) => {

                const role = snap.data().role;
                console.log("ROLE =", role);

                if (role === "director") window.location.href = "director.html";
            });

            onAuthStateChanged

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });

});

