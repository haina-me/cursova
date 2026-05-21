import { loginUser, getUserData, onAuthChange } from "./services/authService.js";
import { FlowerSearchReactor } from './services/flowerService.js';
import { createSecureApi } from "./services/security.js";
import { getStockIterator, addFlower } from "./services/flowerService.js";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./config/firebase-config.js";
import { withCache } from "./services/security.js";

let activeUser = null;
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

        activeUser = user;
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

const secureApi = createSecureApi({ addFlower }, () => activeUser);

async function addFlowerToFirebase() {
    const name = inputName.value.trim();
    const size = inputSize.value.trim();
    const count = parseInt(inputCount.value);

    if (!name || !size || isNaN(count)) {
        alert("Поля пусті");
        return;
    }

    try {

        await secureApi.addFlower({ name, size, count });

        alert(`Квітку "${name}" додано`);

        inputName.value = '';
        inputSize.value = '';
        inputCount.value = '';

        const currentSearchText = searchInput ? searchInput.value : "";
        reactor.search(currentSearchText);

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



// Реактор для додавання квітки на склад

const searchInput = document.querySelector('#flower-search');

const reactor = new FlowerSearchReactor();

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        reactor.search(e.target.value);
    });
}

reactor.on('search_completed', (flowers) => {
    if (!stockListContainer) return;

    stockListContainer.innerHTML = '';

    flowers.forEach(flower => {
        const flowerRow = `
            <div class="stock-item">
                <span class="flower-name col-name">${flower.name}</span>
                
                <div class="stock-item-right">
                    <span class="flower-size col-size">${flower.size || '—'}</span>
                    
                    <span class="flower-qty col-qty"><b>${flower.count || 0}</b> шт.</span>
                </div>
            </div>
        `;
        stockListContainer.insertAdjacentHTML('beforeend', flowerRow);
    });

});

//історія змін
//декоратор
async function fetchHistoryFromFirebase() {
    const snapshot = await getDocs(collection(db, "flower_history"));
    if (snapshot.empty) return [];

    const historyData = [];
    snapshot.forEach(doc => historyData.push(doc.data()));

    return historyData.sort((a, b) => new Date(b._timestamp) - new Date(a._timestamp));
}

const getCachedHistory = withCache(fetchHistoryFromFirebase);

const btnHistory = document.getElementById('view-history-btn');
const historyContainer = document.getElementById('history-container');
if (btnHistory) {
    btnHistory.addEventListener('click', async () => {
        if (historyContainer.style.display === 'block') {
            historyContainer.style.display = 'none';
            btnHistory.innerText = 'Переглянути історію змін';
            return;
        }

        historyContainer.style.display = 'block';
        btnHistory.innerText = 'Сховати історію';
        historyContainer.innerHTML = '<div class="history-message">Завантаження історії</div>';

        try {
            const historyData = await getCachedHistory();
            historyContainer.innerHTML = '';

            if (historyData.length === 0) {
                historyContainer.innerHTML = '<div class="history-message">Історія порожня</div>';
                return;
            }

            historyData.sort((a, b) => new Date(b._timestamp) - new Date(a._timestamp));

            historyData.forEach(data => {
                const dateObj = new Date(data._timestamp);
                const dateStr = dateObj.toLocaleDateString('uk-UA');
                const timeStr = dateObj.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

                const authorName = data._authorName || "Початкове ім'я";
                const authorRole = data._authorRole || "Початкова роль";

                const displayRole = authorRole === "director" ? "Директор" : authorRole;

                const rowHtml = `
                    <div class="history-item">
                        <span class="history-time">[${dateStr}, ${timeStr}]</span>
                        <span class="history-user"><b>${displayRole} ${authorName}</b> додав(ла):</span>
                        <span class="history-action">${data.name} (${data.size}, ${data.count} шт.)</span>
                    </div>
                `;
                historyContainer.insertAdjacentHTML('beforeend', rowHtml);
            });

        } catch (error) {
            console.error("Помилка завантаження", error);
            historyContainer.innerHTML = '<div class="history-message">Помилка завантаження</div>';
        }
    });
}