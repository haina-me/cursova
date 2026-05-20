// services/security.js
import { db } from "../config/firebase-config.js";
import { collection, addDoc } from "firebase/firestore";
export function createSecureApi(apiMethods, getCurrentUser) {
    return new Proxy(apiMethods, {
        get(target, property) {
            if (property === 'addFlower' && typeof target[property] === 'function') {
                return async function (...args) {

                    const user = getCurrentUser();
                    if (!user) {
                        throw new Error("Не авторизований");
                    }

                    const flowerData = args[0];

                    const enrichedData = {
                        ...flowerData,
                        _addedByUID: user.uid,
                        _timestamp: new Date().toISOString()
                    };

                    const result = await target[property].apply(this, [enrichedData]);

                    try {
                        await addDoc(collection(db, "flower_history"), enrichedData);
                    } catch (error) {
                    }

                    return result;
                };
            }
            return target[property];
        }
    });
}