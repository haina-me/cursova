import { db } from "../config/firebase-config.js";
import {
    collection,
    doc,
    getDocs,
    setDoc,
    query
} from "firebase/firestore";

export async function* getStockIterator() {
    try {
        const querySnapshot = await getDocs(query(collection(db, "flower")));
        for (const doc of querySnapshot.docs) {
            yield { name: doc.id, ...doc.data() };
        }
    } catch (error) {
        console.error("Помилка при ітерації складу:", error);
        throw error;
    }
}

export const addFlower = async (flowerData) => {
    const { name, size, count } = flowerData;

    try {
        const flowerRef = doc(db, "flower", name);

        await setDoc(flowerRef, {
            size: size,
            count: Number(count)
        });

        return true;
    } catch (error) {
        console.error("Помилка при додаванні квітки", error);
        throw error;
    }
};

// Реактор для пошуку квіток зі складу
export class FlowerSearchReactor {
    constructor() {
        this.listeners = {};
        this.searchTimeout = null;
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }

    search(text) {

        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(async () => {
            const query = text.trim().toLowerCase();

            const iterator = getStockIterator();
            const results = [];

            while (true) {
                const { value: flower, done } = await iterator.next();
                if (done) break;

                if (flower.name && flower.name.toLowerCase().includes(query)) {
                    results.push(flower);
                }
            }

            this.emit('search_completed', results);

        }, 400);
    }
}