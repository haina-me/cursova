
//проксі 
import { db } from "../config/firebase-config.js";
import { collection, addDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

export function createSecureApi(apiMethods, getCurrentUser) {
    return new Proxy(apiMethods, {
        get(target, property) {
            if (property === 'addFlower' && typeof target[property] === 'function') {
                return async function (...args) {

                    const user = getCurrentUser();
                    if (!user) {
                        throw new Error("Не авторизований");
                    }

                    let authorName = "Початкове ім'я";
                    let authorRole = "Початкова роль";

                    try {
                        const userRef = doc(db, "users", user.uid);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            const userData = userSnap.data();
                            authorName = userData.name || authorName;
                            authorRole = userData.role || authorRole;
                        }

                    } catch (err) {
                        console.error("Профіль не підтягнутий", err);
                    }

                    const flowerData = args[0];

                    const enrichedData = {
                        ...flowerData,
                        _addedByUID: user.uid,
                        _authorName: authorName,
                        _authorRole: authorRole,
                        _timestamp: new Date().toISOString()
                    };

                    const result = await target[property].apply(this, [enrichedData]);

                    try {
                        await addDoc(collection(db, "flower_history"), enrichedData);
                    } catch (err) {
                        console.error("Помилка запису історії", err);
                    }

                    return result;
                };
            }
            return target[property];
        }
    });
}

//декоратор кешування

export function withCache(fn) {
    const cache = new Map();

    return async function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = await fn.apply(this, args);

        cache.set(key, result);
        return result;
    };
}