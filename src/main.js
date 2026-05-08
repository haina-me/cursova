import { loginUser, getUserData, onAuthChange } from "./services/authService.js";

const loginForm = document.querySelector('.card');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = loginForm.elements['email'].value;
        const password = loginForm.elements['password'].value;

        loginUser(email, password)
            .then(() => console.log("Успішний вхід"))
            .catch((error) => alert("Помилка: " + error.message));
    });
}

onAuthChange(async (user) => {
    if (user) {
        console.log("Користувач авторизований:", user.uid);

        if (window.location.pathname.includes("director.html")) {
            return;
        }

        const data = await getUserData(user.uid);

        if (data) {
            if (data.role === "director") {
                window.location.replace("/director.html");
            } else {
                alert(`Ваша роль: ${data.role}. Доступ заборонено.`);
            }
        } else {
            console.error("Документ користувача не знайдено в Firestore");
        }
    }
});


import { getStockIterator, addFlower } from "./services/flowerService.js";

const stockListContainer = document.querySelector('#stock-list');
const inputName = document.querySelector('#new-flower-name');
const inputSize = document.querySelector('#new-flower-size');
const inputCount = document.querySelector('#new-flower-count');
const flowerForm = document.querySelector('#flower-form');


async function renderStock() {
    if (!stockListContainer) return;
    stockListContainer.innerHTML = '';

    try {
        for await (const flower of getStockIterator()) {
            const flowerRow = `
                <div class="stock-item">
                    <span class="flower-name">${flower.name}</span>
                    <div class="stock-item-right">
                        <span class="flower-size">${flower.size || '—'}</span>
                        <span class="flower-qty"><b>${flower.count || 0}</b> шт.</span>
                    </div>
                </div>
            `;
            stockListContainer.insertAdjacentHTML('beforeend', flowerRow);
        }
    } catch (error) {
        console.error("Помилка рендеру:", error);
    }
}


async function addFlowerToFirebase() {
    const name = inputName.value.trim();
    const size = inputSize.value.trim();
    const count = parseInt(inputCount.value);

    if (!name || !size || isNaN(count)) {
        alert("Поля пусті");
        return;
    }

    try {
        await addFlower({ name, size, count });

        alert(`Квітку "${name}" додано`);

        inputName.value = '';
        inputSize.value = '';
        inputCount.value = '';

        renderStock();

    } catch (error) {
        console.error("Помилка при додаванні:", error);
        alert("Квітка не додана");
    }
}

if (flowerForm) {
    flowerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        await addFlowerToFirebase();
    });
}

renderStock();