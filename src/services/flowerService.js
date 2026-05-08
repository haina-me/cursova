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